<template>
  <nuxt-route-announcer />
  <nuxt-layout>
    <client-only>
      <nuxt-page style="min-height: calc(100dvh - 61px)" />
      <template>
        <n-skeleton text :repeat="2" />
        <n-skeleton text style="width: 60%" />
      </template>
    </client-only>
  </nuxt-layout>
</template>

<script setup lang="ts"></script>
