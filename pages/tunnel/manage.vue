<template>
  <page-content title="隧道管理">
    <n-space vertical>
      <n-space align="center">
        <n-input placeholder="搜索项目...">
          <template #prefix>
            <n-icon :component="Search" />
          </template>
        </n-input>
        <n-button type="success">搜索</n-button>
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
              <n-button type="error" secondary> 删除 </n-button>
            </template>
            确定要删除这些隧道吗？此操作无法撤销。
          </n-popconfirm>
          <n-popconfirm @positive-click="handleBatchForceDownTunnel">
            <template #trigger>
              <n-button type="warning" secondary> 强制下线 </n-button>
            </template>
            确认要强制下线这些隧道吗？此操作将使隧道下线。
          </n-popconfirm>
        </n-space>
      </n-card>

      <n-spin :show="loading.page">
        <n-space vertical>
          <n-empty v-if="tunnels.length === 0" />
          <n-el v-else>
            <!-- 卡片模式 -->
            <n-el v-if="viewMode === 'card'">
              <n-grid :y-gap="8" :x-gap="12" :cols="4" item-responsive>
                <n-grid-item
                  v-for="tunnel in tunnels"
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
                            {{ tunnel.type.toUpperCase() }}
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
                      <!-- TODO: Content -->
                      <n-text>
                        节点: {{ tunnel.node.name ?? "未知节点" }}
                      </n-text>
                      <br /><n-text> 本地端口: {{ tunnel.localPort }} </n-text>
                      <br /><n-text>
                        远程端口: {{ tunnel.remotePort ?? "无" }}
                      </n-text>
                      <br /><n-text>
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
                              <n-button type="error" secondary> 删除 </n-button>
                            </template>
                            确定要删除此隧道吗？此操作无法撤销。
                          </n-popconfirm>
                          <n-popconfirm
                            @positive-click="handleForceDownTunnel(tunnel.id)"
                          >
                            <template #trigger>
                              <n-button type="warning" secondary>
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
                    <n-tr v-for="tunnel in tunnels" :key="tunnel.id">
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
                      <n-td>{{ tunnel.type.toUpperCase() }}</n-td>
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
                                <n-button type="error" secondary>
                                  删除
                                </n-button>
                              </template>
                              确定要删除此隧道吗？此操作无法撤销。
                            </n-popconfirm>
                            <n-popconfirm
                              @positive-click="handleForceDownTunnel(tunnel.id)"
                            >
                              <template #trigger>
                                <n-button type="warning" secondary>
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
          <n-table style="white-space: nowrap">
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
                <td>{{ selectedTunnel.node.host }}</td>
              </tr>
              <tr>
                <td>节点 IP</td>
                <td>{{ selectedTunnel.node.ip }}</td>
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
                <td>域名</td>
                <td>{{ selectedTunnel.domain }}</td>
              </tr>
            </tbody>
          </n-table>
        </n-scrollbar>
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
            <n-text>简易启动命令: </n-text>
            <n-tooltip trigger="click">
              <template #trigger>
                <n-button type="success" secondary> 点击显示 </n-button>
              </template>
              <n-scrollbar x-scrollable>
                <n-code :code="computeStartCommand(selectedTunnel)" />
              </n-scrollbar>
            </n-tooltip>
            <n-button
              type="info"
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
      <!-- <tunnel-config></tunnel-config> -->
    </n-modal>
  </page-content>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";
import { useUserStore } from "@/store/user";

import { Error } from "@vicons/carbon";
import { Search } from "@vicons/ionicons5";

import { Client as ApiClient } from "@/api/src/client";
import { GetTunnels } from "@/api/src/api/tunnels.get";
definePageMeta({
  title: "隧道管理",
});

const mainStore = useMainStore();
const userStore = useUserStore();
const client = new ApiClient(mainStore.token!);
client.initClient();

const message = useMessage();

const viewMode = ref<string>("card");

const loading = ref<{
  page: boolean;
}>({
  page: true,
});

const nodes = ref<
  {
    id: number;
    name: string;
  }[]
>([]);

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
  localPort: number;
  remotePort: number | null;
  domain: string | null;
  status: string;
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
  localPort: 0,
  remotePort: null,
  domain: null,
  status: "",
});

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
});

async function handleBatchEdit() {
  // TODO
}

async function handleInfoModal(tunnel: Tunnel) {
  selectedTunnel.value = tunnel;
  modal.value.info.show = true;
}

async function handleModifyTunnel(tunnel: Tunnel) {
  // TODO
}

async function handleDeleteTunnel(tunnelId: number) {
  // TODO
}

async function handleBatchDeleteTunnel() {
  // TODO
}

async function handleForceDownTunnel(tunnelId: number) {
  // TODO
}

async function handleBatchForceDownTunnel() {
  // TODO
}

function handleClickToRun(tunnelId: number) {
  window.open(`locyanfrp://${userStore.frpToken}/${tunnelId}`);
}

function handleBatchSelect(tunnelId: number) {
  if (batchSelected.value.includes(tunnelId))
    batchSelected.value = batchSelected.value.filter((id) => id !== tunnelId);
  else batchSelected.value.push(tunnelId);
  batchSelectState.value = tunnels.value
    .map((tunnel) => tunnel.id)
    .every((id) => batchSelected.value.includes(id));
}

function handleSelectAll(val: boolean) {
  if (val) tunnels.value.forEach((it) => batchSelected.value.push(it.id));
  else batchSelected.value.length = 0;
}

async function getTunnels() {
  loading.value.page = true;
  const rs = await client.execute(
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
        localPort: it.local_port,
        remotePort: it.remote_port,
        domain: it.domain,
        status: it.status,
      });
    });
  } else message.error(rs.message);
  loading.value.page = false;
}

onMounted(async () => {
  await getTunnels();
});

function computeConnectAddr(tunnel: Tunnel): string {
  switch (tunnel.type) {
    case "http":
    case "https":
      return tunnel.domain!;
    case "xtcp":
    case "stcp":
      return "需配合 visitor";
    default:
      return `${tunnel.node.host}:${tunnel.remotePort}`;
  }
}
function computeStartCommand(tunnel: Tunnel): string {
  return `./frpc -u ${userStore.frpToken} -p ${tunnel.id}`;
}
</script>
