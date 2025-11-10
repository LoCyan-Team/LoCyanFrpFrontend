<template>
  <n-el class="auth-box">
    <n-h1>应用授权本地重定向</n-h1>
    <n-spin :show="!error">
      <n-card v-if="error" title="发生错误">
        <n-text>{{ error }}</n-text>
      </n-card>
    </n-spin>
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

const urlKeys = {
  port: route.query.port ? Number(route.query.port as string) : null,
  path: route.query.path as string | null,
  ssl: route.query.ssl === "true",
  refreshToken: route.query.refresh_token as string | null,
  error: route.query.error as string | null,
};

if (urlKeys.port === null || urlKeys.path === null) {
  if (urlKeys.refreshToken === null && urlKeys.error === null)
    error.value = "传入参数有误";
}

const finalUrl =
  urlKeys.error != null
    ? `${urlKeys.ssl ? "https" : "http"}://localhost:${urlKeys.port}${urlKeys.path ?? ""}?error=${urlKeys.error}`
    : `${urlKeys.ssl ? "https" : "http"}://localhost:${urlKeys.port}${urlKeys.path ?? ""}?refresh_token=${urlKeys.refreshToken}`;

navigateTo(finalUrl, {
  external: true,
});
</script>

<style scoped>
.auth-box {
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
