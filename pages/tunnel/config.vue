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
                  page.current = 1;
                  switch (value) {
                    case 'tunnel':
                      getTunnelConfig(Mode.TUNNEL);
                      break;
                    case 'node':
                      getTunnelConfig(Mode.NODE);
                      break;
                  }
                }
              "
            >
              <n-tab-pane name="tunnel" tab="按隧道">
                <n-empty v-if="tunnelOptions.length === 0" />
                <n-form-item v-else label="选择隧道" path="tunnelConfig">
                  <n-select
                    v-model:value="tunnelSelected"
                    :options="tunnelOptions"
                    @update:value="() => getTunnelConfig(Mode.TUNNEL)"
                  />
                </n-form-item>
              </n-tab-pane>
              <n-tab-pane name="node" tab="按节点">
                <n-empty v-if="nodeOptions.length === 0" />
                <n-form-item v-else label="选择节点" path="nodeConfig">
                  <n-select
                    v-model:value="nodeSelected"
                    :options="nodeOptions"
                    @update:value="() => getTunnelConfig(Mode.NODE)"
                  />
                </n-form-item>
              </n-tab-pane>
            </n-tabs>
          </n-form>
          <n-space
            v-if="tunnelOptions.length !== 0 || nodeOptions.length !== 0"
            justify="center"
            style="width: 100%"
          >
            <n-pagination
              v-model:page="page.current"
              v-model:page-size="page.size"
              :page-count="page.count"
              :on-update:page="
                (pageSel) => {
                  page.current = pageSel;
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
              :on-update:page-size="
                (pageSizeSel) => {
                  page.size = pageSizeSel;
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
              show-size-picker
              :page-sizes="[10, 25, 50, 100]"
            />
          </n-space>
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

import { Client as ApiClient } from "@/api/src/client";
import { GetTunnels } from "@/api/src/api/tunnels.get";
import { GetNodes } from "@/api/src/api/nodes.get";
import { GetConfig } from "@/api/src/api/tunnel/config.get";

definePageMeta({
  title: "配置文件",
});

const mainStore = useMainStore();
const client = new ApiClient(mainStore.token!);
client.initClient();

const message = useMessage();

const loading = ref(true);

const content = ref("什么也没有呀~");

const tunnelOptions = ref<Array<SelectOption>>([]),
  nodeOptions = ref<Array<SelectOption>>([]);
const formatOptions = ref<Array<SelectOption>>([
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

const page = ref<{
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
  let rs;
  switch (mode) {
    case Mode.TUNNEL:
      {
        rs = await client.execute(
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
        rs = await client.execute(
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
  const rs = await client.execute(
    new GetTunnels({
      user_id: mainStore.userId!,
      page: page.value.current,
      size: page.value.size,
    }),
  );
  if (rs.status === 200) {
    page.value.count = rs.data.pagination.count;
    tunnelOptions.value.length = 0;
    rs.data.list.forEach((it) => {
      tunnelOptions.value.push({
        label: it.name,
        value: it.id,
      });
    });
    tunnelOptions.value = sortOptionsByName(tunnelOptions.value);
    tunnelSelected.value = tunnelOptions.value[0].value as number;
  } else message.error(rs.message);
}

async function getNodes() {
  const rs = await client.execute(
    new GetNodes({
      user_id: mainStore.userId!,
      page: page.value.current,
      size: page.value.size,
    }),
  );
  if (rs.status === 200) {
    page.value.count = rs.data.pagination.count;
    rs.data.list.forEach((it) => {
      nodeOptions.value.length = 0;
      nodeOptions.value.push({
        label: it.name,
        value: it.id,
      });
    });
    nodeOptions.value = sortOptionsByName(nodeOptions.value);
    nodeSelected.value = nodeOptions.value[0].value as number;
  } else message.error(rs.message);
}

onMounted(async () => {
  await getTunnels();
  await getNodes();
  await getTunnelConfig(Mode.TUNNEL);
});

function sortOptionsByName(data: Array<SelectOption>): Array<SelectOption> {
  return data.sort((a, b) => {
    return (a.label as string).localeCompare(b.label as string);
  });
}
</script>
