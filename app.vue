<template>
  <nuxt-loading-indicator />
  <n-config-provider
    :hljs="hljs"
    :theme="osTheme"
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <client-only>
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
    </client-only>
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <client-only>
            <notification-inject />
          </client-only>
          <n-layout v-show="!loaded" class="loading-layout">
            <n-spin :show="true" class="load-container">
              <template #description>
                <n-text class="loading-text"> 加载中，稍安勿躁...... </n-text>
              </template>
            </n-spin>
          </n-layout>
          <n-layout
            v-show="loaded"
            style="height: 100dvh"
            :native-scrollbar="false"
          >
            <n-layout-header bordered>
              <client-only>
                <site-header />
              </client-only>
            </n-layout-header>
            <n-layout has-sider style="height: calc(100dvh - 61px)">
              <n-el v-if="pageSidebar" class="sidebar-container">
                <client-only>
                  <sidebar />
                </client-only>
              </n-el>
              <n-layout-content
                :native-scrollbar="false"
                :class="{ content: pageSidebar }"
                style="width: 100%"
              >
                <n-el class="body-wrapper">
                  <client-only>
                    <nuxt-page style="min-height: calc(100dvh - 61px)" />
                  </client-only>
                </n-el>
                <n-layout-footer bordered>
                  <site-footer />
                </n-layout-footer>
              </n-layout-content>
            </n-layout>
          </n-layout>
          <client-only>
            <alive-test />
          </client-only>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import "@/assets/css/style.css";

import { dateZhCN, zhCN, darkTheme, useOsTheme } from "naive-ui";

import SiteHeader from "@/components/Header.vue";
import SiteFooter from "@/components/Footer.vue";

import NotificationInject from "~/components/inject/Notification.vue";

import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import ini from "highlight.js/lib/languages/ini";
import yaml from "highlight.js/lib/languages/yaml";

// import { useMainStore } from "@/store/main";
import { usePageStore } from "@/store/page";

// import {
//   GetNotice,
//   type GetNoticeResponse,
// } from "@/api/src/api/site/notice.get";

const runtimeConfig = useRuntimeConfig();

const env = {
  devMode: runtimeConfig.public.devMode,
};

const loaded = ref<boolean>(false);

hljs.registerLanguage("json", json);
hljs.registerLanguage("ini", ini);
hljs.registerLanguage("toml", ini);
hljs.registerLanguage("yaml", yaml);

const pageStore = usePageStore();
const pageSidebar = computed(() => pageStore.sidebar);

// const mainStore = useMainStore();

// 避免水合错误：服务端渲染时使用null，客户端挂载后再检测主题
const osTheme = ref<typeof darkTheme | null>(null);
const isDark = ref(false);

// 在客户端挂载后使用Naive UI的useOsTheme
onMounted(() => {
  // 只在客户端执行主题检测
  const naiveOsTheme = useOsTheme();

  // 立即更新主题状态
  const updateTheme = () => {
    isDark.value = naiveOsTheme.value === "dark";
    osTheme.value = naiveOsTheme.value === "dark" ? darkTheme : null;
  };

  // 初始化主题
  updateTheme();

  // 监听主题变化
  watch(naiveOsTheme, updateTheme);
});

// const api = useApiClient({ auth: false });
//
// async function fetchSiteData() {
//   const notice = await api.execute<GetNoticeResponse>(new GetNotice());
//   if (notice.status === 200) {
//     mainStore.site.broadcast = notice.data.broadcast;
//     mainStore.site.announcement = notice.data.announcement;
//   }
// }

onMounted(async () => {
  // if (import.meta.client) await fetchSiteData();
  loaded.value = true;
});
</script>

<style scoped>
.loading-layout {
  height: 100dvh;
}

/* 使用 CSS 媒体查询检测暗色模式 */
@media (prefers-color-scheme: dark) {
  .loading-layout {
    background-color: #101014;
  }
  .loading-text {
    color: white !important;
  }
}

.load-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.loading-text {
  font-weight: 500;
  font-size: 14px;
  transition: color 0.3s ease;
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
