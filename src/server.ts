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
const { links } = require("./links");

const port = Number(process.env.PORT ?? 3000);

const stylesPath = path.resolve(__dirname, "../public/styles.css");
const profilePath = path.resolve(__dirname, "../public/icon.png");
const articlesDirPath = path.resolve(__dirname, "../resources/articles");

type TabKind = "links" | "articles";

type ArticleMeta = {
  slug: string;
  title: string;
  fileName: string;
  updatedAt: number;
  tags: string[];
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

    const href = normalizeExternalUrl(trimmedUrl);
    return `${prefix}<a href="${href}" target="_blank" rel="noopener noreferrer">${trimmedUrl}</a>${trailing}`;
  });
};

const parseInlineMarkdown = (text: string): string => {
  let escaped = escapeHtml(text);

  escaped = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
  escaped = escaped.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  escaped = escaped.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  escaped = escaped.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (_match: string, label: string, rawUrl: string) => {
    const href = normalizeExternalUrl(rawUrl);
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
      blocks.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
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
    blocks.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  }

  return blocks.join("\n");
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
        updatedAt: stats.mtimeMs,
        tags,
      };
    })
    .sort((a: ArticleMeta, b: ArticleMeta) => b.updatedAt - a.updatedAt);
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
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(updatedAt));

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
      <aside class="articles-sidebar">
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
    </section>
    <script>
      (() => {
        const searchInput = document.querySelector("#article-search");
        const tagButtons = Array.from(document.querySelectorAll(".article-filter-tag"));
        const articleItems = Array.from(document.querySelectorAll(".article-nav-item"));
        const summary = document.querySelector("#article-filter-summary");

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

const renderPage = (activeTab: TabKind, contentOverride?: string, pageTitle?: string) => {
  const renderedLinks = links
    .map(
      (link: { name: string; url: string; description: string }, index: number) => `
      <li class="link-item">
        <span class="line-no">${String(index + 1).padStart(2, "0")}</span>
        <a href="${link.url}" target="_blank" rel="noopener noreferrer">
          ${link.name}
        </a>
        <span class="desc"># ${link.description}</span>
      </li>`
    )
    .join("\n");

  const defaultTabContent =
    activeTab === "links"
      ? `
      <p class="prompt">root@camellian:~$ ~/link.sh</p>
      <ul class="link-list">
        ${renderedLinks}
      </ul>

      <p class="prompt">root@camellian:~$ whoami</p>
      <section class="profile-section">
        <img src="/icon.png" alt="プロフィール写真" class="profile-image" />
        <div class="profile-text">
          <p>
            その辺の大学の情報科出身の<strong>一般VRChatter</strong>です。<br/>
            名前は好きに呼んでください。<strong>かめさん</strong>が多いかも。<br/>
            <strong>Linux</strong>と<strong>terminal</strong>が好きです。今は<strong>Pop_OS!</strong>ユーザです<br/>
            <strong>C/C++</strong>と<strong>Python</strong>はわずかに分かります。<br/>
          </p><p>
            26年4月から<strong>情報通信関連</strong>で仕事します。
          </p>
        </div>
      </section>
      <p class="prompt">root@camellian:~$ cat contributions</p>
`
      : `
      ${renderArticlesWorkspace()}
`;

  const tabContent = contentOverride ?? defaultTabContent;

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle ?? "Link Collection"}</title>
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
