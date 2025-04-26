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
  ],
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
  umami: {
    enabled: true,
    id: "321f68d2-1667-450a-ac30-22166d693b6d",
    host: "https://analytics.locyan.cn",
    autoTrack: true,
    ignoreLocalhost: true,
  },
});
