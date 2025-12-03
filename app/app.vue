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
</style>
