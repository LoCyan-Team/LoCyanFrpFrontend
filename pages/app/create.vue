<template>
  <page-content title="创建应用">
    <n-space vertical>
      <n-alert type="info" title="开发指南">
        如您需要调用 API，请参阅
        <n-a target="_blank" href="https://docs.locyanfrp.cn/api/">
          API 文档
        </n-a>
        。
      </n-alert>
      <n-card title="创建应用">
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
          <n-button
            :loading="loading.submit"
            :disabled="loading.submit"
            type="success"
            @click="handleCreate"
          >
            提交
          </n-button>
        </n-form>
      </n-card>
    </n-space>
  </page-content>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";

import { Client as ApiClient } from "@/api/src/client";
import { PutApp, type PutAppResponse } from "@/api/src/api/app.put";

const mainStore = useMainStore();
const client = new ApiClient(mainStore.token!);
client.init();

definePageMeta({
  title: "创建应用",
});

const message = useMessage();
const dialog = useDialog();

const loading = ref<{
  submit: boolean;
}>({
  submit: false,
});

const form = ref<{
  name: string | null;
  description: string | null;
  redirectUrl: string | null;
}>({
  name: null,
  description: null,
  redirectUrl: null,
});

async function handleCreate() {
  loading.value.submit = true
  const rs = await client.execute<PutAppResponse>(
    new PutApp({
      user_id: mainStore.userId!,
      name: form.value.name!,
      description: form.value.description ?? undefined,
      redirectUrl: form.value.redirectUrl,
    }),
  );
  if (rs.status === 200) {
    dialog.success({
      title: "创建成功",
      content: "创建应用成功。",
    });
  } else message.error(rs.message);
  loading.value.submit = false
}
</script>
