<template>
  <n-config-provider :hljs="hljs" :theme="osTheme">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <n-notification-provider>
            <n-layout style="height: 100dvh">
              <n-layout-header bordered>
                <site-header />
              </n-layout-header>
              <n-layout has-sider style="height: calc(100dvh - 61px)">
                <n-el class="sidebar-container">
                  <sidebar />
                </n-el>
                <n-layout-content :native-scrollbar="false">
                  <nuxt-page />
                </n-layout-content>
              </n-layout>
              <n-layout-footer bordered>
                <site-footer />
                <n-back-top :right="50" />
              </n-layout-footer>
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

import SiteHeader from "@/components/header.vue";
import SiteFooter from "@/components/footer.vue";

import hljs from "highlight.js/lib/core";
import ini from "highlight.js/lib/languages/ini";
import nginx from "highlight.js/lib/languages/nginx";

useHead({
  htmlAttrs: {
    lang: "zh-CN",
  },
  title: "LoCyanFrp Dashboard",
});

hljs.registerLanguage("ini", ini);
hljs.registerLanguage("nginx", nginx);

const naiveOsTheme = useOsTheme(),
  osTheme = computed(() => (naiveOsTheme.value === "dark" ? darkTheme : null));
</script>
