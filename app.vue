<template>
  <nuxt-loading-indicator />
  <n-config-provider
    :hljs="hljs"
    :theme="osTheme"
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <n-watermark
      v-if="env.devMode"
      content="开发版本，不代表最终品质"
      cross
      fullscreen
      :font-size="16"
      :line-height="48"
      :width="512"
      :height="512"
      :x-offset="128"
      :y-offset="128"
      :rotate="-15"
    />
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <notification-inject />
          <n-layout v-show="!loaded" style="height: 100dvh">
            <n-spin :show="true" class="load-container">
              <template #description>
                <n-text>加载中，稍安勿躁......</n-text>
              </template>
            </n-spin>
          </n-layout>
          <n-layout
            v-show="loaded"
            style="height: 100dvh"
            :native-scrollbar="false"
          >
            <n-layout-header bordered>
              <site-header />
            </n-layout-header>
            <n-layout has-sider style="height: calc(100dvh - 61px)">
              <n-el v-if="pageSidebar" class="sidebar-container">
                <sidebar />
              </n-el>
              <n-layout-content
                :native-scrollbar="false"
                :class="{ content: pageSidebar }"
                style="width: 100%"
              >
                <nuxt-page style="min-height: calc(100dvh - 61px)" />
                <n-layout-footer bordered>
                  <site-footer />
                </n-layout-footer>
              </n-layout-content>
            </n-layout>
          </n-layout>
          <alive-test />
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import "@/assets/css/style.css";

import { dateZhCN, zhCN, useOsTheme, darkTheme } from "naive-ui";

import SiteHeader from "@/components/Header.vue";
import SiteFooter from "@/components/Footer.vue";

import NotificationInject from "~/components/inject/Notification.vue";

import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import ini from "highlight.js/lib/languages/ini";
import yaml from "highlight.js/lib/languages/yaml";

import { useMainStore } from "@/store/main";
import { usePageStore } from "@/store/page";

import { Client as ApiClient } from "@/api/src/client";
import {
  GetNotice,
  type GetNoticeResponse,
} from "@/api/src/api/site/notice.get";

const runtimeConfig = useRuntimeConfig();

const env = {
  devMode: runtimeConfig.public.devMode,
};

const api = new ApiClient();
api.init();

const loaded = ref<boolean>(false);

hljs.registerLanguage("json", json);
hljs.registerLanguage("ini", ini);
hljs.registerLanguage("toml", ini);
hljs.registerLanguage("yaml", yaml);

const pageStore = usePageStore();
const pageSidebar = computed(() => pageStore.sidebar);

const naiveOsTheme = useOsTheme(),
  osTheme = computed(() => (naiveOsTheme.value === "dark" ? darkTheme : null));

const mainStore = useMainStore();

async function fetchSiteData() {
  const notice = await api.execute<GetNoticeResponse>(new GetNotice());
  if (notice.status === 200) {
    mainStore.site.broadcast = notice.data.broadcast;
    mainStore.site.announcement = notice.data.announcement;
  }
}

onMounted(async () => {
  await fetchSiteData();
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
