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
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const parseInlineMarkdown = (text: string): string => {
  let escaped = escapeHtml(text);

  escaped = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
  escaped = escaped.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  escaped = escaped.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  escaped = escaped.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

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

      return {
        slug,
        title,
        fileName,
        updatedAt: stats.mtimeMs,
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

const renderArticlesIndex = (): string => {
  const articles = getArticleMetas();

  if (articles.length === 0) {
    return `<p class="empty-message">~/resources/articles 配下に .md を置くとここに表示されます。</p>`;
  }

  const list = articles
    .map(
      (article, index) => `
      <li class="link-item">
        <span class="line-no">${String(index + 1).padStart(2, "0")}</span>
        <a href="/articles/${article.slug}">${escapeHtml(article.title)}</a>
        <span class="desc"># ${escapeHtml(article.fileName)}</span>
      </li>`
    )
    .join("\n");

  return `<ul class="link-list">${list}\n</ul>`;
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
`
      : `
      <p class="prompt">root@camellian:~$ ls ~/resources/articles</p>
      ${renderArticlesIndex()}
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
      <a href="/links" class="tab-item ${activeTab === "links" ? "is-active" : ""}">links</a>
      <a href="/articles" class="tab-item ${activeTab === "articles" ? "is-active" : ""}">articles</a>
    </nav>

    <section class="terminal-body">
      ${tabContent}

      <p class="prompt">root@camellian:~$ _</p>
    </section>
  </main>
</body>
</html>`;
};

const renderArticlePage = (slug: string): string | null => {
  const article = loadArticleHtmlBySlug(slug);

  if (!article) {
    return null;
  }

  const content = `
    <p class="prompt">root@camellian:~$ cat ~/resources/articles/${escapeHtml(slug)}.md</p>
    <article class="markdown-article">
      ${article.html}
    </article>
    <p><a href="/articles" class="back-link">← articles 一覧に戻る</a></p>
  `;

  return renderPage("articles", content, `${article.title} | articles`);
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
    const articleHtml = renderArticlePage(articleMatch[1]);
    if (articleHtml) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(articleHtml);
      return;
    }
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not Found");
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
