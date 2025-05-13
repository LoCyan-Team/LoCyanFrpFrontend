<template>
  <page-content title="ICP 备案白名单">
    <n-space vertical>
      <n-spin :show="loading.submitSection">
        <n-card title="提交验证">
          <n-form :model="formData">
            <n-form-item label="域名" path="domain">
              <n-select
                v-model:value="formData.domain"
                :options="domainOptions"
              />
            </n-form-item>
            <n-space vertical>
              <n-space v-if="domainOptions.length !== 0" justify="center">
                <n-pagination
                  v-model:page="domainPage.current"
                  v-model:page-size="domainPage.size"
                  :page-count="domainPage.count"
                  :on-update:page="
                    (pageSel) => {
                      domainPage.current = pageSel;
                      getDomains();
                    }
                  "
                  :on-update:page-size="
                    (pageSizeSel) => {
                      domainPage.size = pageSizeSel;
                      getDomains();
                    }
                  "
                  show-size-picker
                  :page-sizes="[10, 25, 50, 100]"
                />
              </n-space>
              <n-button type="success" @click="handleSubmit">提交</n-button>
            </n-space>
          </n-form>
        </n-card>
      </n-spin>

      <n-card v-if="batchSelected.length > 0" embedded>
        <n-space>
          <n-button type="error" secondary @click="handleDelete()">
            删除
          </n-button>
        </n-space>
      </n-card>

      <n-spin :show="loading.list">
        <n-empty v-if="data.length === 0" />
        <n-scrollbar v-else x-scrollable>
          <n-table
            style="min-width: 800px"
            :bordered="true"
            :single-line="false"
          >
            <n-thead>
              <n-tr>
                <n-th>
                  <n-switch
                    v-model:value="batchSelectState"
                    :round="false"
                    @update:value="handleSelectAll"
                  >
                    <template #checked>全选</template>
                    <template #unchecked>全选</template>
                  </n-switch>
                </n-th>
                <n-th>域名 ID</n-th>
                <n-th>域名</n-th>
                <n-th>备案号</n-th>
                <n-th>备案主体</n-th>
                <n-th>操作</n-th>
              </n-tr>
            </n-thead>
            <n-tbody>
              <n-tr v-for="domain in data" :key="domain.id">
                <n-td>
                  <n-el @click="handleBatchSelect(domain.id)">
                    <n-checkbox :checked="batchSelected.includes(domain.id)" />
                  </n-el>
                </n-td>
                <n-td>{{ domain.id }}</n-td>
                <n-td>{{ domain.domain }}</n-td>
                <n-td>{{ domain.icp }}</n-td>
                <n-td>{{ domain.unitName }} - {{ domain.natureName }}</n-td>
                <n-td>
                  <!-- TODO: 操作 -->
                </n-td>
              </n-tr>
            </n-tbody>
          </n-table>
        </n-scrollbar>
      </n-spin>
    </n-space>
  </page-content>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";

import type { SelectOption } from "naive-ui";

import { Client as ApiClient } from "@/api/src/client";
import { GetDomains } from "@/api/src/api/domains.get";
import { GetIcp as GetIcpDomains } from "@/api/src/api/domain/icp.get";

const mainStore = useMainStore();
const client = new ApiClient(mainStore.token!);
client.initClient();

const message = useMessage();

definePageMeta({
  title: "ICP 备案白名单",
});

const loading = ref<{
  submitSection: boolean;
  list: boolean;
}>({
  submitSection: true,
  list: true,
});

const formData = ref<{
  domain: string | null;
}>({
  domain: null,
});

const data = ref<
  {
    id: number;
    icp: string;
    domain: string;
    unitName: string;
    natureName: string;
  }[]
>([]);

const domainOptions = ref<Array<SelectOption>>([]);

const domainPage = ref<{
    current: number;
    size: number;
    count: number;
  }>({
    current: 1,
    size: 10,
    count: 1,
  }),
  icpDomainPage = ref<{
    current: number;
    size: number;
    count: number;
  }>({
    current: 1,
    size: 10,
    count: 1,
  });

const batchSelectState = ref<boolean>(false);
const batchSelected = ref<number[]>([]);

function handleSubmit() {
  // TODO
}

function handleDelete(domainId?: number) {
  // TODO
}

function handleBatchSelect(domainId: number) {
  if (batchSelected.value.includes(domainId))
    batchSelected.value = batchSelected.value.filter((id) => id !== domainId);
  else batchSelected.value.push(domainId);
  batchSelectState.value = data.value
    .map((data) => data.id)
    .every((id) => batchSelected.value.includes(id));
}
function handleSelectAll(val: boolean) {
  if (val) data.value.forEach((it) => batchSelected.value.push(it.id));
  else batchSelected.value.length = 0;
}

async function getDomains() {
  loading.value.submitSection = true;
  const rs = await client.execute(
    new GetDomains({
      user_id: mainStore.userId!,
      page: domainPage.value.current,
      size: domainPage.value.size,
    }),
  );
  if (rs.status === 200) {
    domainPage.value.count = rs.data.pagination.count;
    domainOptions.value.length = 0;
    rs.data.list.forEach((it) => {
      domainOptions.value.push({
        label: it.domain,
        value: it.domain,
      });
    });
  } else message.error(rs.message);
  loading.value.submitSection = false;
}

async function getIcpDomains() {
  loading.value.list = true;
  const rs = await client.execute(
    new GetIcpDomains({
      user_id: mainStore.userId!,
      page: domainPage.value.current,
      size: domainPage.value.size,
    }),
  );
  if (rs.status === 200) {
    icpDomainPage.value.count = rs.data.pagination.count;
    data.value.length = 0;
    rs.data.list.forEach((it) => {
      data.value.push({
        id: it.id,
        domain: it.domain,
        icp: it.icp,
        unitName: it.unit_name,
        natureName: it.nature_name,
      });
    });
  } else message.error(rs.message);
  loading.value.list = false;
}

onMounted(async () => {
  await getDomains();
  await getIcpDomains();
});
</script>
