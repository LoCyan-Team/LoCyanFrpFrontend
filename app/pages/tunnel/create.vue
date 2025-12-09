<template>
  <page-content title="创建隧道">
    <transition name="fade" mode="out-in">
      <n-el v-if="selectedNode !== null">
        <n-spin :show="loading.create">
          <tunnel-config :node="selectedNode" @submit="handleCreate">
            <template #node-footer>
              <n-button type="warning" secondary @click="selectedNode = null">
                重新选择
              </n-button>
            </template>
          </tunnel-config>
        </n-spin>
      </n-el>
      <n-el v-else>
        <n-spin :show="loading.nodes">
          <n-card title="请选择节点">
            <n-space vertical>
              <n-empty v-if="nodes.length === 0" />
              <n-grid v-else :x-gap="8" :y-gap="12" :cols="3" item-responsive>
                <n-grid-item
                  v-for="node in nodes"
                  :key="node.id"
                  span="0:3 1000:1"
                >
                  <node-card :node="node">
                    <template #header-extra>
                      <n-button
                        type="success"
                        secondary
                        @click="handleNodeSelect(node)"
                      >
                        选择
                      </n-button>
                    </template>
                  </node-card>
                </n-grid-item>
              </n-grid>

              <n-space
                v-if="nodes.length !== 0"
                justify="center"
                style="width: 100%"
              >
                <n-pagination
                  v-model:page="page.current"
                  v-model:page-size="page.size"
                  :page-count="page.count"
                  show-size-picker
                  :on-update:page="
                    (pageSel) => {
                      page.current = pageSel;
                      getNodes();
                    }
                  "
                  :on-update:page-size="
                    (pageSizeSel) => {
                      page.size = pageSizeSel;
                      getNodes();
                    }
                  "
                  :page-sizes="[10, 25, 50, 100]"
                />
              </n-space>
            </n-space>
          </n-card>
        </n-spin>
      </n-el>
    </transition>
  </page-content>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";

import { GetNodes, type GetNodesResponse } from "api/src/api/nodes.get";
import { PutTunnel } from "api/src/api/tunnel.put";

useHead({
  title: "创建隧道",
});

const mainStore = useMainStore();
const client = useApiClient();

const message = useMessage();
const dialog = useDialog();

type ProxyProtocolVersion = "V1" | "V2";

interface Node {
  id: number;
  name: string;
  description: string | null;
  host: string;
  ip: string | null;
  portRange: string[];
  additional: {
    allowUdp: boolean;
    allowHttp: boolean;
    allowBigTraffic: boolean;
    needIcp: boolean;
  };
}

const loading = ref<{
  nodes: boolean;
  create: boolean;
}>({
  nodes: true,
  create: false,
});

const selectedNode = ref<Node | null>(null);

const nodes = ref<Node[]>([]);

const page = ref<{
  current: number;
  size: number;
  count: number;
}>({
  current: 1,
  size: 10,
  count: 1,
});

function handleNodeSelect(node: Node) {
  selectedNode.value = node;
}

async function handleCreate(tunnel: {
  name: string;
  type: string;
  localIp: string;
  localPort: number;
  remotePort: number | null;
  useEncryption: boolean;
  useCompression: boolean;
  domain: string | null;
  locations: string[] | null;
  secretKey: string | null;
  proxyProtocolVersion: string | null;
}) {
  loading.value.create = true;
  const rs = await client.execute(
    new PutTunnel({
      user_id: mainStore.userId!,
      node_id: selectedNode.value!.id,
      name: tunnel.name,
      type: tunnel.type,
      local_ip: tunnel.localIp,
      local_port: tunnel.localPort,
      remote_port: tunnel.remotePort ?? undefined,
      use_encryption: tunnel.useEncryption,
      use_compression: tunnel.useCompression,
      domain: tunnel.domain ?? undefined,
      locations: tunnel.locations ?? undefined,
      secret_key: tunnel.secretKey ?? undefined,
      proxy_protocol_version:
        (tunnel.proxyProtocolVersion as ProxyProtocolVersion | null) ??
        undefined,
    }),
  );
  if (rs.status === 200)
    dialog.success({
      title: "创建成功",
      content: "隧道创建成功。",
    });
  else message.error(rs.message);

  loading.value.create = false;
}

async function getNodes() {
  loading.value.nodes = true;
  const rs = await client.execute<GetNodesResponse>(
    new GetNodes({
      user_id: mainStore.userId!,
      page: page.value.current,
      size: page.value.size,
    }),
  );
  if (rs.status === 200) {
    page.value.count = rs.data.pagination.count;
    nodes.value.length = 0;
    rs.data.list.forEach((it) => {
      nodes.value.push({
        id: it.id,
        name: it.name,
        description: it.description,
        host: it.host,
        ip: it.ip,
        portRange: it.port_range,
        additional: {
          allowUdp: it.additional.allow_udp,
          allowHttp: it.additional.allow_http,
          allowBigTraffic: it.additional.allow_big_traffic,
          needIcp: it.additional.need_icp,
        },
      });
    });
  } else message.error(rs.message);
  loading.value.nodes = false;
}

onMounted(async () => {
  await getNodes();
});
</script>
