import { defineConfig } from "vitepress";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base =
  process.env.GITHUB_ACTIONS && repositoryName ? `/${repositoryName}/` : "/";

const englishNav = [
  { text: "Overview", link: "/" },
  { text: "Concepts", link: "/concepts" },
  { text: "Adoption", link: "/adoption-playbook" },
  { text: "CLI", link: "/cli" },
  { text: "Base Template", link: "/templates/base" },
];

const englishSidebar = [
  {
    text: "Guide",
    items: [
      { text: "Overview", link: "/" },
      { text: "Concepts", link: "/concepts" },
      { text: "Adoption Playbook", link: "/adoption-playbook" },
      { text: "CLI", link: "/cli" },
      { text: "Base Template", link: "/templates/base" },
    ],
  },
];

const japaneseNav = [
  { text: "概要", link: "/ja/" },
  { text: "基本概念", link: "/ja/concepts" },
  { text: "導入", link: "/ja/adoption-playbook" },
  { text: "CLI", link: "/ja/cli" },
  { text: "Base Template", link: "/ja/templates/base" },
];

const japaneseSidebar = [
  {
    text: "ガイド",
    items: [
      { text: "概要", link: "/ja/" },
      { text: "基本概念", link: "/ja/concepts" },
      { text: "導入プレイブック", link: "/ja/adoption-playbook" },
      { text: "CLI", link: "/ja/cli" },
      { text: "Base Template", link: "/ja/templates/base" },
    ],
  },
];

export default defineConfig({
  title: "Project Standards",
  description: "Shared repository standards, templates, and CLI workflows.",
  base,
  lastUpdated: true,
  themeConfig: {
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/Jabelic-Works/project-standards",
      },
    ],
  },
  locales: {
    root: {
      label: "English",
      lang: "en-US",
      title: "Project Standards",
      description: "Shared repository standards, templates, and CLI workflows.",
      themeConfig: {
        nav: englishNav,
        sidebar: englishSidebar,
        langMenuLabel: "Languages",
        lastUpdatedText: "Last updated",
        outlineTitle: "On this page",
        returnToTopLabel: "Return to top",
      },
    },
    ja: {
      label: "日本語",
      lang: "ja-JP",
      title: "Project Standards",
      description: "共有リポジトリ標準、テンプレート、CLI ワークフロー。",
      themeConfig: {
        nav: japaneseNav,
        sidebar: japaneseSidebar,
        langMenuLabel: "言語",
        lastUpdatedText: "最終更新",
        outlineTitle: "このページについて",
        returnToTopLabel: "ページ上部へ戻る",
      },
    },
  },
});
