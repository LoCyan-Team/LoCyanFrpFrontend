<template>
  <nuxt-layout>
    <client-only>
      <nuxt-page style="min-height: calc(100dvh - 61px)" />
    </client-only>
  </nuxt-layout>
</template>

<script setup lang="ts">
// 全局样式导入
import "~/assets/css/style.css";
</script>
