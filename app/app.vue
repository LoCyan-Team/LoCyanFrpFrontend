<template>
  <nuxt-route-announcer />
  <nuxt-layout>
    <client-only class="content">
      <nuxt-page />
    </client-only>
  </nuxt-layout>
</template>

<script setup lang="ts"></script>

<style scoped>
.content {
  min-height: calc(100dvh - 61px);
}

.loading-container {
  padding: 40px 24px;
  margin: 0 auto;
  box-sizing: border-box;
}
</style>
