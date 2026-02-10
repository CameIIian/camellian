declare const __dirname: string;
declare const require: any;
declare const process: any;

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { links } = require("./links");

const port = Number(process.env.PORT ?? 3000);

const stylesPath = path.resolve(__dirname, "../public/styles.css");
const profilePath = path.resolve(__dirname, "../public/icon.png");

type TabKind = "links" | "articles";

const renderPage = (activeTab: TabKind) => {
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

  const tabContent =
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
      <p class="prompt">root@camellian:~$ ls ~/articles</p>
      <p class="empty-message">まだ記事はありません。</p>
`;

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Link Collection</title>
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

const serveFile = (res: any, filePath: string, contentType: string) => {
  const file = fs.readFileSync(filePath, "utf-8");
  res.writeHead(200, { "Content-Type": contentType });
  res.end(file);
};

const serveBinaryFile = (res: any, filePath: string, contentType: string) => {
  const file = fs.readFileSync(filePath); // ← encoding を指定しない
  res.writeHead(200, { "Content-Type": contentType });
  res.end(file);
};

const server = http.createServer((req: { url?: string }, res: any) => {
  if (req.url === "/styles.css") {
    serveFile(res, stylesPath, "text/css; charset=utf-8");
    return;
  }

  if (req.url === "/icon.png") {
    serveBinaryFile(res, profilePath, "image/png");
    return;
  }

  if (req.url === "/") {
    res.writeHead(302, { Location: "/links" });
    res.end();
    return;
  }

  if (req.url === "/links") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderPage("links"));
    return;
  }

  if (req.url === "/articles") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderPage("articles"));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not Found");
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
