<template>
  <page-content title="ICP 备案白名单">
    <n-space vertical>
      <n-card title="提交验证">
        <n-form :model="formData">
          <n-form-item label="域名" path="domain">
            <n-input
              v-model:value="formData.domain"
              placeholder="请输入备案域名"
            />
          </n-form-item>
          <n-button type="success" @click="handleSubmit">提交</n-button>
        </n-form>
      </n-card>

      <n-card v-if="batchSelected.length > 0" embedded>
        <n-space>
          <n-button type="error" secondary @click="handleDelete()">
            删除
          </n-button>
        </n-space>
      </n-card>

      <n-empty v-if="data.length === 0" />
      <n-scrollbar v-else x-scrollable>
        <n-table style="min-width: 800px" :bordered="true" :single-line="false">
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
              <n-th>备案主体</n-th>
              <n-th>备案号</n-th>
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
              <n-td>{{ domain.unit }}</n-td>
              <n-td>{{ domain.icp }}</n-td>
              <n-td>
                <!-- TODO: 操作 -->
              </n-td>
            </n-tr>
          </n-tbody>
        </n-table>
      </n-scrollbar>
    </n-space>
  </page-content>
</template>

<script setup lang="ts">
definePageMeta({
  title: "ICP 备案白名单",
});

const formData = ref<{
  domain: string | null;
}>({
  domain: null,
});

const data = ref<
  {
    id: number;
    domain: string;
    unit: string;
    icp: string;
  }[]
>([]);

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
</script>
