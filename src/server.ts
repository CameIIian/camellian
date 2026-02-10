declare const __dirname: string;
declare const require: any;
declare const process: any;

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { links } = require("./links");

const port = Number(process.env.PORT ?? 3000);

const stylesPath = path.resolve(__dirname, "../public/styles.css");

const renderPage = () => {
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
      <p>links@portfolio:~$ cat links.txt</p>
    </header>

    <section class="terminal-body">
      <p class="prompt">$ ようこそ、Link集へ。</p>
      <ul class="link-list">
        ${renderedLinks}
      </ul>
      <p class="prompt">$ _</p>
    </section>
  </main>
</body>
</html>`;
};

const server = http.createServer((req: { url?: string }, res: any) => {
  if (req.url === "/styles.css") {
    const styles = fs.readFileSync(stylesPath, "utf-8");
    res.writeHead(200, { "Content-Type": "text/css; charset=utf-8" });
    res.end(styles);
    return;
  }

  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderPage());
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not Found");
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
