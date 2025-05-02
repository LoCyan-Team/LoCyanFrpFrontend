<template>
  <page-content title="隧道管理">
    <n-space vertical>
      <n-space>
        <n-input placeholder="搜索项目...">
          <template #prefix>
            <n-icon :component="Search" />
          </template>
        </n-input>
        <n-button type="success">搜索</n-button>
        <n-space justify="end">
          <n-radio-group v-model:value="viewMode" name="viewMode">
            <n-radio-button value="card" label="卡片视图" />
            <n-radio-button value="list" label="列表视图" />
          </n-radio-group>
        </n-space>
      </n-space>

      <n-empty v-if="tunnels.length === 0" />
      <n-el v-else>
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
                  <n-icon :component="Error"></n-icon>
                </template>
                <template #description>已封禁</template>
                <n-card :title="tunnel.name">
                  <!-- TODO: Content -->
                </n-card>
              </n-spin>
            </n-grid-item>
          </n-grid>
        </n-el>
        <n-el v-if="viewMode === 'list'">
          <n-scrollbar x-scrollable>
            <n-table
              style="min-width: 800px"
              :bordered="true"
              :single-line="false"
            >
              <n-thead>
                <n-tr>
                  <n-th>隧道 ID</n-th>
                  <n-th>隧道名</n-th>
                  <n-th>隧道节点</n-th>
                  <n-th>隧道协议</n-th>
                  <n-th>连接地址</n-th>
                  <n-th>操作</n-th>
                </n-tr>
              </n-thead>
              <n-tbody>
                <n-tr v-for="tunnel in tunnels" :key="tunnel.id">
                  <n-td>{{ tunnel.id }}</n-td>
                  <n-td>{{ tunnel.name }}</n-td>

                  <n-td v-if="nodes[tunnel.nodeId]">
                    {{ nodes[tunnel.nodeId].name }}
                  </n-td>
                  <n-td v-else>未知节点</n-td>

                  <n-td>{{ tunnel.type.toUpperCase() }}</n-td>

                  <n-td v-if="nodes[item.nodeId]">
                    <!-- TODO: Compute connect address -->
                  </n-td>
                  <n-td v-else></n-td>

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
                        <n-icon :component="Error"></n-icon>
                      </template>
                      <template #description>已封禁</template>
                      <n-space>
                        <!-- TODO: Content -->
                      </n-space>
                    </n-spin>
                  </n-td>
                </n-tr>
              </n-tbody>
            </n-table>
          </n-scrollbar>
        </n-el>
      </n-el>
      <n-space style="width: 100%" v-if="tunnels.length !== 0" justify="center">
        <n-pagination
          v-model:page="page.current"
          v-model:page-size="page.size"
          :page-count="page.count"
          show-size-picker
          :page-sizes="[10, 25, 50, 100]"
        />
      </n-space>
    </n-space>
  </page-content>
</template>

<script setup lang="ts">
import { Error } from "@vicons/carbon";
import { Search } from "@vicons/ionicons5";

definePageMeta({
  title: "隧道管理",
});

const viewMode = ref<string>("card");

const nodes = ref<[object[]]>([]);
const tunnels = ref<object[]>([]);

const page = ref<{
  current: number;
  size: number;
  count: number;
}>({
  current: 1,
  size: 10,
  count: 1,
});
</script>
