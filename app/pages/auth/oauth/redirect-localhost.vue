<template>
  <n-el class="auth-box">
    <n-h1>应用授权本地重定向</n-h1>
    <client-only style="width: 100%">
      <n-spin :show="!error">
        <n-card v-if="error" title="发生错误">
          <n-text>{{ error }}</n-text>
        </n-card>
      </n-spin>
    </client-only>
  </n-el>
</template>

<script setup lang="ts">
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

<style scoped>
.auth-box {
  flex: 1;
  width: 100%;
  margin-inline: auto;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-block: 0.5rem;
}

@media screen and (max-width: 500px) {
  .auth-box {
    margin-inline: 0.5rem;
  }
}
</style>
