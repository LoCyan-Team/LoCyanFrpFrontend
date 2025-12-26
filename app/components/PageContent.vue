<template>
  <n-el class="outbox">
    <n-el :ref="page" class="container">
      <n-h1 v-if="props.title" prefix="bar">
        <slot name="icon" />
        <n-text type="primary">
          {{ props.title }}
        </n-text>
      </n-h1>
      <slot />
      <n-back-top :listen-to="page" :right="100" />
    </n-el>
  </n-el>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title?: string;
}>();

const page = ref(undefined);
</script>

<style scoped>
.container {
  padding: 1rem;
}
</style>
