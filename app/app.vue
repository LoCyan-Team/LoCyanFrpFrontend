<template>
  <nuxt-route-announcer />
  <nuxt-layout>
    <n-el class="content">
      <nuxt-page />
    </n-el>
  </nuxt-layout>
</template>

<script setup lang="ts"></script>

<style scoped>
.content {
  min-height: calc(100dvh - 61px);
  display: flex;
  flex-direction: column;
}
</style>
