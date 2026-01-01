<template>
  <page-content title="软件下载">
    <n-space vertical>
      <n-spin :show="loading.software">
        <n-card title="软件">
          <n-space vertical>
            <n-select
              v-model:value="selectedSoftwareId"
              :options="softwareOptions"
              placeholder="请选择要下载的软件"
              @update:value="
                () => {
                  getAssets();
                }
              "
            />
            <n-space>
              <n-tag
                v-for="tag in findSoftwareById(selectedSoftwareId)?.tags"
                :key="tag.content"
                :type="covertTagType(tag.type)"
              >
                {{ tag.content }}
              </n-tag>
            </n-space>
            <MDC
              :value="
                findSoftwareById(selectedSoftwareId)?.description ?? '没有介绍'
              "
            />
            <n-pagination
              v-model:page="softwarePage.current"
              v-model:page-size="softwarePage.size"
              :page-count="softwarePage.count"
              :on-update:page="
                (pageSel) => {
                  softwarePage.current = pageSel;
                  getSoftwareList();
                }
              "
              :on-update:page-size="
                (pageSizeSel) => {
                  softwarePage.size = pageSizeSel;
                  getSoftwareList();
                }
              "
              show-size-picker
              :page-sizes="[15, 25, 50, 100, 250, 500]"
            />
          </n-space>
        </n-card>
      </n-spin>

      <n-spin :show="loading.assets">
        <n-card title="资源">
          <n-space vertical>
            <n-select
              v-model:value="selectedAssetTag"
              :options="assetsOptions"
              placeholder="请选择要下载的资源"
              @update:value="() => buildDownloadOptions()"
            />
            <n-pagination
              v-model:page="assetPage.current"
              v-model:page-size="assetPage.size"
              :page-count="assetPage.count"
              :on-update:page="
                (pageSel) => {
                  assetPage.current = pageSel;
                  getAssets();
                }
              "
              :on-update:page-size="
                (pageSizeSel) => {
                  assetPage.size = pageSizeSel;
                  getAssets();
                }
              "
              show-size-picker
              :page-sizes="[15, 25, 50, 100, 250, 500]"
            />
            <n-space>
              <n-h3>
                {{ findAssetByTag(selectedAssetTag)?.name }}
              </n-h3>
              <n-tag :bordered="false">
                {{ findAssetByTag(selectedAssetTag)?.tag }}
              </n-tag>
            </n-space>
            <MDC
              :value="
                findAssetByTag(selectedAssetTag)?.description ?? '没有介绍'
              "
            />
            <n-divider />
            <n-space>
              <n-select
                v-model:value="selectedDownloadUrl"
                :options="downloadUrlOptions"
                style="width: 200px"
              />
              <n-button
                type="primary"
                @click="
                  navigateTo(selectedDownloadUrl, {
                    external: true,
                    open: {
                      target: '_blank',
                    },
                  })
                "
              >
                下载
              </n-button>
            </n-space>
          </n-space>
        </n-card>
      </n-spin>
    </n-space>
  </page-content>
</template>

<script setup lang="ts">
import type { SelectOption } from "naive-ui";

import {
  GetSoftware,
  type GetSoftwareResponse,
} from "@locyanfrp-dashboard-frontend/api/src/software.get";
import {
  GetAssets,
  type GetAssetsResponse,
} from "@locyanfrp-dashboard-frontend/api/src/software/assets.get";

const client = useApiClient();
const message = useMessage();

const loading = ref<{
  software: boolean;
  assets: boolean;
}>({
  software: true,
  assets: true,
});

const selectedSoftwareId = ref<number | null>(null);
const selectedAssetTag = ref<string | null>(null);
const selectedDownloadUrl = ref<string | null>(null);

interface Software {
  id: number;
  name: string;
  description: string | null;
  tags: { type: string; content: string }[];
}

interface Asset {
  tag: string;
  name: string;
  fileName: string;
  description: string | null;
  downloadUrls: { name: string; url: string }[];
  createdTime: string;
  updatedTime: string;
}

let softwareList: Software[] = [];
const softwareOptions = ref<SelectOption[]>([]);

let softwareAssets: Asset[] = [];
const assetsOptions = ref<SelectOption[]>([]);
const downloadUrlOptions = ref<SelectOption[]>([]);

const softwarePage = ref<{
    current: number;
    size: number;
    count: number;
  }>({
    current: 1,
    size: 15,
    count: 1,
  }),
  assetPage = ref<{
    current: number;
    size: number;
    count: number;
  }>({
    current: 1,
    size: 15,
    count: 1,
  });

async function getSoftwareList() {
  loading.value.software = true;
  const rs = await client.execute<GetSoftwareResponse>(
    new GetSoftware({
      page: softwarePage.value.current,
      size: softwarePage.value.size,
    }),
  );
  if (rs.status === 200) {
    const list: Software[] = [];
    rs.data.list.forEach((item) => {
      list.push(<Software>{
        id: item.id,
        name: item.name,
        description: item.description,
        tags: item.tags.map((tag) => {
          return {
            type: tag.type,
            content: tag.content,
          };
        }),
      });
    });
    softwareList = list;
    await buildSoftwareOptions();
    if (softwareOptions.value.length > 0) {
      selectedSoftwareId.value = softwareOptions.value[0]?.value as
        | number
        | null;
    }
    await getAssets();
  } else {
    message.error(rs.message);
  }
  loading.value.software = false;
}

async function getAssets() {
  loading.value.assets = true;
  const rs = await client.execute<GetAssetsResponse>(
    new GetAssets({
      software_id: selectedSoftwareId.value!,
      page: assetPage.value.current,
      size: assetPage.value.size,
    }),
  );
  if (rs.status === 200) {
    const list: Asset[] = [];
    rs.data.list.forEach((item) => {
      list.push(<Asset>{
        tag: item.tag,
        name: item.name,
        fileName: item.file_name,
        description: item.description,
        downloadUrls: item.download_urls,
        createdTime: item.created_time,
        updatedTime: item.updated_time,
      });
    });
    softwareAssets = list;
    await buildAssetsOptions();
    if (assetsOptions.value.length > 0) {
      selectedAssetTag.value = assetsOptions.value[0]?.value as string | null;
    }
  } else {
    message.error(rs.message);
  }
  loading.value.assets = false;
}

async function buildSoftwareOptions() {
  softwareOptions.value = softwareList.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
}

async function buildAssetsOptions() {
  assetsOptions.value = softwareAssets.map((item) => {
    return {
      label: item.name,
      value: item.tag,
    };
  });
  await buildDownloadOptions();
}

async function buildDownloadOptions() {
  downloadUrlOptions.value =
    findAssetByTag(selectedAssetTag.value)?.downloadUrls.map((url) => ({
      label: url.name,
      value: url.url,
    })) || [];
  if (downloadUrlOptions.value.length > 0) {
    selectedDownloadUrl.value = downloadUrlOptions.value[0]?.value as
      | string
      | null;
  }
}

function findSoftwareById(id: number | null): Software | undefined {
  return softwareList.find((item) => item.id === id);
}

function findAssetByTag(tag: string | null): Asset | undefined {
  return softwareAssets.find((item) => item.tag === tag);
}

function covertTagType(
  type: string,
): "info" | "success" | "warning" | "error" | undefined {
  switch (type) {
    case "INFO":
      return "info";
    case "SUCCESS":
      return "success";
    case "WARNING":
      return "warning";
    case "ERROR":
      return "error";
    default:
      return undefined;
  }
}

onMounted(() => {
  getSoftwareList();
});
</script>
