<template>
  <nuxt-route-announcer />
  <nuxt-layout>
    <n-el class="content">
      <nuxt-page />
    </n-el>
  </nuxt-layout>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (title?: string) =>
    `乐青映射 - LoCyanFrp | ${title ?? "未知界面"}`,
});
</script>

<style scoped>
.content {
  min-height: calc(100dvh - 61px);
  display: flex;
  flex-direction: column;
}
</style>
