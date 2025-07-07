<template>
  <nuxt-loading-indicator />
  <n-config-provider :theme="osTheme" :locale="zhCN" :date-locale="dateZhCN">
    <n-notification-provider>
      <n-layout style="height: 100dvh" :native-scrollbar="false">
        <n-layout-header bordered>
          <site-header />
        </n-layout-header>
        <n-layout-content>
          <n-el v-if="error.statusCode === 404">
            <n-el class="flex-center outbox">
              <n-empty description="这里什么也找不到啊 QwQ" />
              <n-button
                style="margin-top: 10px"
                @click="() => clearError({ redirect: '/' })"
              >
                带我去首页
              </n-button>
            </n-el>
          </n-el>
          <n-el v-else>
            <n-el class="flex-center outbox">
              <n-h1>{{ error!.statusCode }} :&lpar;</n-h1>
              <n-h3 style="margin-top: 0">在渲染时发生了未知的错误。</n-h3>
              <n-p>{{ error!.message }}</n-p>
              <n-space>
                <n-button
                  style="margin-top: 10px"
                  type="primary"
                  @click="() => reloadNuxtApp()"
                >
                  重新载入
                </n-button>
                <n-button
                  style="margin-top: 10px"
                  @click="() => clearError({ redirect: '/' })"
                >
                  带我去首页
                </n-button>
              </n-space>
            </n-el>
          </n-el>
        </n-layout-content>
        <n-layout-footer bordered>
          <site-footer />
        </n-layout-footer>
      </n-layout>
    </n-notification-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import "@/assets/css/style.css";

import type { NuxtError } from "#app";

import SiteHeader from "@/components/Header.vue";
import SiteFooter from "@/components/Footer.vue";

import { dateZhCN, zhCN, useOsTheme, darkTheme } from "naive-ui";

defineProps({
  // eslint-disable-next-line vue/require-default-prop
  error: Object as () => NuxtError,
});

const ldb = useLoadingIndicator();

ldb.finish();

const osTheme = ref<typeof darkTheme | null>(null);

onMounted(() => {
  if (import.meta.client) {
    const naiveOsTheme = useOsTheme();
    osTheme.value = naiveOsTheme.value === "dark" ? darkTheme : null;
  }
});
</script>

<style scoped>
.outbox {
  margin-inline: 1rem;
  min-height: calc(100dvh - 61px);
}

.flex-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
