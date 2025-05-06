<template>
  <nuxt-loading-indicator />
  <n-config-provider
    :hljs="hljs"
    :theme="osTheme"
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <n-watermark
      content="开发版本，不代表最终品质"
      cross
      selectable
      :font-size="16"
      :line-height="48"
      :width="512"
      :height="512"
      :x-offset="128"
      :y-offset="128"
      :rotate="-15"
      :show="env.devMode"
    >
      <n-message-provider>
        <n-dialog-provider>
          <n-notification-provider>
            <notification-inject />
            <n-layout v-if="!loaded" style="height: 100dvh">
              <n-spin :show="true" class="load-container">
                <template #description>
                  <n-text>加载中，稍安勿躁......</n-text>
                </template>
              </n-spin>
            </n-layout>
            <n-layout v-else style="height: 100dvh" :native-scrollbar="false">
              <n-layout-header bordered>
                <site-header />
              </n-layout-header>
              <n-layout has-sider style="height: calc(100dvh - 61px)">
                <n-el v-if="pageSidebar" class="sidebar-container">
                  <sidebar />
                </n-el>
                <n-layout-content
                  :native-scrollbar="false"
                  class="content"
                  style="width: 100%"
                >
                  <nuxt-page style="min-height: calc(100dvh - 61px)" />
                  <n-layout-footer bordered>
                    <site-footer />
                  </n-layout-footer>
                </n-layout-content>
              </n-layout>
            </n-layout>
          </n-notification-provider>
        </n-dialog-provider>
      </n-message-provider>
    </n-watermark>
  </n-config-provider>
</template>

<script setup lang="ts">
import "@/assets/css/style.css";

import { dateZhCN, zhCN, useOsTheme, darkTheme } from "naive-ui";

import SiteHeader from "@/components/Header.vue";
import SiteFooter from "@/components/Footer.vue";

import NotificationInject from "~/components/inject/Notification.vue";

import hljs from "highlight.js/lib/core";
import ini from "highlight.js/lib/languages/ini";
import nginx from "highlight.js/lib/languages/nginx";

import { usePageStore } from "@/store/page";

const { public: publicConfig } = useRuntimeConfig();

const env = {
  devMode: publicConfig.DEV_MODE === "true",
};

useHead({
  htmlAttrs: {
    lang: "zh-CN",
  },
  script: [
    {
      src: "https://v-cn.vaptcha.com/v3.js",
      async: true,
    },
  ],
  title: "LoCyanFrp Dashboard",
});

const loaded = ref<boolean>(false);

hljs.registerLanguage("ini", ini);
hljs.registerLanguage("nginx", nginx);

const pageStore = usePageStore();
const pageSidebar = computed(() => pageStore.sidebar);

const naiveOsTheme = useOsTheme(),
  osTheme = computed(() => (naiveOsTheme.value === "dark" ? darkTheme : null));

onMounted(() => {
  loaded.value = true;
});
</script>

<style scoped>
.load-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

@media screen and (max-width: 700px) {
  .sidebar-container {
    position: absolute;
    z-index: 2;
    height: 100%;
  }
  .content {
    margin-left: 64px;
  }
}
</style>
