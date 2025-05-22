<template>
  <n-el class="flex-center outbox">
    <n-h1>购买成功</n-h1>
    <n-h3 style="margin-top: 0">请回到原页面进行下一步认证</n-h3>
  </n-el>
</template>

<script setup lang="ts">
definePageMeta({
  title: "身份认证回调界面",
  needLogin: false,
  sidebar: false,
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
