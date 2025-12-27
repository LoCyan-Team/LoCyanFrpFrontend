<template>
  <n-el class="outbox">
    <n-el :ref="page" class="container">
      <n-h1 v-if="props.title" prefix="bar">
        <slot name="icon" />
        <n-text type="success">
          {{ props.title }}
        </n-text>
      </n-h1>
      <slot />
      <n-back-top :listen-to="page" :right="backTopRight" :bottom="40" />
    </n-el>
  </n-el>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title?: string;
}>();

const page = ref(undefined);
const route = useRoute();

const backTopRight = computed(() => {
  const documentMeta = route.meta.document as { enable?: boolean } | undefined;

  return documentMeta?.enable ? 100 : 40;
});
</script>

<style scoped>
.container {
  padding: 1rem;
}
</style>
