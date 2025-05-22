<template>
  <n-el class="flex-center outbox">
    <n-spin>
      <template #description> 正在登录，请不要关闭此页面 </template>
    </n-spin>
  </n-el>
</template>

<script setup lang="ts">
definePageMeta({
  title: "QQ 登录回调界面",
  needLogin: false,
  sidebar: false,
});

onMounted(async () => {
  // TODO: 提交登录
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
