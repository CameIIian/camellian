declare const __dirname: string;
declare const require: any;
declare const process: any;

type IncomingMessage = { url?: string };
type ServerResponse = {
  writeHead: (statusCode: number, headers: Record<string, string>) => void;
  end: (chunk?: string | Uint8Array) => void;
};

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { links } = require("./links");

const port = Number(process.env.PORT ?? 3000);

const stylesPath = path.resolve(__dirname, "../public/styles.css");
const profilePath = path.resolve(__dirname, "../public/icon.png");
const articlesDirPath = path.resolve(__dirname, "../resources/articles");
const picturesDirPath = path.resolve(__dirname, "../resources/pictures");
const repoRootPath = path.resolve(__dirname, "..");

type TabKind = "links" | "articles" | "photo";

type ArticleMeta = {
  slug: string;
  title: string;
  fileName: string;
  updatedAt: number;
  tags: string[];
};

type PictureMeta = {
  fileName: string;
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const normalizeExternalUrl = (url: string): string =>
  /^https?:\/\//i.test(url) ? url : `https://${url}`;

const sanitizeExternalUrl = (url: string): string => {
  const normalizedUrl = normalizeExternalUrl(url.trim());

  try {
    const parsed = new URL(normalizedUrl);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.href;
    }
  } catch (_error) {
    return "#";
  }

  return "#";
};

const linkifyPlainUrls = (text: string): string => {
  const urlPattern =
    /(^|[\s(>])((?:https?:\/\/|www\.)[^\s<]+|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s<]*)?)/g;

  return text.replace(urlPattern, (_match: string, prefix: string, rawUrl: string) => {
    const trailingMatch = rawUrl.match(/[),.;:!?]+$/);
    const trailing = trailingMatch ? trailingMatch[0] : "";
    const trimmedUrl = trailing ? rawUrl.slice(0, -trailing.length) : rawUrl;

    if (!trimmedUrl.includes(".")) {
      return `${prefix}${rawUrl}`;
    }

    const href = sanitizeExternalUrl(trimmedUrl);
    return `${prefix}<a href="${href}" target="_blank" rel="noopener noreferrer">${trimmedUrl}</a>${trailing}`;
  });
};

const parseInlineMarkdown = (text: string): string => {
  let escaped = escapeHtml(text);

  escaped = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
  escaped = escaped.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  escaped = escaped.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  escaped = escaped.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (_match: string, label: string, rawUrl: string) => {
    const href = sanitizeExternalUrl(rawUrl);
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });

  escaped = escaped
    .split(/(<[^>]+>)/g)
    .map((segment: string) => (segment.startsWith("<") ? segment : linkifyPlainUrls(segment)))
    .join("");

  return escaped;
};

const markdownToHtml = (markdown: string): string => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: string[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      blocks.push("</ul>");
      inList = false;
    }
  };

  const renderCodeBlock = (source: string): string => {
    const escapedCode = escapeHtml(source);
    return `<div class="code-block"><button type="button" class="code-copy-button" aria-label="コードをコピー">Copy</button><pre><code>${escapedCode}</code></pre></div>`;
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trimEnd();

    if (line.startsWith("```") && !inCodeBlock) {
      closeList();
      inCodeBlock = true;
      codeLines = [];
      return;
    }

    if (line.startsWith("```") && inCodeBlock) {
      inCodeBlock = false;
      blocks.push(renderCodeBlock(codeLines.join("\n")));
      codeLines = [];
      return;
    }

    if (inCodeBlock) {
      codeLines.push(rawLine);
      return;
    }

    if (line === "") {
      closeList();
      return;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      closeList();
      const level = headingMatch[1].length;
      const content = parseInlineMarkdown(headingMatch[2]);
      blocks.push(`<h${level}>${content}</h${level}>`);
      return;
    }

    if (/^[-*]\s+/.test(line)) {
      if (!inList) {
        blocks.push('<ul class="article-list-markdown">');
        inList = true;
      }

      const content = parseInlineMarkdown(line.replace(/^[-*]\s+/, ""));
      blocks.push(`<li>${content}</li>`);
      return;
    }

    if (/^>\s?/.test(line)) {
      closeList();
      const content = parseInlineMarkdown(line.replace(/^>\s?/, ""));
      blocks.push(`<blockquote>${content}</blockquote>`);
      return;
    }

    if (/^---+$/.test(line)) {
      closeList();
      blocks.push("<hr />");
      return;
    }

    closeList();
    blocks.push(`<p>${parseInlineMarkdown(line)}</p>`);
  });

  closeList();

  if (inCodeBlock) {
    blocks.push(renderCodeBlock(codeLines.join("\n")));
  }

  return blocks.join("\n");
};

const getGitLastModifiedAt = (absoluteFilePath: string): number | null => {
  const relativeFilePath = path.relative(repoRootPath, absoluteFilePath);

  if (relativeFilePath.startsWith("..")) {
    return null;
  }

  try {
    const timestamp = execFileSync("git", ["log", "-1", "--format=%ct", "--", relativeFilePath], {
      cwd: repoRootPath,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();

    const unixSeconds = Number(timestamp);
    return Number.isFinite(unixSeconds) && unixSeconds > 0 ? unixSeconds * 1000 : null;
  } catch (_error) {
    return null;
  }
};

const parseArticleDateFromMarkdown = (markdown: string): number | null => {
  const datePattern = /^\s*(?:date\s*:\s*)?(\d{4}\/\d{2}\/\d{2})\s*$/im;
  const match = markdown.match(datePattern);

  if (!match) {
    return null;
  }

  const [yearText, monthText, dayText] = match[1].split("/");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const parsed = new Date(year, month - 1, day);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed.getTime();
};

const getArticleMetas = (): ArticleMeta[] => {
  if (!fs.existsSync(articlesDirPath)) {
    return [];
  }

  return fs
    .readdirSync(articlesDirPath)
    .filter((fileName: string) => fileName.endsWith(".md"))
    .map((fileName: string) => {
      const articlePath = path.join(articlesDirPath, fileName);
      const source = fs.readFileSync(articlePath, "utf-8");
      const firstHeading = source
        .split(/\r?\n/)
        .map((line: string) => line.trim())
        .find((line: string) => line.startsWith("# "));

      const title = firstHeading ? firstHeading.slice(2).trim() : fileName.replace(/\.md$/, "");
      const slug = fileName.replace(/\.md$/, "");
      const stats = fs.statSync(articlePath);
      const markdownDate = parseArticleDateFromMarkdown(source);
      const gitLastModifiedAt = getGitLastModifiedAt(articlePath);
      const tagsLine = source
        .split(/\r?\n/)
        .map((line: string) => line.trim())
        .find((line: string) => /^tags?:\s*/i.test(line));

      const tags = tagsLine
        ? tagsLine
            .replace(/^tags?:\s*/i, "")
            .split(",")
            .map((tag: string) => tag.trim())
            .filter(Boolean)
        : ["untagged"];

      return {
        slug,
        title,
        fileName,
        updatedAt: markdownDate ?? gitLastModifiedAt ?? stats.mtimeMs,
        tags,
      };
    })
    .sort((a: ArticleMeta, b: ArticleMeta) => b.updatedAt - a.updatedAt);
};

const getPictureMetas = (): PictureMeta[] => {
  if (!fs.existsSync(picturesDirPath)) {
    return [];
  }

  return fs
    .readdirSync(picturesDirPath)
    .filter((fileName: string) => /\.(png|jpg|jpeg)$/i.test(fileName))
    .sort((a: string, b: string) => a.localeCompare(b, "ja"))
    .map((fileName: string) => ({ fileName }));
};

const loadArticleHtmlBySlug = (slug: string): { title: string; html: string } | null => {
  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
    return null;
  }

  const articlePath = path.join(articlesDirPath, `${slug}.md`);

  if (!fs.existsSync(articlePath)) {
    return null;
  }

  const markdown = fs.readFileSync(articlePath, "utf-8");
  const lines = markdown.split(/\r?\n/);
  const firstHeading = lines.map((line: string) => line.trim()).find((line: string) => line.startsWith("# "));
  const title = firstHeading ? firstHeading.slice(2).trim() : slug;

  return {
    title,
    html: markdownToHtml(markdown),
  };
};

const formatUpdatedAt = (updatedAt: number): string =>
  new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(updatedAt));

const getGithubUsername = (): string | null => {
  const githubLink = links.find((link: { name: string; url: string }) =>
    link.name.toLowerCase().includes("github")
  );

  if (!githubLink) {
    return null;
  }

  const match = githubLink.url.match(/github\.com\/([^/?#]+)/i);
  return match ? match[1] : null;
};

const renderArticlesWorkspace = (selectedSlug?: string): string => {
  const articles = getArticleMetas();

  if (articles.length === 0) {
    return `<p class="empty-message">~/resources/articles 配下に .md を置くとここに表示されます。</p>`;
  }

  const fallbackSlug = articles[0].slug;
  const activeSlug = selectedSlug ?? fallbackSlug;
  const selectedArticle = loadArticleHtmlBySlug(activeSlug);

  const list = articles
    .map(
      (article, index) => `
      <li
        class="article-nav-item ${article.slug === activeSlug ? "is-selected" : ""}"
        data-title="${escapeHtml(article.title.toLowerCase())}"
        data-tags="${escapeHtml(article.tags.join(",").toLowerCase())}"
      >
        <a href="/articles/${article.slug}" class="article-nav-link">
          <span class="line-no">${String(index + 1).padStart(2, "0")}</span>
          <span class="article-nav-main">
            <span class="article-nav-title">${escapeHtml(article.title)}</span>
            <span class="article-nav-date">${formatUpdatedAt(article.updatedAt)}</span>
            <span class="article-nav-tags">${article.tags
              .map((tag) => `<span class="article-tag">${escapeHtml(tag)}</span>`)
              .join("")}</span>
          </span>
        </a>
      </li>`
    )
    .join("\n");

  const availableTags = Array.from(new Set(articles.flatMap((article) => article.tags))).sort((a, b) =>
    a.localeCompare(b, "ja")
  );

  const tagsFilter = availableTags
    .map(
      (tag) =>
        `<button type="button" class="article-filter-tag" data-filter-tag="${escapeHtml(
          tag.toLowerCase()
        )}">${escapeHtml(tag)}</button>`
    )
    .join("\n");

  const articleView = selectedArticle
    ? `
      <article class="markdown-article">
        ${selectedArticle.html}
      </article>
    `
    : `
      <p class="empty-message">指定した記事が見つかりませんでした。</p>
    `;

  return `
    <section class="articles-workspace">
      <div class="articles-sidebar-backdrop" data-sidebar-close></div>
      <aside class="articles-sidebar" id="articles-sidebar">
        <div class="article-filter-panel">
          <label for="article-search" class="article-filter-label">search</label>
          <input
            id="article-search"
            class="article-search-input"
            type="search"
            placeholder="タイトルで検索..."
            autocomplete="off"
          />
          <p class="article-filter-label">tags</p>
          <div class="article-filter-tags">
            <button type="button" class="article-filter-tag is-active" data-filter-tag="all">all</button>
            ${tagsFilter}
          </div>
          <p class="article-filter-summary" id="article-filter-summary">${articles.length} 件表示中</p>
        </div>
        <ul class="article-nav-list">${list}\n</ul>
      </aside>
      <section class="articles-content">
        ${articleView}
      </section>
      <button
        type="button"
        class="article-menu-toggle"
        aria-label="記事一覧メニューを開く"
        aria-controls="articles-sidebar"
        aria-expanded="false"
      >
        ☰ Menu
      </button>
    </section>
    <script>
      (() => {
        const workspace = document.querySelector(".articles-workspace");
        const menuToggleButton = document.querySelector(".article-menu-toggle");
        const sidebarCloseElements = Array.from(document.querySelectorAll("[data-sidebar-close]"));
        const sidebarLinks = Array.from(document.querySelectorAll(".article-nav-link"));
        const searchInput = document.querySelector("#article-search");
        const tagButtons = Array.from(document.querySelectorAll(".article-filter-tag"));
        const articleItems = Array.from(document.querySelectorAll(".article-nav-item"));
        const summary = document.querySelector("#article-filter-summary");
        const codeCopyButtons = Array.from(document.querySelectorAll(".code-copy-button"));

        const closeSidebar = () => {
          if (!workspace || !menuToggleButton) {
            return;
          }

          workspace.classList.remove("is-sidebar-open");
          menuToggleButton.setAttribute("aria-expanded", "false");
        };

        const openSidebar = () => {
          if (!workspace || !menuToggleButton) {
            return;
          }

          workspace.classList.add("is-sidebar-open");
          menuToggleButton.setAttribute("aria-expanded", "true");
        };

        if (workspace && menuToggleButton) {
          menuToggleButton.addEventListener("click", () => {
            const isOpen = workspace.classList.contains("is-sidebar-open");
            if (isOpen) {
              closeSidebar();
            } else {
              openSidebar();
            }
          });

          sidebarCloseElements.forEach((element) => {
            element.addEventListener("click", closeSidebar);
          });

          sidebarLinks.forEach((link) => {
            link.addEventListener("click", closeSidebar);
          });

          document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
              closeSidebar();
            }
          });
        }

        const setupCopyButtons = () => {
          if (codeCopyButtons.length === 0) {
            return;
          }

          codeCopyButtons.forEach((button) => {
            button.addEventListener("click", async () => {
              const block = button.closest(".code-block");
              const codeElement = block ? block.querySelector("code") : null;
              const codeText = codeElement ? codeElement.textContent ?? "" : "";

              if (!codeText) {
                return;
              }

              try {
                await navigator.clipboard.writeText(codeText);
                button.textContent = "Copied!";
                button.classList.add("is-copied");
              } catch (_error) {
                button.textContent = "Failed";
              }

              window.setTimeout(() => {
                button.textContent = "Copy";
                button.classList.remove("is-copied");
              }, 1400);
            });
          });
        };

        setupCopyButtons();

        if (!searchInput || tagButtons.length === 0 || articleItems.length === 0 || !summary) {
          return;
        }

        let activeTag = "all";

        const applyFilter = () => {
          const query = searchInput.value.trim().toLowerCase();
          let visibleCount = 0;

          articleItems.forEach((item) => {
            const title = item.getAttribute("data-title") ?? "";
            const tags = (item.getAttribute("data-tags") ?? "").split(",").filter(Boolean);
            const matchesQuery = query.length === 0 || title.includes(query);
            const matchesTag = activeTag === "all" || tags.includes(activeTag);
            const isVisible = matchesQuery && matchesTag;

            item.style.display = isVisible ? "" : "none";
            if (isVisible) {
              visibleCount += 1;
            }
          });

          summary.textContent = visibleCount + " 件表示中";
        };

        searchInput.addEventListener("input", applyFilter);

        tagButtons.forEach((button) => {
          button.addEventListener("click", () => {
            activeTag = button.getAttribute("data-filter-tag") ?? "all";

            tagButtons.forEach((otherButton) => {
              otherButton.classList.toggle("is-active", otherButton === button);
            });

            applyFilter();
          });
        });

        applyFilter();
      })();
    </script>
  `;
};

const renderPhotoWorkspace = (): string => {
  const pictures = getPictureMetas();

  if (pictures.length === 0) {
    return `
      <p class="prompt">visitor@camellian:~$ ll ~/Pictures/*.{png,jpg}</p>
      <p class="prompt">visitor@camellian:~$ _</p>
    `;
  }

  const items = pictures
    .map(
      (picture: PictureMeta, index: number) => `
      <figure class="photo-item">
        <figcaption class="photo-source">
          <span class="line-no">${String(index + 1).padStart(2, "0")}</span>
          <code>${escapeHtml(picture.fileName)}</code>
        </figcaption>
        <img
          src="/pictures/${encodeURIComponent(picture.fileName)}"
          alt="${escapeHtml(picture.fileName)}"
          class="photo-image"
          loading="lazy"
        />
      </figure>
    `
    )
    .join("\n");

  return `
    <section class="photo-workspace">
      <p class="prompt">visitor@camellian:~$ ll ~/Pictures/*.{png,jpg}</p>
      <div class="photo-list">
        ${items}
      </div>
      <p class="prompt">visitor@camellian:~$ _</p>
    </section>
  `;
};

const renderPage = (activeTab: TabKind, contentOverride?: string, pageTitle?: string) => {
  const githubUsername = getGithubUsername();

  const contributionsContent = githubUsername
    ? `
      <section class="contributions-section" aria-label="GitHub contributions">
        <p class="contribution-heading">GitHub Contributions (${escapeHtml(githubUsername)})</p>
        <a
          href="https://github.com/${encodeURIComponent(githubUsername)}"
          class="contributions-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://ghchart.rshah.org/bd93f9/${encodeURIComponent(githubUsername)}"
            alt="${escapeHtml(githubUsername)} の GitHub contribution chart"
            class="contributions-chart"
          />
        </a>
      </section>
`
    : `<p class="empty-message">GitHubユーザ名を取得できなかったため、contributionsを表示できません。</p>`;

  const renderedLinks = links
    .map(
      (link: { icon: string; name: string; url: string; description: string }, index: number) => `
      <li class="link-item">
        <span class="line-no">${String(index + 1).padStart(2, "0")}</span>
        <a href="${sanitizeExternalUrl(link.url)}" target="_blank" rel="noopener noreferrer">
          <span class="link-label">
            <span class="link-icon" aria-hidden="true">${escapeHtml(link.icon)}</span>
            <span>${escapeHtml(link.name)}</span>
          </span>
        </a>
        <span class="desc"># ${escapeHtml(link.description)}</span>
      </li>`
    )
    .join("\n");

  const defaultTabContent =
    activeTab === "links"
      ? `
      <p class="prompt">visitor@camellian:~$ ~/link.sh</p>
      <ul class="link-list">
        ${renderedLinks}
      </ul>

      <p class="prompt">visitor@camellian:~$ whoami</p>
      <section class="profile-section">
        <img src="/icon.png" alt="プロフィール写真" class="profile-image" />
        <div class="profile-text">
          <p>
            その辺の大学の情報科出身の<strong>一般VRChatter</strong>です。<br/>
            名前は好きに呼んでください。<strong>かめさん</strong>が多いかも。<br/>
            <strong>Linux</strong>と<strong>Terminal</strong>が好きです。今は<strong>Pop!_OS</strong>ユーザです。<br/>
            <strong>C/C++</strong>と<strong>Python</strong>はわずかに分かります。<br/>
          </p><p>
            26年4月から<strong>情報通信関連</strong>で仕事します。
          </p>
        </div>
      </section>
      <p class="prompt">visitor@camellian:~$ cat contributions</p>
      ${contributionsContent}
      <p class="prompt">visitor@camellian:~$ _</p>`
      : activeTab === "articles"
      ? `
      ${renderArticlesWorkspace()}
`
      : `
      ${renderPhotoWorkspace()}
`;

  const tabContent = contentOverride ?? defaultTabContent;

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle ?? "Link Collection"}</title>
  <link rel="icon" type="image/png" href="/icon.png" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <main class="terminal">
    <header class="terminal-header">
      <div class="dots">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>

      <p>CamTerm</p>
    </header>

    <nav class="tab-bar" aria-label="main tabs">
      <a href="/links" class="tab-item ${activeTab === "links" ? "is-active" : ""}">about</a>
      <a href="/articles" class="tab-item ${activeTab === "articles" ? "is-active" : ""}">articles</a>
      <a href="/photo" class="tab-item ${activeTab === "photo" ? "is-active" : ""}">photo</a>
    </nav>

    <section class="terminal-body">
      ${tabContent}
    </section>
  </main>
</body>
</html>`;
};

const renderArticlePage = (slug: string): string => {
  const article = loadArticleHtmlBySlug(slug);
  const pageTitle = article ? `${article.title} | articles` : "articles";
  return renderPage("articles", renderArticlesWorkspace(slug), pageTitle);
};

const serveFile = (res: ServerResponse, filePath: string, contentType: string) => {
  const file = fs.readFileSync(filePath, "utf-8");
  res.writeHead(200, { "Content-Type": contentType });
  res.end(file);
};

const serveBinaryFile = (res: ServerResponse, filePath: string, contentType: string) => {
  const file = fs.readFileSync(filePath);
  res.writeHead(200, { "Content-Type": contentType });
  res.end(file);
};

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  const requestPath = (req.url ?? "").split("?")[0];

  if (requestPath === "/styles.css") {
    serveFile(res, stylesPath, "text/css; charset=utf-8");
    return;
  }

  if (requestPath === "/icon.png") {
    serveBinaryFile(res, profilePath, "image/png");
    return;
  }

  if (requestPath === "/") {
    res.writeHead(302, { Location: "/links" });
    res.end();
    return;
  }

  if (requestPath === "/links") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderPage("links"));
    return;
  }

  if (requestPath === "/articles") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderPage("articles"));
    return;
  }

  if (requestPath === "/photo") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderPage("photo"));
    return;
  }

  const pictureMatch = requestPath.match(/^\/pictures\/([^/]+)$/);
  if (pictureMatch) {
    const rawName = decodeURIComponent(pictureMatch[1]);

    if (!/^[a-zA-Z0-9._-]+$/.test(rawName) || !/\.(png|jpe?g)$/i.test(rawName)) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
      return;
    }

    const picturePath = path.resolve(picturesDirPath, rawName);
    if (!picturePath.startsWith(picturesDirPath) || !fs.existsSync(picturePath)) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
      return;
    }

    const contentType = /\.png$/i.test(rawName) ? "image/png" : "image/jpeg";
    serveBinaryFile(res, picturePath, contentType);
    return;
  }

  const articleMatch = requestPath.match(/^\/articles\/([a-zA-Z0-9_-]+)$/);
  if (articleMatch) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderArticlePage(articleMatch[1]));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not Found");
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
