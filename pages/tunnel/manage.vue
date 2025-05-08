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
      <transition name="fade">
        <n-card v-if="batchSelected.length > 0" embedded>
          <n-space>
            <n-button type="info" secondary @click="handleChangeNode()">
              修改节点
            </n-button>
            <n-button type="error" secondary @click="handleDelete()">
              删除
            </n-button>
            <n-button type="warning" secondary> 强制下线 </n-button>
          </n-space>
        </n-card>
      </transition>

      <n-spin :show="loading.page">
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
                  :show="tunnel.status === -1"
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
                    <n-text>节点: {{ tunnel.node.name ?? "未知节点" }}</n-text>
                    <br /><n-text>本地端口: {{ tunnel.localPort }}</n-text>
                    <br /><n-text
                      >远程端口: {{ tunnel.remotePort ?? "无" }}</n-text
                    >
                    <br /><n-text
                      >自定义域名: {{ tunnel.domain ?? "无" }}</n-text
                    >
                    <template v-if="tunnel.node.host" #footer>
                      <n-text>连接地址:</n-text>
                      <n-scrollbar x-scrollable>
                        <n-code code="" />
                      </n-scrollbar>
                    </template>
                    <template #action>
                      <n-space>
                        <n-button type="info" secondary>详细信息</n-button>
                        <n-button type="success" secondary>修改</n-button>
                        <n-button type="error" secondary>删除</n-button>
                        <n-button type="warning" secondary>强制下线</n-button>
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
                    <n-td>{{ tunnel.domain }}</n-td>
                    <n-td v-if="tunnel.node.host">
                      <!-- TODO: Compute connect address -->
                    </n-td>
                    <n-td v-else />
                    <n-td>
                      <n-spin
                        :show="tunnel.status === -1"
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
                        <n-space>
                          <n-button type="info" secondary>详细信息</n-button>
                          <n-button type="success" secondary>修改</n-button>
                          <n-button type="error" secondary>删除</n-button>
                          <n-button type="warning" secondary>强制下线</n-button>
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
            show-size-picker
            :page-sizes="[10, 25, 50, 100]"
          />
        </n-space>
      </n-spin>
    </n-space>
  </page-content>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";

import { Error } from "@vicons/carbon";
import { Search } from "@vicons/ionicons5";

import { Client as ApiClient } from "@/api/src/client";
import { GetTunnels } from "@/api/src/api/tunnels.get";

definePageMeta({
  title: "隧道管理",
});

const mainStore = useMainStore();
const client = new ApiClient(mainStore.token!);
client.initClient();

const message = useMessage();
const dialog = useDialog();

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

const tunnels = ref<
  {
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
    status: number;
  }[]
>([
  // {
  //   id: 0,
  //   name: "这是一条隧道",
  //   nodeId: 0,
  //   type: "tcp",
  //   status: 0,
  // },
]);

const batchSelectState = ref<boolean>(false);
const batchSelected = ref<number[]>([]);

const page = ref<{
  current: number;
  size: number;
  count: number;
}>({
  current: 1,
  size: 10,
  count: 1,
});

function handleChangeNode() {
  // TODO
}

function handleDelete(tunnelId?: number) {
  // TODO
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
    rs.data.list.forEach((it) => {
      tunnels.value.length = 0;
      tunnels.value.push({
        id: it.id,
        name: it.name,
        type: it.type,
        node: {
          id: it.node_id,
          // TODO
          name: null,
          host: null,
          ip: null,
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
  await await getTunnels();
});
</script>
