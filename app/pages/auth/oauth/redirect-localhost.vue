<template>
  <n-el class="auth-box">
    <n-h1>应用授权本地重定向</n-h1>
    <n-spin v-if="!error" />
    <n-h3 v-else>{{ error }}</n-h3>
  </n-el>
</template>

<script setup lang="ts">
import "~/assets/css/auth.css";

definePageMeta({
  needLogin: false,
  sidebar: false,
});

useHead({
  title: "应用授权本地重定向",
});

const route = useRoute();

const error = ref<string | null>(null);

onMounted(() => {
  const urlKeys = {
    port: (route.query.port as string | undefined)
      ? Number(route.query.port)
      : null,
    path: (route.query.path as string | undefined) ?? null,
    ssl: route.query.ssl === "true",
    refreshToken: (route.query.refresh_token as string | undefined) ?? null,
    error: (route.query.error as string | undefined) ?? null,
  };

  if (urlKeys.port === null || urlKeys.path === null)
    error.value = "传入参数有误";
  if (urlKeys.refreshToken === null && urlKeys.error === null)
    error.value = "传入参数有误";

  const finalUrl =
    urlKeys.error !== null
      ? `${urlKeys.ssl ? "https" : "http"}://localhost:${urlKeys.port}${urlKeys.path ?? ""}?error=${urlKeys.error}`
      : `${urlKeys.ssl ? "https" : "http"}://localhost:${urlKeys.port}${urlKeys.path ?? ""}?refresh_token=${urlKeys.refreshToken}`;

  if (!error.value)
    navigateTo(finalUrl, {
      external: true,
    });
});
</script>
