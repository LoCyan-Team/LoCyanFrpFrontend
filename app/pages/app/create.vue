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
      <n-spin :show="loading">
        <app-config @submit="handleCreate" />
      </n-spin>
    </n-space>
  </page-content>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";

import { PutApp, type PutAppResponse } from "api/src/api/app.put";

const mainStore = useMainStore();
const client = useApiClient();

useHead({
  title: "创建应用",
});

const message = useMessage();
const dialog = useDialog();

const loading = ref<boolean>(false);

async function handleCreate(app: {
  name: string;
  description: string | null;
  redirectUrl: string;
}) {
  umTrackEvent("click-app-create-create");
  loading.value = true;
  const rs = await client.execute<PutAppResponse>(
    new PutApp({
      user_id: mainStore.userId!,
      name: app.name,
      description: app.description ?? undefined,
      redirect_url: app.redirectUrl,
    }),
  );
  if (rs.status === 200) {
    dialog.success({
      title: "创建成功",
      content: "创建应用成功。",
    });
  } else message.error(rs.message);
  loading.value = false;
}
</script>
