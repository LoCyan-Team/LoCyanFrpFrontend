import AutoImport from "unplugin-auto-import/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: "2025-10-16",
  devtools: { enabled: true },
  // ssr: false,
  modules: [
    "@nuxt/eslint",
    "nuxt-umami",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "dayjs-nuxt",
    "@nuxtjs/mdc",
    "@bg-dev/nuxt-naiveui",
    "nuxt-build-info",
  ],
  runtimeConfig: {
    public: {
      devMode: process.env.NODE_ENV === "development",
      capJsEndpoint: "",
      capJsSiteKey: "",
      apiUrl: "",
      apiBackupUrl: "",
      docUrl: "",
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => {
        const customElements = ["cap-widget"];

        return customElements.includes(tag);
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
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            const xiconsPackages = [
              "@vicons/carbon",
              "@vicons/fa",
              "@vicons/fluent",
              "@vicons/ionicons4",
              "@vicons/ionicons5",
              "@vicons/material",
            ];

            if (xiconsPackages.some((pkg) => id.includes(pkg))) {
              return "xicons-library";
            }

            return undefined;
          },
        },
      },
    },
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
    useDirective: true,
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
    },
  },
  devServer: {
    host: "0.0.0.0",
    port: 8090,
  },
});
