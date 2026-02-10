export type LinkItem = {
  name: string;
  url: string;
  description: string;
};

export const links: LinkItem[] = [
  {
    name: "X (Twitter)",
    url: "https://x.com",
    description: "最新の投稿やお知らせをチェック"
  },
  {
    name: "GitHub",
    url: "https://github.com",
    description: "コードやプロジェクトを公開"
  },
  {
    name: "Qiita",
    url: "https://qiita.com",
    description: "技術記事の投稿先"
  },
  {
    name: "Zenn",
    url: "https://zenn.dev",
    description: "知見の共有・記事管理"
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com",
    description: "動画コンテンツの配信"
  }
];
