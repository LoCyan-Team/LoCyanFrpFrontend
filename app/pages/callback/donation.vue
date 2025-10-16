<template>
  <n-el class="flex-center outbox">
    <n-h1>捐赠成功</n-h1>
    <n-h3 style="margin-top: 0">感谢您的捐赠，让乐青映射变得更好！</n-h3>
  </n-el>
</template>

<script setup lang="ts">
definePageMeta({
  needLogin: false,
  sidebar: false,
});

useHead({
  title: "捐赠回调界面",
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
