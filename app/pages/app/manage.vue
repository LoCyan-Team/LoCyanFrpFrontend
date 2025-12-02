<template>
  <page-content title="应用管理">
    <n-spin :show="loading.page">
      <n-space vertical>
        <n-empty v-if="apps.length === 0" />
        <n-grid v-else :y-gap="8" :x-gap="12" :cols="4" item-responsive>
          <n-grid-item v-for="app in apps" :key="app.id" span="0:4 1000:1">
            <n-card :title="app.name">
              <template #header-extra>
                <n-tag type="info"> ID: {{ app.id }} </n-tag>
              </template>
              <n-text>介绍: {{ app.description ?? "无" }}</n-text>
              <br />
              <n-text>重定向 URL:</n-text>
              <n-scrollbar x-scrollbar>
                <n-code :code="app.redirectUrl" />
              </n-scrollbar>
              <template #action>
                <n-space>
                  <n-button type="info" secondary @click="handleEditModal(app)">
                    修改
                  </n-button>
                  <n-popconfirm @positive-click="handleDelete(app.id)">
                    <template #trigger>
                      <n-button type="error" secondary>删除</n-button>
                    </template>
                    确定要删除此应用吗？此操作不可撤销。
                  </n-popconfirm>
                </n-space>
              </template>
            </n-card>
          </n-grid-item>
        </n-grid>
        <n-space v-if="apps.length !== 0" justify="center" style="width: 100%">
          <n-pagination
            v-model:page="page.current"
            v-model:page-size="page.size"
            :page-count="page.count"
            :on-update:page="
              (pageSel) => {
                page.current = pageSel;
                getApps();
              }
            "
            :on-update:page-size="
              (pageSizeSel) => {
                page.size = pageSizeSel;
                getApps();
              }
            "
            show-size-picker
            :page-sizes="[10, 25, 50, 100]"
          />
        </n-space>
      </n-space>
    </n-spin>
    <n-modal
      v-model:show="editModal.show"
      preset="card"
      title="编辑应用"
      size="huge"
      :bordered="false"
      style="max-width: 600px"
    >
      <n-spin :show="loading.edit">
        <app-config
          :default="editModal.app"
          @submit="(app) => handleEdit(editModal.app.id, app)"
        />
      </n-spin>
    </n-modal>
  </page-content>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";

import { GetApps, type GetAppsResponse } from "api/src/api/apps.get";
import { DeleteApp } from "api/src/api/app.delete";
import { PatchApp } from "api/src/api/app.patch";

const mainStore = useMainStore();
const client = useApiClient();

useHead({
  title: "应用管理",
});

const message = useMessage();
const dialog = useDialog();

interface App {
  id: number;
  name: string;
  description: string | null;
  redirectUrl: string;
}

const loading = ref<{
  page: boolean;
  edit: boolean;
}>({
  page: true,
  edit: false,
});

const apps = ref<App[]>([]);

const editModal = ref<{
  show: boolean;
  app: App;
}>({
  show: false,
  app: {
    id: 0,
    name: "",
    description: null,
    redirectUrl: "",
  },
});

const page = ref<{
  current: number;
  size: number;
  count: number;
}>({
  current: 1,
  size: 10,
  count: 1,
});

async function handleEditModal(app: App) {
  editModal.value.app = app;
  editModal.value.show = true;
}

async function handleEdit(
  appId: number,
  app: {
    name: string;
    description: string | null;
    redirectUrl: string;
  },
) {
  loading.value.edit = true;
  const rs = await client.execute(
    new PatchApp({
      user_id: mainStore.userId!,
      app_id: appId,
      name: app.name,
      description: app.description ?? undefined,
      redirect_url: app.redirectUrl,
    }),
  );
  if (rs.status === 200) {
    const index = apps.value.findIndex((item) => item.id === appId);
    if (index !== -1) {
      apps.value[index] = {
        id: apps.value[index].id,
        name: app.name,
        description: app.description,
        redirectUrl: app.redirectUrl,
      };
    }
    apps.value.sort((a, b) => a.id - b.id);
    dialog.success({
      title: "更新成功",
      content: "更新应用信息成功。",
    });
  } else message.error(rs.message);
  loading.value.edit = false;
}

async function handleDelete(id: number) {
  const rs = await client.execute(
    new DeleteApp({
      user_id: mainStore.userId!,
      app_id: id,
    }),
  );
  if (rs.status === 200) {
    apps.value = apps.value.filter((app) => app.id !== appId);
  } else message.error(rs.message);
}

async function getApps() {
  loading.value.page = true;
  const rs = await client.execute<GetAppsResponse>(
    new GetApps({
      user_id: mainStore.userId!,
      page: page.value.current,
      size: page.value.size,
    }),
  );
  if (rs.status === 200) {
    page.value.count = rs.data.pagination.count;
    rs.data.list.forEach((it) => {
      apps.value.push({
        id: it.id,
        name: it.name,
        description: it.description ?? null,
        redirectUrl: it.redirect_url,
      });
    });
    apps.value.sort((a, b) => a.id - b.id);
  } else message.error(rs.message);
  loading.value.page = false;
}

onMounted(async () => {
  await getApps();
});
</script>
