<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  href?: string;
  [key: string]: any;
}>();

const isExternalLink = computed(() => {
  if (!props.href) return false;
  return props.href.startsWith('http') || props.href.startsWith('//');
});

const computedTarget = computed(() => {
  if (isExternalLink.value) {
    return '_blank';
  }
  return props.target;
});

const computedRel = computed(() => {
  let rel = props.rel ? props.rel.split(' ') : [];

  if (computedTarget.value === '_blank' && !rel.includes('noopener')) {
    rel.push('noopener', 'noreferrer');
  }

  return [...new Set(rel)].filter(Boolean).join(' ') || undefined;
});

</script>

<template>
  <n-a
    v-bind="$attrs"
    :href="props.href"
    :target="computedTarget"
    :rel="computedRel"
    :type="isExternalLink ? 'primary' : undefined"
  >
    <slot />
  </n-a>
</template>
