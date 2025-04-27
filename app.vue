<template>
  <n-config-provider :hljs="hljs" :theme="osTheme">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <n-notification-provider>
            <n-layout style="height: 100dvh" :native-scrollbar="false">
              <n-layout-header bordered>
                <site-header />
              </n-layout-header>
              <n-layout has-sider style="height: calc(100dvh - 61px)">
                <n-el class="sidebar-container" v-if="pageSidebar">
                  <sidebar />
                </n-el>
                <n-layout-content
                  :native-scrollbar="false"
                  :ref="pageLayout"
                  class="content"
                  style="width: 100%"
                >
                  <nuxt-page style="min-height: calc(100dvh - 61px)" />
                  <n-layout-footer bordered>
                    <site-footer />
                  </n-layout-footer>
                  <n-back-top :right="50" />
                </n-layout-content>
              </n-layout>
            </n-layout>
          </n-notification-provider>
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import "@/assets/css/style.css";

import { useOsTheme, darkTheme } from "naive-ui";

import SiteHeader from "@/components/Header.vue";
import SiteFooter from "@/components/Footer.vue";

import hljs from "highlight.js/lib/core";
import ini from "highlight.js/lib/languages/ini";
import nginx from "highlight.js/lib/languages/nginx";

import { usePageStore } from "@/store/page";

useHead({
  htmlAttrs: {
    lang: "zh-CN",
  },
  title: "LoCyanFrp Dashboard",
});

hljs.registerLanguage("ini", ini);
hljs.registerLanguage("nginx", nginx);

const pageStore = usePageStore();
const pageSidebar = computed(() => pageStore.sidebar);

const naiveOsTheme = useOsTheme(),
  osTheme = computed(() => (naiveOsTheme.value === "dark" ? darkTheme : null));

const pageLayout = ref();
</script>

<style scoped>
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
