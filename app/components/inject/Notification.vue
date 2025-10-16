<template>
  <slot />
</template>

<script>
import { defineComponent } from "vue";
import { useNotification } from "naive-ui";

export default defineComponent({
  setup() {
    window.$notification = useNotification();
  },
});
</script>
