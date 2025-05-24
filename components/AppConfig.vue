<template>
  <n-card title="应用信息">
    <n-form :model="form">
      <n-form-item label="应用名" path="name">
        <n-input v-model:value="form.name" placeholder="请输入应用名" />
      </n-form-item>
      <n-form-item label="应用介绍" path="description">
        <n-input
          v-model:value="form.description"
          placeholder="请输入应用介绍"
        />
      </n-form-item>
      <n-form-item label="重定向 URL" path="redirectUrl">
        <n-input
          v-model:value="form.redirectUrl"
          placeholder="请输入授权重定向 URL"
        />
      </n-form-item>
      <n-button type="success" @click="handleSubmit"> 提交 </n-button>
    </n-form>
  </n-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  default?: {
    name: string;
    description: string | null;
    redirectUrl: string;
  };
}>();

const form = ref<{
  name: string | null;
  description: string | null;
  redirectUrl: string | null;
}>({
  name: props.default?.name ?? null,
  description: props.default?.description ?? null,
  redirectUrl: props.default?.redirectUrl ?? null,
});

const emit = defineEmits<{
  (
    e: "submit",
    app: {
      name: string;
      description: string | null;
      redirectUrl: string;
    },
  ): void;
}>();

function handleSubmit() {
  emit("submit", {
    name: form.value.name!,
    description: form.value.description,
    redirectUrl: form.value.redirectUrl!,
  });
}
</script>
