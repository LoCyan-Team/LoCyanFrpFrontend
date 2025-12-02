<template>
  <page-content title="配置文件">
    <n-space vertical>
      <n-alert type="info" title="使用须知">
        配置文件启动适用于纯净版客户端的手动配置。如您对此并不了解，我们更推荐您使用启动器或一键启动命令启动。
      </n-alert>
      <n-spin :show="loading">
        <n-card title="请选择">
          <n-form>
            <n-form-item label="选择格式" path="format">
              <n-select
                v-model:value="formatSelected"
                :options="formatOptions"
                @update:value="
                  () => {
                    switch (selectedMode) {
                      case 'tunnel':
                        getTunnelConfig(Mode.TUNNEL);
                        break;
                      case 'node':
                        getTunnelConfig(Mode.NODE);
                        break;
                    }
                  }
                "
              />
            </n-form-item>
            <n-tabs
              v-model:value="selectedMode"
              type="line"
              animated
              :on-update:value="
                (value) => {
                  selectedMode = value;
                  switch (value) {
                    case 'tunnel':
                      tunnelPage.current = 1;
                      getTunnelConfig(Mode.TUNNEL);
                      break;
                    case 'node':
                      nodePage.current = 1;
                      getTunnelConfig(Mode.NODE);
                      break;
                  }
                }
              "
            >
              <n-tab-pane name="tunnel" tab="按隧道">
                <n-empty v-if="tunnelOptions.length === 0" />
                <n-form-item v-else label="选择隧道" path="tunnelConfig">
                  <n-space vertical style="width: 100%">
                    <n-select
                      v-model:value="tunnelSelected"
                      :options="tunnelOptions"
                      @update:value="() => getTunnelConfig(Mode.TUNNEL)"
                    />
                    <n-space
                      v-if="tunnelOptions.length !== 0"
                      justify="center"
                      style="width: 100%"
                    >
                      <n-pagination
                        v-model:page="tunnelPage.current"
                        v-model:page-size="tunnelPage.size"
                        :page-count="tunnelPage.count"
                        :on-update:page="
                          (pageSel) => {
                            tunnelPage.current = pageSel;
                            getTunnelConfig(Mode.TUNNEL);

                            getTunnelConfig(Mode.NODE);
                          }
                        "
                        :on-update:page-size="
                          (pageSizeSel) => {
                            tunnelPage.size = pageSizeSel;
                            getTunnelConfig(Mode.TUNNEL);
                          }
                        "
                        show-size-picker
                        :page-sizes="[10, 25, 50, 100]"
                      />
                    </n-space>
                  </n-space>
                </n-form-item>
              </n-tab-pane>
              <n-tab-pane name="node" tab="按节点">
                <n-empty v-if="nodeOptions.length === 0" />
                <n-form-item v-else label="选择节点" path="nodeConfig">
                  <n-space vertical style="width: 100%">
                    <n-select
                      v-model:value="nodeSelected"
                      :options="nodeOptions"
                      @update:value="() => getTunnelConfig(Mode.NODE)"
                    />
                    <n-space
                      v-if="nodeOptions.length !== 0"
                      justify="center"
                      style="width: 100%"
                    >
                      <n-pagination
                        v-model:page="nodePage.current"
                        v-model:page-size="nodePage.size"
                        :page-count="nodePage.count"
                        :on-update:page="
                          (pageSel) => {
                            nodePage.current = pageSel;
                            getTunnelConfig(Mode.TUNNEL);

                            getTunnelConfig(Mode.NODE);
                          }
                        "
                        :on-update:page-size="
                          (pageSizeSel) => {
                            nodePage.size = pageSizeSel;
                            getTunnelConfig(Mode.TUNNEL);
                          }
                        "
                        show-size-picker
                        :page-sizes="[10, 25, 50, 100]"
                      />
                    </n-space>
                  </n-space>
                </n-form-item>
              </n-tab-pane>
            </n-tabs>
          </n-form>
        </n-card>
      </n-spin>

      <n-spin :show="loading">
        <n-card title="配置文件">
          <template #header-extra>
            <n-button
              type="success"
              secondary
              @click="$copyToClipboard(content)"
            >
              复制全部内容
            </n-button>
          </template>
          <n-scrollbar x-scrollable>
            <n-code
              :code="content"
              :language="formatSelected.toLowerCase()"
              show-line-numbers
            />
          </n-scrollbar>
        </n-card>
      </n-spin>
    </n-space>
  </page-content>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";

import type { SelectOption } from "naive-ui";

import type { Response } from "api/src/type/response";

import { GetTunnels, type GetTunnelsResponse } from "api/src/api/tunnels.get";
import { GetNodes, type GetNodesResponse } from "api/src/api/nodes.get";
import {
  GetConfig,
  type GetConfigResponse,
} from "api/src/api/tunnel/config.get";

useHead({
  title: "配置文件",
});

const mainStore = useMainStore();
const client = useApiClient();

const message = useMessage();

const loading = ref(true);

const content = ref("什么也没有呀~");

const tunnelOptions = ref<SelectOption[]>([]),
  nodeOptions = ref<SelectOption[]>([]);
const formatOptions = ref<SelectOption[]>([
  {
    label: "JSON",
    value: "JSON",
  },
  {
    label: "TOML",
    value: "TOML",
  },
  {
    label: "YAML",
    value: "YAML",
  },
]);
const selectedMode = ref<string>("tunnel");
const tunnelSelected = ref<number>(0),
  nodeSelected = ref<number>(0);
const formatSelected = ref<string>("JSON");

const tunnelPage = ref<{
    current: number;
    size: number;
    count: number;
  }>({
    current: 1,
    size: 10,
    count: 1,
  }),
  nodePage = ref<{
    current: number;
    size: number;
    count: number;
  }>({
    current: 1,
    size: 10,
    count: 1,
  });

enum Mode {
  TUNNEL,
  NODE,
}

async function getTunnelConfig(mode: Mode) {
  loading.value = true;
  let rs: Response<GetConfigResponse>;
  switch (mode) {
    case Mode.TUNNEL:
      {
        if (tunnelSelected.value === 0) {
          loading.value = false;
          return;
        }
        rs = await client.execute<GetConfigResponse>(
          new GetConfig({
            user_id: mainStore.userId!,
            tunnel_id: tunnelSelected.value,
            format: formatSelected.value,
          }),
        );
      }
      break;
    case Mode.NODE:
      {
        if (nodeSelected.value === 0) {
          loading.value = false;
          return;
        }
        rs = await client.execute<GetConfigResponse>(
          new GetConfig({
            user_id: mainStore.userId!,
            node_id: nodeSelected.value,
            format: formatSelected.value,
          }),
        );
      }
      break;
  }
  if (rs.status === 200) {
    if (formatSelected.value === "JSON")
      content.value = JSON.stringify(JSON.parse(rs.data.config), null, 2);
    else content.value = rs.data.config;
  } else message.error(rs.message);
  loading.value = false;
}

async function getTunnels() {
  const rs = await client.execute<GetTunnelsResponse>(
    new GetTunnels({
      user_id: mainStore.userId!,
      page: tunnelPage.value.current,
      size: tunnelPage.value.size,
    }),
  );
  if (rs.status === 200) {
    tunnelPage.value.count = rs.data.pagination.count;
    tunnelOptions.value.length = 0;
    rs.data.list.forEach((it) => {
      tunnelOptions.value.push({
        label: it.name,
        value: it.id,
      });
    });
    if (rs.data.list.length !== 0) {
      tunnelOptions.value.sort((a, b) => {
        return (a.value as number) - (b.value as number);
      });
      tunnelSelected.value = tunnelOptions.value[0]?.value as number;
    }
  } else message.error(rs.message);
}

async function getNodes() {
  const rs = await client.execute<GetNodesResponse>(
    new GetNodes({
      user_id: mainStore.userId!,
      page: nodePage.value.current,
      size: nodePage.value.size,
    }),
  );
  if (rs.status === 200) {
    nodePage.value.count = rs.data.pagination.count;
    nodeOptions.value.length = 0;
    rs.data.list.forEach((it) => {
      nodeOptions.value.push({
        label: it.name,
        value: it.id,
      });
    });
    nodeOptions.value.sort((a, b) => {
      return (a.label as string).localeCompare(b.label as string);
    });
    nodeSelected.value = nodeOptions.value[0]?.value as number;
  } else message.error(rs.message);
}

onMounted(async () => {
  await getTunnels();
  if (tunnelOptions.value.length !== 0) {
    await getNodes();
    await getTunnelConfig(Mode.TUNNEL);
  } else {
    loading.value = false;
  }
});
</script>
