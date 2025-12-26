<template>
  <n-config-provider
    :hljs="hljs"
    :theme="osTheme"
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <nuxt-loading-indicator />
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
          <n-el :class="{ 'content-invisible': !loaded }">
            <n-layout style="height: 100dvh" :native-scrollbar="false">
              <n-layout-header bordered>
                <site-header />
              </n-layout-header>
              <n-layout has-sider style="height: calc(100dvh - 61px)">
                <n-el v-if="pageSidebar" class="sidebar-container">
                  <site-sidebar />
                </n-el>
                <n-layout-content
                  :native-scrollbar="false"
                  :class="{ content: pageSidebar }"
                  style="width: 100%"
                >
                  <n-el class="body-wrapper">
                    <slot />
                  </n-el>
                  <site-floating-document-button />
                  <n-layout-footer bordered>
                    <site-footer />
                  </n-layout-footer>
                </n-layout-content>
              </n-layout>
            </n-layout>
          </n-el>
          <client-only>
            <alive-test />
          </client-only>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import "~/assets/css/style.css";

import { dateZhCN, zhCN, darkTheme, useOsTheme } from "naive-ui";

import NotificationInject from "~/components/inject/Notification.vue";

import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import ini from "highlight.js/lib/languages/ini";
import yaml from "highlight.js/lib/languages/yaml";

import { usePageStore } from "~/store/page";

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

const osTheme = ref<typeof darkTheme | null>(null);
const isDark = ref(false);

onMounted(() => {
  const naiveOsTheme = useOsTheme();

  const updateTheme = () => {
    isDark.value = naiveOsTheme.value === "dark";
    osTheme.value = naiveOsTheme.value === "dark" ? darkTheme : null;
  };

  updateTheme();
  watch(naiveOsTheme, updateTheme);
  nextTick(() => (loaded.value = true));
});
</script>

<style scoped>
.loading-layout {
  height: 100dvh;
}

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

<style>
.content-invisible {
  display: none;
}
</style>
