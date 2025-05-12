import AutoImport from "unplugin-auto-import/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  ssr: false,
  modules: [
    "@nuxt/eslint",
    "nuxtjs-naive-ui",
    "nuxt-umami",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "dayjs-nuxt",
  ],
  runtimeConfig: {
    public: {
      devMode: false,
      turnstileSitekey: "",
      vaptchaVid: "",
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
      title: "LoCyanFrp Dashboard",
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
