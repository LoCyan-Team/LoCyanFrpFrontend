<template>
  <page-content title="隧道管理">
    <n-space vertical>
      <n-space align="center">
        <n-input
          v-model:value="searchKeyword"
          placeholder="搜索项目..."
          @keydown.enter="handleSearch"
        >
          <template #prefix>
            <n-icon :component="Search" />
          </template>
        </n-input>
        <n-button type="success" @click="handleSearch">搜索</n-button>
        <n-radio-group v-model:value="viewMode" name="viewMode">
          <n-radio-button value="card" label="卡片视图" />
          <n-radio-button value="list" label="列表视图" />
        </n-radio-group>
        <n-switch
          v-model:value="batchSelectState"
          :round="false"
          size="large"
          @update:value="handleSelectAll"
        >
          <template #checked>全选</template>
          <template #unchecked>全选</template>
        </n-switch>
      </n-space>
      <n-card v-if="batchSelected.length > 0" embedded>
        <n-space>
          <n-button type="info" secondary @click="handleBatchEdit">
            修改
          </n-button>
          <n-popconfirm @positive-click="handleBatchDeleteTunnel">
            <template #trigger>
              <n-button
                type="error"
                :loading="loading.batch.delete"
                :disabled="loading.batch.delete"
                secondary
              >
                删除
              </n-button>
            </template>
            确定要删除这些隧道吗？此操作无法撤销。
          </n-popconfirm>
          <n-popconfirm @positive-click="handleBatchForceDownTunnel">
            <template #trigger>
              <n-button
                type="warning"
                :loading="loading.batch.down"
                :disabled="loading.batch.delete"
                secondary
              >
                强制下线
              </n-button>
            </template>
            确认要强制下线这些隧道吗？此操作将使隧道下线。
          </n-popconfirm>
        </n-space>
      </n-card>

      <n-spin :show="loading.page">
        <n-space vertical>
          <n-empty v-if="displayTunnels.length === 0" />
          <n-el v-else>
            <!-- 卡片模式 -->
            <n-el v-if="viewMode === 'card'">
              <n-grid :y-gap="8" :x-gap="12" :cols="4" item-responsive>
                <n-grid-item
                  v-for="tunnel in displayTunnels"
                  :key="tunnel.id"
                  span="0:4 1000:1"
                >
                  <n-spin
                    :show="tunnel.status === 'BANNED'"
                    style="
                      --disable-color: #d90303;
                      --n-color: var(--disable-color);
                      --n-text-color: var(--disable-color);
                    "
                    :rotate="false"
                  >
                    <template #icon>
                      <n-icon :component="Error" />
                    </template>
                    <template #description>已封禁</template>
                    <n-card :title="tunnel.name">
                      <template #header-extra>
                        <n-space style="margin-right: 10px">
                          <n-tag type="success">
                            {{ tunnel.type }}
                          </n-tag>
                          <n-tag type="info"> ID: {{ tunnel.id }} </n-tag>
                        </n-space>
                        <n-el @click="handleBatchSelect(tunnel.id)">
                          <n-checkbox
                            :checked="batchSelected.includes(tunnel.id)"
                            size="large"
                          />
                        </n-el>
                      </template>
                      <n-text>
                        节点: {{ tunnel.node.name ?? "未知节点" }}
                      </n-text>
                      <br />
                      <n-text> 本地端口: {{ tunnel.localPort }} </n-text>
                      <br />
                      <n-text>
                        远程端口: {{ tunnel.remotePort ?? "无" }}
                      </n-text>
                      <br />
                      <n-text>
                        自定义域名:
                        <n-a
                          v-if="tunnel.domain"
                          :href="`${tunnel.type}://${tunnel.domain}`"
                          target="_blank"
                        >
                          {{ tunnel.domain }}
                        </n-a>
                        <n-text v-else>无</n-text>
                      </n-text>
                      <template v-if="tunnel.node.host" #footer>
                        <n-text>连接地址:</n-text>
                        <n-scrollbar x-scrollable>
                          <n-tooltip trigger="hover">
                            <template #trigger>
                              <n-button
                                text
                                @click="
                                  $copyToClipboard(computeConnectAddr(tunnel))
                                "
                              >
                                <n-code :code="computeConnectAddr(tunnel)" />
                              </n-button>
                            </template>
                            点击复制
                          </n-tooltip>
                        </n-scrollbar>
                      </template>
                      <template #action>
                        <n-space>
                          <n-button
                            type="info"
                            secondary
                            @click="handleInfoModal(tunnel)"
                          >
                            详细信息
                          </n-button>
                          <n-button
                            type="success"
                            secondary
                            @click="handleModifyTunnel(tunnel)"
                          >
                            修改
                          </n-button>
                          <n-popconfirm
                            @positive-click="handleDeleteTunnel(tunnel.id)"
                          >
                            <template #trigger>
                              <n-button
                                type="error"
                                :loading="
                                  loading.tunnel.delete.includes(tunnel.id)
                                "
                                :disabled="
                                  loading.tunnel.delete.includes(tunnel.id)
                                "
                                secondary
                              >
                                删除
                              </n-button>
                            </template>
                            确定要删除此隧道吗？此操作无法撤销。
                          </n-popconfirm>
                          <n-popconfirm
                            @positive-click="handleForceDownTunnel(tunnel.id)"
                          >
                            <template #trigger>
                              <n-button
                                type="warning"
                                :loading="loading.tunnel.down.includes(tunnel.id)"
                                :disabled="loading.tunnel.down.includes(tunnel.id)"
                                secondary
                              >
                                强制下线
                              </n-button>
                            </template>
                            确认要强制下线此隧道吗？此操作将使隧道下线。
                          </n-popconfirm>
                        </n-space>
                      </template>
                    </n-card>
                  </n-spin>
                </n-grid-item>
              </n-grid>
            </n-el>
            <!-- 列表模式 -->
            <n-el v-if="viewMode === 'list'">
              <n-scrollbar x-scrollable>
                <n-table
                  style="min-width: 800px"
                  :bordered="true"
                  :single-line="false"
                >
                  <n-thead>
                    <n-tr>
                      <n-th>选择</n-th>
                      <n-th>隧道 ID</n-th>
                      <n-th>隧道名</n-th>
                      <n-th>隧道节点</n-th>
                      <n-th>隧道协议</n-th>
                      <n-th>本地端口</n-th>
                      <n-th>远程端口</n-th>
                      <n-th>自定义域名</n-th>
                      <n-th>连接地址</n-th>
                      <n-th>操作</n-th>
                    </n-tr>
                  </n-thead>
                  <n-tbody>
                    <n-tr v-for="tunnel in displayTunnels" :key="tunnel.id">
                      <n-td>
                        <n-el @click="handleBatchSelect(tunnel.id)">
                          <n-checkbox
                            :checked="batchSelected.includes(tunnel.id)"
                          />
                        </n-el>
                      </n-td>
                      <n-td>{{ tunnel.id }}</n-td>
                      <n-td>{{ tunnel.name }}</n-td>
                      <n-td>
                        {{ tunnel.node.name ?? "未知节点" }}
                      </n-td>
                      <n-td>{{ tunnel.type }}</n-td>
                      <n-td>{{ tunnel.localPort }}</n-td>
                      <n-td>{{ tunnel.remotePort }}</n-td>
                      <n-td>
                        <n-a
                          v-if="tunnel.domain"
                          :href="`${tunnel.type}://${tunnel.domain}`"
                          target="_blank"
                        >
                          {{ tunnel.domain }}
                        </n-a>
                      </n-td>
                      <n-td v-if="tunnel.node.host">
                        <n-tooltip trigger="hover">
                          <template #trigger>
                            <n-button
                              text
                              @click="
                                $copyToClipboard(computeConnectAddr(tunnel))
                              "
                            >
                              <n-code :code="computeConnectAddr(tunnel)" />
                            </n-button>
                          </template>
                          点击复制
                        </n-tooltip>
                      </n-td>
                      <n-td v-else />
                      <n-td>
                        <n-spin
                          :show="tunnel.status === 'BANNED'"
                          style="
                            --disable-color: #d90303;
                            --n-color: var(--disable-color);
                            --n-text-color: var(--disable-color);
                          "
                          :rotate="false"
                        >
                          <template #icon>
                            <n-icon :component="Error" />
                          </template>
                          <template #description>已封禁</template>
                          <n-space :inline="true" :wrap="false">
                            <n-button
                              type="info"
                              secondary
                              @click="handleInfoModal(tunnel)"
                            >
                              详细信息
                            </n-button>
                            <n-button
                              type="success"
                              secondary
                              @click="handleModifyTunnel(tunnel)"
                            >
                              修改
                            </n-button>
                            <n-popconfirm
                              @positive-click="handleDeleteTunnel(tunnel.id)"
                            >
                              <template #trigger>
                                <n-button
                                  type="error"
                                  :loading="
                                    loading.tunnel.delete.includes(tunnel.id)
                                  "
                                  :disabled="
                                    loading.tunnel.delete.includes(tunnel.id)
                                  "
                                  secondary
                                >
                                  删除
                                </n-button>
                              </template>
                              确定要删除此隧道吗？此操作无法撤销。
                            </n-popconfirm>
                            <n-popconfirm
                              @positive-click="handleForceDownTunnel(tunnel.id)"
                            >
                              <template #trigger>
                                <n-button
                                  type="warning"
                                  :loading="loading.tunnel.down.includes(tunnel.id)"
                                  :disabled="loading.tunnel.down.includes(tunnel.id)"
                                  secondary
                                >
                                  强制下线
                                </n-button>
                              </template>
                              确认要强制下线此隧道吗？此操作将使隧道下线。
                            </n-popconfirm>
                          </n-space>
                        </n-spin>
                      </n-td>
                    </n-tr>
                  </n-tbody>
                </n-table>
              </n-scrollbar>
            </n-el>
          </n-el>
          <n-space
            v-if="tunnels.length !== 0"
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
                  getTunnels();
                }
              "
              :on-update:page-size="
                (pageSizeSel) => {
                  page.size = pageSizeSel;
                  getTunnels();
                }
              "
              show-size-picker
              :page-sizes="[10, 25, 50, 100]"
            />
          </n-space>
        </n-space>
      </n-spin>
    </n-space>
    <n-modal
      v-model:show="modal.batchEdit.show"
      preset="card"
      title="批量编辑"
      size="huge"
      :bordered="false"
      style="max-width: 600px"
    >
      <n-form :model="batchEditForm">
        <n-form-item label="节点" path="node">
          <n-select />
        </n-form-item>
        <n-form-item label="类型" path="type">
          <n-radio-group>
            <n-radio-button value="keep">不修改</n-radio-button>
            <n-radio-button value="tcp">TCP</n-radio-button>
            <n-radio-button value="udp">UDP</n-radio-button>
            <n-radio-button value="http">HTTP</n-radio-button>
            <n-radio-button value="https">HTTPS</n-radio-button>
            <n-radio-button value="xtcp">XTCP</n-radio-button>
            <n-radio-button value="stcp">STCP</n-radio-button>
            <n-radio-button value="sudp">SUDP</n-radio-button>
          </n-radio-group>
        </n-form-item>
      </n-form>
    </n-modal>
    <n-modal
      v-model:show="modal.info.show"
      preset="card"
      title="隧道信息"
      size="huge"
      :bordered="false"
      style="max-width: 600px"
    >
      <n-space vertical>
        <n-scrollbar x-scrollable>
          <n-table :single-line="false" style="white-space: nowrap">
            <thead>
              <tr>
                <th>数据</th>
                <th>值</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>隧道 ID</td>
                <td>{{ selectedTunnel.id }}</td>
              </tr>
              <tr>
                <td>隧道名称</td>
                <td>{{ selectedTunnel.name }}</td>
              </tr>
              <tr>
                <td>隧道类型</td>
                <td>{{ selectedTunnel.type }}</td>
              </tr>
              <tr>
                <td>节点名称</td>
                <td>{{ selectedTunnel.node.name }}</td>
              </tr>
              <tr>
                <td>节点主机名</td>
                <td>
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <n-button
                        text
                        @click="$copyToClipboard(selectedTunnel.node.host!)"
                      >
                        <n-code :code="selectedTunnel.node.host!" />
                      </n-button>
                    </template>
                    点击复制
                  </n-tooltip>
                </td>
              </tr>
              <tr>
                <td>节点 IP</td>
                <td>
                  <n-tooltip v-if="selectedTunnel.node.ip" trigger="hover">
                    <template #trigger>
                      <n-button
                        text
                        @click="$copyToClipboard(selectedTunnel.node.ip!)"
                      >
                        <n-code :code="selectedTunnel.node.ip" />
                      </n-button>
                    </template>
                    点击复制
                  </n-tooltip>
                  <n-text v-else />
                </td>
              </tr>
              <tr>
                <td>本地 IP</td>
                <td>{{ selectedTunnel.localIp }}</td>
              </tr>
              <tr>
                <td>本地端口</td>
                <td>{{ selectedTunnel.localPort }}</td>
              </tr>
              <tr>
                <td>远程端口</td>
                <td>{{ selectedTunnel.remotePort }}</td>
              </tr>
              <tr>
                <td>自定义域名</td>
                <td>{{ selectedTunnel.domain }}</td>
              </tr>
              <tr>
                <td>自定义路径</td>
                <td>
                  <n-tag
                    v-for="location in selectedTunnel.locations"
                    :key="location"
                  >
                    {{ location }}
                  </n-tag>
                </td>
              </tr>
              <tr>
                <td>Proxy Protocol</td>
                <td>
                  {{
                    selectedTunnel.proxyProtocolVersion?.toLowerCase() || "禁用"
                  }}
                </td>
              </tr>
            </tbody>
          </n-table>
        </n-scrollbar>
        <n-space
          vertical
          v-if="['HTTP', 'HTTPS'].includes(selectedTunnel.type)"
        >
          <n-alert type="info">
            您需要在您的域名 DNS 提供商处添加 DNS
            解析记录至节点服务器，才能访问您的服务。
          </n-alert>
          <n-scrollbar x-scrollable>
            <n-table
              :single-line="false"
              size="small"
              style="white-space: nowrap"
            >
              <thead>
                <tr>
                  <th>域名</th>
                  <th>记录值</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <n-button
                      text
                      @click="$copyToClipboard(selectedTunnel.domain)"
                    >
                      <n-code :code="selectedTunnel.domain!" />
                    </n-button>
                  </td>
                  <td>
                    <n-button
                      text
                      @click="$copyToClipboard(selectedTunnel.node.host)"
                    >
                      <n-code :code="selectedTunnel.node.host!" />
                    </n-button>
                  </td>
                </tr>
              </tbody>
            </n-table>
          </n-scrollbar>
        </n-space>
        <n-el>
          <n-text>连接地址: </n-text>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                text
                @click="$copyToClipboard(computeConnectAddr(selectedTunnel))"
              >
                <n-code :code="computeConnectAddr(selectedTunnel)" />
              </n-button>
            </template>
            点击复制
          </n-tooltip>
        </n-el>
        <n-el>
          <n-space align="center">
            <n-text>简易启动命令:</n-text>
            <n-tooltip trigger="click">
              <template #trigger>
                <n-button type="success" size="small" secondary>
                  点击显示
                </n-button>
              </template>
              <n-scrollbar x-scrollable>
                <n-code :code="computeStartCommand(selectedTunnel)" />
              </n-scrollbar>
            </n-tooltip>
            <n-button
              type="info"
              size="small"
              secondary
              @click="$copyToClipboard(computeStartCommand(selectedTunnel))"
            >
              点击复制
            </n-button>
          </n-space>
        </n-el>
        <n-divider />
        <n-button
          type="success"
          secondary
          style="width: 100%"
          @click="handleClickToRun(selectedTunnel.id)"
        >
          一键启动（需安装启动器）
        </n-button>
      </n-space>
    </n-modal>
    <n-modal
      v-model:show="modal.edit.show"
      preset="card"
      title="编辑隧道"
      size="huge"
      :bordered="false"
      style="max-width: 600px"
    >
      <tunnel-config
        :node="selectedNode"
        :default="{
          name: selectedTunnel.name,
          type: selectedTunnel.type,
          localIp: selectedTunnel.localIp,
          localPort: selectedTunnel.localPort,
          remotePort: selectedTunnel.remotePort,
          useEncryption: selectedTunnel.useEncryption,
          useCompression: selectedTunnel.useCompression,
          domain: selectedTunnel.domain,
          locations: selectedTunnel.locations,
          proxyProtocolVersion: selectedTunnel.proxyProtocolVersion,
        }"
        @submit="
          (tunnelData) =>
            handleSubmitModifyTunnel(
              selectedTunnel.id,
              selectedTunnel.status,
              tunnelData,
            )
        "
      >
        <template #node-footer>
          <n-button
            type="warning"
            secondary
            @click="
              () => {
                editNodeSelected = null;
                modal.edit.nodeSelector = true;
              }
            "
          >
            更换节点
          </n-button>
          <n-modal
            v-model:show="modal.edit.nodeSelector"
            preset="card"
            title="选择节点"
            size="huge"
            :bordered="false"
            style="max-width: 500px"
          >
            <n-form>
              <n-form-item label="请选择节点">
                <n-space vertical style="width: 100%">
                  <n-select
                    v-model:value="editNodeSelected"
                    :options="editNodeSelectOptions"
                  />
                  <n-pagination
                    v-model:page="nodePage.current"
                    v-model:page-size="nodePage.size"
                    :page-count="nodePage.count"
                    :on-update:page="
                      (pageSel) => {
                        nodePage.current = pageSel;
                        getNodes();
                      }
                    "
                    :on-update:page-size="
                      (pageSizeSel) => {
                        nodePage.size = pageSizeSel;
                        getNodes();
                      }
                    "
                    show-size-picker
                    :page-sizes="[10, 25, 50, 100]"
                  />
                </n-space>
              </n-form-item>
              <n-button
                type="success"
                @click="
                  () => {
                    selectedNode = findNode(editNodeSelected!);
                    modal.edit.nodeSelector = false;
                  }
                "
              >
                确定
              </n-button>
            </n-form>
          </n-modal>
        </template>
      </tunnel-config>
    </n-modal>
  </page-content>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";
import { useUserStore } from "@/store/user";

import type { SelectOption } from "naive-ui";

import Error from "@vicons/carbon/Error";
import Search from "@vicons/ionicons5/Search";

import { GetTunnels, type GetTunnelsResponse } from "api/src/api/tunnels.get";
import { GetNodes, type GetNodesResponse } from "api/src/api/nodes.get";
import { DeleteTunnel } from "api/src/api/tunnel.delete";
import { DeleteBatch as DeleteTunnelBatch } from "api/src/api/tunnel/batch.delete";
import { PatchTunnel } from "api/src/api/tunnel.patch";
import { DeleteDown as ForceDownTunnel } from "api/src/api/tunnel/down.delete";
import {
  DeleteBatch as ForceDownTunnelBatch,
  type DeleteBatchResponse as ForceDownTunnelBatchResponse,
} from "api/src/api/tunnel/down/batch.delete";

useHead({
  title: "隧道管理",
});

const mainStore = useMainStore();
const userStore = useUserStore();
const client = useApiClient();

const message = useMessage();
const dialog = useDialog();

const viewMode = ref<string>("card");

const loading = ref<{
  page: boolean;
  batch: {
    delete: boolean;
    down: boolean;
  };
  tunnel: {
    editSubmit: boolean;
    delete: number[];
    down: number[];
  };
}>({
  page: true,
  batch: {
    delete: false,
    down: false,
  },
  tunnel: {
    editSubmit: false,
    delete: [],
    down: [],
  },
});

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

const nodes = ref<Node[]>([]);

type ProxyProtocolVersion = "V1" | "V2";

interface Tunnel {
  id: number;
  name: string;
  type: string;
  node: {
    id: number;
    name: string | null;
    host: string | null;
    ip: string | null;
  };
  localIp: string;
  localPort: number;
  remotePort: number | null;
  useEncryption: boolean;
  useCompression: boolean;
  domain: string | null;
  locations: string[] | null;
  status: string;
  proxyProtocolVersion: ProxyProtocolVersion | null;
}

const tunnels = ref<Tunnel[]>([]);

const selectedTunnel = ref<Tunnel>({
    id: 0,
    name: "",
    type: "",
    node: {
      id: 0,
      name: null,
      host: null,
      ip: null,
    },
    localIp: "",
    localPort: 0,
    remotePort: null,
    useEncryption: false,
    useCompression: false,
    domain: null,
    locations: null,
    proxyProtocolVersion: null,
    status: "",
  }),
  selectedNode = ref<Node>({
    id: 0,
    name: "",
    description: null,
    host: "",
    ip: null,
    portRange: [],
    additional: {
      allowUdp: false,
      allowHttp: false,
      allowBigTraffic: false,
      needIcp: false,
    },
  });

const editNodeSelected = ref<number | null>(null);
const editNodeSelectOptions = ref<SelectOption[]>([]);

const batchSelectState = ref<boolean>(false);
const batchSelected = ref<number[]>([]);

const batchEditForm = ref<{
  node: number | null;
  type: string;
}>({
  node: null,
  type: "keep",
});

const modal = ref<{
  info: {
    show: boolean;
  };
  edit: {
    show: boolean;
    nodeSelector: boolean;
  };
  batchEdit: {
    show: boolean;
  };
}>({
  info: {
    show: false,
  },
  edit: {
    show: false,
    nodeSelector: false,
  },
  batchEdit: {
    show: false,
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

const searchKeyword = ref("");
const displayTunnels = ref<Tunnel[]>([]);

/**
 * 根据关键词搜索隧道列表
 * @param tunnelsList 隧道列表
 * @param keyword 搜索关键词
 */
function filterTunnelsByKeyword(
  tunnelsList: Tunnel[],
  keyword: string,
): Tunnel[] {
  if (!keyword || !keyword.trim()) {
    return [...tunnelsList];
  }

  const searchTerm = keyword.trim().toLowerCase();
  return tunnelsList.filter((tunnel) => {
    const nameMatch = tunnel.name.toLowerCase().includes(searchTerm); // 名称包含关键词
    const idMatch = tunnel.id.toString() === searchTerm; // ID与关键词相等
    return nameMatch || idMatch;
  });
}

watch(
  tunnels,
  (newTunnels) => {
    // 如果有搜索关键词，需要重新过滤
    if (searchKeyword.value.trim() !== "")
      displayTunnels.value = filterTunnelsByKeyword(
        tunnels.value,
        searchKeyword.value,
      );
    else {
      displayTunnels.value = [...newTunnels];
    }
  },
  { deep: true },
);

/**
 * 处理搜索隧道
 */
async function handleSearch() {
  loading.value.page = true;
  displayTunnels.value = filterTunnelsByKeyword(
    tunnels.value,
    searchKeyword.value,
  );
  loading.value.page = false;
}

/**
 * 处理批量编辑隧道
 */
async function handleBatchEdit() {
  // TODO
}

/**
 * 处理隧道详情弹窗
 * @param tunnel 隧道信息
 */
async function handleInfoModal(tunnel: Tunnel) {
  selectedTunnel.value = tunnel;
  modal.value.info.show = true;
}

/**
 * 处理修改隧道弹窗
 * @param tunnel 隧道信息
 */
async function handleModifyTunnel(tunnel: Tunnel) {
  selectedTunnel.value = tunnel;
  selectedNode.value = findNode(tunnel.node.id);
  modal.value.edit.show = true;
}

/**
 * 处理提交修改隧道
 * @param tunnelId 隧道 ID
 * @param tunnelStatus 隧道状态（仅内部传入）
 * @param tunnel 隧道信息
 */
async function handleSubmitModifyTunnel(
  tunnelId: number,
  tunnelStatus: string,
  tunnel: {
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
    proxyProtocolVersion: ProxyProtocolVersion | null;
  },
) {
  loading.value.tunnel.editSubmit = true;
  const rs = await client.execute(
    new PatchTunnel({
      user_id: mainStore.userId!,
      tunnel_id: tunnelId,
      name: tunnel.name,
      type: tunnel.type,
      local_ip: tunnel.localIp,
      local_port: tunnel.localPort,
      remote_port: tunnel.remotePort ?? undefined,
      use_encryption: tunnel.useEncryption,
      use_compression: tunnel.useCompression,
      proxy_protocol_version: tunnel.proxyProtocolVersion ?? undefined,
      node_id: selectedNode.value.id,
      domain: tunnel.domain ?? undefined,
      locations: tunnel.locations ?? undefined,
      secret_key: tunnel.secretKey ?? undefined,
    }),
  );
  if (rs.status === 200) {
    modal.value.edit.show = false;
    const arr = tunnels.value.filter((tunnel) => tunnel.id !== tunnelId);
    arr.push({
      id: tunnelId,
      name: tunnel.name,
      type: tunnel.type,
      node: {
        id: selectedNode.value.id,
        name: selectedNode.value.name,
        host: selectedNode.value.host,
        ip: selectedNode.value.ip,
      },
      localIp: tunnel.localIp,
      localPort: tunnel.localPort,
      remotePort: tunnel.remotePort,
      useEncryption: tunnel.useEncryption,
      useCompression: tunnel.useCompression,
      domain: tunnel.domain,
      locations: tunnel.locations,
      proxyProtocolVersion: tunnel.proxyProtocolVersion,
      status: tunnelStatus,
    });
    tunnels.value = sortTunnelsById(arr);
  } else message.error(rs.message);
  loading.value.tunnel.editSubmit = false;
}

/**
 * 处理删除隧道
 * @param tunnelId 隧道 ID
 */
async function handleDeleteTunnel(tunnelId: number) {
  loading.value.tunnel.delete.push(tunnelId);
  const rs = await client.execute(
    new DeleteTunnel({
      user_id: mainStore.userId!,
      tunnel_id: tunnelId,
    }),
  );
  if (rs.status === 200) {
    tunnels.value = tunnels.value.filter((tunnel) => tunnel.id !== tunnelId);
  } else message.error(rs.message);
  loading.value.tunnel.delete = loading.value.tunnel.delete.filter(
    (id) => id !== tunnelId,
  );
}

/**
 * 处理批量删除隧道
 */
async function handleBatchDeleteTunnel() {
  const selected = batchSelected.value;

  loading.value.batch.delete = true;
  const rs = await client.execute(
    new DeleteTunnelBatch({
      user_id: mainStore.userId!,
      tunnel_ids: selected,
    }),
  );
  if (rs.status === 200) {
    tunnels.value = tunnels.value.filter(
      (tunnel) => !selected.includes(tunnel.id),
    );
  } else message.error(rs.message);
  loading.value.batch.delete = false;

  batchSelected.value.length = 0;
  batchSelectState.value = false;
}

/**
 * 处理强制下线隧道
 * @param tunnelId 隧道 ID
 */
async function handleForceDownTunnel(tunnelId: number) {
  loading.value.tunnel.down.push(tunnelId);
  const rs = await client.execute(
    new ForceDownTunnel({
      user_id: mainStore.userId!,
      tunnel_id: tunnelId,
    }),
  );
  if (rs.status === 200) {
    dialog.success({
      title: "操作成功",
      content: "强制下线指令发送成功。",
    });
  } else message.error(rs.message);
  loading.value.tunnel.down = loading.value.tunnel.down.filter(
      (id) => id !== tunnelId,
  );
}

/**
 * 处理批量强制下线隧道
 */
async function handleBatchForceDownTunnel() {
  loading.value.batch.down = true;
  const selected = batchSelected.value;

  const rs = await client.execute<ForceDownTunnelBatchResponse>(
    new ForceDownTunnelBatch({
      user_id: mainStore.userId!,
      tunnel_ids: selected,
    }),
  );
  if (rs.status === 200) {
    dialog.success({
      title: "操作成功",
      content: `强制下线指令发送成功。成功下线 ${rs.data.succeed.length} 条隧道，${
        rs.data.failed.length > 0
          ? "失败隧道: " +
            rs.data.failed
              .map((failedId) => {
                const tunnel = tunnels.value.find((t) => t.id === failedId);
                return tunnel
                  ? `${tunnel.name} (${failedId})`
                  : `未知隧道 (${failedId})`;
              })
              .join(", ")
          : ""
      }。`,
    });
  } else message.error(rs.message);
  loading.value.batch.down = false;
}

/**
 * 发起一键启动
 * @param tunnelId 隧道 ID
 */
function handleClickToRun(tunnelId: number) {
  window.open(`locyanfrp://${userStore.frpToken}/${tunnelId}`);
}

/**
 * 处理批量选择隧道
 * @param tunnelId 隧道 ID
 */
function handleBatchSelect(tunnelId: number) {
  if (batchSelected.value.includes(tunnelId))
    batchSelected.value = batchSelected.value.filter((id) => id !== tunnelId);
  else batchSelected.value.push(tunnelId);
  batchSelectState.value = tunnels.value
    .map((tunnel) => tunnel.id)
    .every((id) => batchSelected.value.includes(id));
}

/**
 * 处理全选隧道
 * @param val 是否全选
 */
function handleSelectAll(val: boolean) {
  if (val) tunnels.value.forEach((it) => batchSelected.value.push(it.id));
  else batchSelected.value.length = 0;
}

/**
 * 获取隧道列表
 */
async function getTunnels() {
  loading.value.page = true;
  const rs = await client.execute<GetTunnelsResponse>(
    new GetTunnels({
      user_id: mainStore.userId!,
      page: page.value.current,
      size: page.value.size,
    }),
  );
  if (rs.status === 200) {
    page.value.count = rs.data.pagination.count;
    tunnels.value.length = 0;
    rs.data.list.forEach((it) => {
      tunnels.value.push({
        id: it.id,
        name: it.name,
        type: it.type,
        node: {
          id: it.node.id,
          name: it.node.name,
          host: it.node.host,
          ip: it.node.ip,
        },
        localIp: it.local_ip,
        localPort: it.local_port,
        remotePort: it.remote_port,
        useEncryption: it.use_encryption,
        useCompression: it.use_compression,
        domain: it.domain,
        locations: it.locations,
        proxyProtocolVersion:
          it.proxy_protocol_version as ProxyProtocolVersion | null,
        status: it.status,
      });
    });
    tunnels.value = sortTunnelsById(tunnels.value);
    displayTunnels.value = [...tunnels.value];
  } else message.error(rs.message);
  loading.value.page = false;
}

/**
 * 获取节点列表
 */
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
    nodes.value = sortNodesByName(nodes.value);
    await buildEditNodeSelectOptions();
  } else message.error(rs.message);
}

/**
 * 构建编辑节点选择选项
 */
async function buildEditNodeSelectOptions() {
  nodes.value.forEach((it) => {
    editNodeSelectOptions.value.push({
      label: it.name,
      value: it.id,
    });
  });
}

onMounted(async () => {
  await getTunnels();
  // noinspection ES6MissingAwait
  getNodes();
});
/**
 * 按排序 ID 隧道
 * @param data 隧道列表
 * @returns 排序后的隧道列表
 */
function sortTunnelsById(data: Tunnel[]): Tunnel[] {
  return data.sort((a, b) => {
    if (a.id < b.id) {
      return -1;
    }
    if (a.id > b.id) {
      return 1;
    }
    return 0;
  });
}
/**
 * 按名称排序节点
 * @param data 节点列表
 * @returns 排序后的节点列表
 */
function sortNodesByName(data: Node[]): Node[] {
  return data.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
}

/**
 * 计算连接地址
 * @param tunnel 隧道
 * @returns 连接地址
 */
function computeConnectAddr(tunnel: Tunnel): string {
  switch (tunnel.type) {
    case "HTTP":
    case "HTTPS":
      return tunnel.domain!;
    case "XTCP":
    case "STCP":
    case "SUDP":
      return "需配合 visitor";
    default:
      return `${tunnel.node.host}:${tunnel.remotePort}`;
  }
}

/**
 * 计算启动命令
 * @param tunnel 隧道
 * @returns 启动命令
 */
function computeStartCommand(tunnel: Tunnel): string {
  return `./frpc -u ${userStore.frpToken} -p ${tunnel.id}`;
}

/**
 * 查找节点
 * @param nodeId 节点 ID
 * @returns 节点
 */
function findNode(nodeId: number): Node {
  return nodes.value.find((node) => node.id === nodeId) as Node;
}
</script>
