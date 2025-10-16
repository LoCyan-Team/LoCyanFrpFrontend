import AutoImport from "unplugin-auto-import/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";

import git from "git-rev-sync";

let GIT_COMMIT_HASH = "unknown";
let GIT_BRANCH = "unknown";
let GIT_LAST_COMMIT_DATE = new Date().toISOString();

try {
  GIT_COMMIT_HASH = git.short();
  GIT_BRANCH = git.branch();
  GIT_LAST_COMMIT_DATE = git.date().toISOString();
} catch {
  console.warn("Not a Git repository.");
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-10-16',
  devtools: { enabled: true },
  // ssr: false,
  nitro: {
    experimental: {
      wasm: true,
    },
  },
  modules: [
    "@nuxt/eslint",
    "nuxt-umami",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "dayjs-nuxt",
    "@nuxtjs/mdc",
    "@bg-dev/nuxt-naiveui",
  ],
  runtimeConfig: {
    public: {
      devMode: process.env.NODE_ENV === "development",
      turnstileSitekey: "",
      vaptchaVid: "",
      git: {
        branch: GIT_BRANCH,
        commitHash: GIT_COMMIT_HASH,
        lastCommitDate: GIT_LAST_COMMIT_DATE,
      },
    },
  },
  vite: {
    plugins: [
      AutoImport({
        imports: [
          {
            "naive-ui": [
              "useDialog",
              "useMessage",
              "useNotification",
              "useLoadingBar",
            ],
          },
        ],
      }),
      Components({
        resolvers: [NaiveUiResolver()],
      }),
    ],
  },
  piniaPluginPersistedstate: {
    storage: "localStorage",
  },
  dayjs: {
    locales: ["zh-cn"],
    defaultLocale: "zh-cn",
    plugins: ["timezone", "localizedFormat"],
    defaultTimezone: "Asia/Shanghai",
  },
  umami: {
    enabled: true,
    id: "321f68d2-1667-450a-ac30-22166d693b6d",
    host: "https://analytics.locyan.cn",
    autoTrack: true,
    ignoreLocalhost: true,
  },
  app: {
    pageTransition: { name: "fade", mode: "out-in" },
    head: {
      htmlAttrs: {
        lang: "zh-CN",
      },
      title: "仪表盘",
      titleTemplate: "乐青映射 - LoCyanFrp | %s",
      meta: [{ name: "color-scheme", content: "dark light" }],
      script: [
        {
          src: "https://v-cn.vaptcha.com/v3.js",
          async: true,
        },
      ],
    },
  },
  devServer: {
    host: "0.0.0.0",
    port: 8090,
  },
});
