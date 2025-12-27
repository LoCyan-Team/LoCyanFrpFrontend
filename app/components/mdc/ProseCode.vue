<script setup lang="ts">
defineProps<{
  code: string;
  language: string;
  filename?: string;
  highlights?: number[]; // reserved
  meta?: string;
  class?: string;
}>();
</script>

<template>
  <n-el class="prose-code-wrapper">
    <n-el v-if="filename" class="code-filename">
      <n-text depth="3">
        {{ filename }}
      </n-text>
    </n-el>

    <n-scrollbar x-scrollable>
      <n-code
        :code="code"
        :language="language || 'text'"
        :show-line-numbers="true"
      />
    </n-scrollbar>
  </n-el>
</template>

<style scoped>
.prose-code-wrapper {
  /* 确保与 markdown 文本有足够的间距 */
  margin: 1.5rem 0;
}

.code-filename {
  background-color: var(--n-color-base);
  padding: 0.5rem 1rem 0.25rem 1rem;
  font-size: 0.9em;
  border-radius: 6px 6px 0 0; /* 顶部圆角，底部不圆角 */
  border: 1px solid var(--n-border-color); /* 添加边框 */
  border-bottom: none;
}
</style>
