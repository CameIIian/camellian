export {};
declare const __dirname: string;
declare const require: any;
declare const process: any;

type ChildProcess = {
  kill: (signal?: string) => void;
  on: (event: string, listener: (...args: any[]) => void) => void;
};

const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { spawn } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const distDir = path.resolve(repoRoot, "cloudflare-dist");
const articlesDirPath = path.resolve(repoRoot, "resources/articles");
const picturesDirPath = path.resolve(repoRoot, "resources/pictures");
const publicDir = path.resolve(repoRoot, "public");

const port = 4173;

const ensureDir = (dirPath: string) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const writeRouteHtml = (route: string, html: string) => {
  const normalized = route === "/" ? "" : route.replace(/^\//, "");
  const routeDir = path.join(distDir, normalized);
  ensureDir(routeDir);
  fs.writeFileSync(path.join(routeDir, "index.html"), html, "utf-8");
};

const writeRouteFile = (route: string, body: string) => {
  const normalized = route.replace(/^\//, "");
  const outputPath = path.join(distDir, normalized);
  ensureDir(path.dirname(outputPath));
  fs.writeFileSync(outputPath, body, "utf-8");
};

const requestHtml = (route: string): Promise<string> =>
  new Promise((resolve, reject) => {
    http
      .get(
        {
          host: "127.0.0.1",
          port,
          path: route,
        },
        (res: any) => {
          let body = "";
          res.setEncoding("utf-8");
          res.on("data", (chunk: string) => {
            body += chunk;
          });
          res.on("end", () => {
            if (res.statusCode !== 200) {
              reject(new Error(`${route} returned status ${res.statusCode}`));
              return;
            }
            resolve(body);
          });
        }
      )
      .on("error", reject);
  });

const requestWithRetry = async (route: string, attempts: number): Promise<string> => {
  let lastError: unknown;

  for (let index = 0; index < attempts; index += 1) {
    try {
      return await requestHtml(route);
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  throw lastError;
};

const getArticleSlugs = (): string[] => {
  if (!fs.existsSync(articlesDirPath)) {
    return [];
  }

  return fs
    .readdirSync(articlesDirPath)
    .filter((fileName: string) => fileName.endsWith(".md"))
    .map((fileName: string) => fileName.replace(/\.md$/, ""))
    .sort((a: string, b: string) => a.localeCompare(b, "ja"));
};

const copyPublicAssets = () => {
  ensureDir(distDir);
  const files = fs.readdirSync(publicDir);

  files.forEach((fileName: string) => {
    const source = path.join(publicDir, fileName);
    const destination = path.join(distDir, fileName);
    fs.copyFileSync(source, destination);
  });

  const iconAliasPath = path.join(distDir, "public.icon");
  fs.copyFileSync(path.join(publicDir, "icon.png"), iconAliasPath);
};

const copyPictures = () => {
  if (!fs.existsSync(picturesDirPath)) {
    return;
  }

  const destinationDir = path.join(distDir, "pictures");
  ensureDir(destinationDir);

  fs.readdirSync(picturesDirPath)
    .filter((fileName: string) => /\.(png|jpe?g)$/i.test(fileName))
    .forEach((fileName: string) => {
      fs.copyFileSync(path.join(picturesDirPath, fileName), path.join(destinationDir, fileName));
    });
};

const buildCloudflareDist = async () => {
  fs.rmSync(distDir, { recursive: true, force: true });
  ensureDir(distDir);

  const child: ChildProcess = spawn("node", [path.join(repoRoot, "dist/server.js")], {
    cwd: repoRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: String(port),
    },
  });

  let settled = false;

  const stopServer = () => {
    if (!settled) {
      settled = true;
      child.kill("SIGTERM");
    }
  };

  process.on("exit", stopServer);
  process.on("SIGINT", () => {
    stopServer();
    process.exit(1);
  });
  process.on("SIGTERM", () => {
    stopServer();
    process.exit(1);
  });

  try {
    await requestWithRetry("/links", 20);

    const articleSlugs = getArticleSlugs();
    const routes = ["/links", "/articles", "/photo", ...articleSlugs.map((slug) => `/articles/${slug}`)];

    for (const route of routes) {
      const html = await requestWithRetry(route, 3);
      writeRouteHtml(route, html);
    }

    const ogpRoutes = ["/ogp/links.svg", "/ogp/photo.svg", "/ogp/articles.svg", ...articleSlugs.map((slug) => `/ogp/articles/${slug}.svg`)];
    for (const route of ogpRoutes) {
      const svg = await requestWithRetry(route, 3);
      writeRouteFile(route, svg);
    }

    writeRouteHtml("/", `<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/links"></head><body></body></html>`);
    fs.writeFileSync(path.join(distDir, "_redirects"), "/ /links 302\n", "utf-8");

    copyPublicAssets();
    copyPictures();
  } finally {
    stopServer();
  }
};

buildCloudflareDist().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
