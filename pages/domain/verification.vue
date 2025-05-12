<template>
  <page-content title="所有权验证">
    <n-space vertical>
      <n-card title="提交验证">
        <n-form :model="formData">
          <n-form-item label="域名" path="domain">
            <n-input v-model:value="formData.domain" placeholder="请输入域名" />
          </n-form-item>
          <n-button type="success" @click="handleSubmitDomain">提交</n-button>
        </n-form>
      </n-card>

      <n-card>
        <n-scrollbar x-scrollable>
          <n-tabs type="line" animated>
            <n-tab-pane name="verified" tab="已认证域名">
              <n-space vertical>
                <n-card v-if="domainBatchSelected.length > 0" embedded>
                  <n-space>
                    <n-button
                      type="error"
                      secondary
                      @click="handleDeleteDomain()"
                    >
                      删除
                    </n-button>
                  </n-space>
                </n-card>
                <n-empty v-if="domainData.length === 0" />
                <n-table
                  v-else
                  style="min-width: 800px"
                  :bordered="true"
                  :single-line="false"
                >
                  <n-thead>
                    <n-tr>
                      <n-th>
                        <n-switch
                          v-model:value="domainBatchSelectState"
                          :round="false"
                          @update:value="handleDomainSelectAll"
                        >
                          <template #checked>全选</template>
                          <template #unchecked>全选</template>
                        </n-switch>
                      </n-th>
                      <n-th>域名 ID</n-th>
                      <n-th>域名</n-th>
                      <n-th>操作</n-th>
                    </n-tr>
                  </n-thead>
                  <n-tbody>
                    <n-tr v-for="domain in domainData" :key="domain.id">
                      <n-td>
                        <n-el @click="handleDomainBatchSelect(domain.id)">
                          <n-checkbox
                            :checked="domainBatchSelected.includes(domain.id)"
                          />
                        </n-el>
                      </n-td>
                      <n-td>{{ domain.id }}</n-td>
                      <n-td>{{ domain.domain }}</n-td>
                      <n-td>
                        <n-button
                          type="error"
                          secondary
                          @click="handleDeleteDomain(domain.id)"
                        >
                          删除
                        </n-button>
                        <!-- TODO: 操作 -->
                      </n-td>
                    </n-tr>
                  </n-tbody>
                </n-table>
              </n-space>
            </n-tab-pane>

            <n-tab-pane name="submited" tab="认证中域名">
              <n-empty v-if="verificationData.length === 0" />
              <n-table
                v-else
                style="min-width: 800px"
                :bordered="true"
                :single-line="false"
              >
                <n-thead>
                  <n-tr>
                    <n-th>验证 ID</n-th>
                    <n-th>域名</n-th>
                    <n-th>DNS 记录类型</n-th>
                    <n-th>DNS 记录内容</n-th>
                    <n-th>操作</n-th>
                  </n-tr>
                </n-thead>
                <n-tbody>
                  <n-tr
                    v-for="verification in verificationData"
                    :key="verification.id"
                  >
                    <n-td>{{ verification.id }}</n-td>
                    <n-td>{{ verification.domain }}</n-td>
                    <n-td>{{ verification.recordType }}</n-td>
                    <n-td>
                      <n-tooltip trigger="hover">
                        <template #trigger>
                          <n-button
                            text
                            @click="$copyToClipboard(verification.recordData)"
                          >
                            <n-code :code="verification.recordData" />
                          </n-button>
                        </template>
                        点击复制
                      </n-tooltip>
                    </n-td>
                    <n-td>
                      <n-button
                        type="info"
                        secondary
                        @click="handleSubmitVerification(verification.id)"
                      >
                        验证
                      </n-button>
                      <!-- TODO: 操作 -->
                    </n-td>
                  </n-tr>
                </n-tbody>
              </n-table>
            </n-tab-pane>
          </n-tabs>
        </n-scrollbar>
      </n-card>
    </n-space>
  </page-content>
</template>
<script setup lang="ts">
definePageMeta({
  title: "所有权验证",
});

const formData = ref<{
  domain: string | null;
}>({
  domain: null,
});

const domainData = ref<
    {
      id: number;
      domain: string;
      icpId: number | null;
    }[]
  >([
    // {
    //   id: 1,
    //   domain: "example.com",
    //   icpId: null,
    // },
  ]),
  verificationData = ref<
    {
      id: string;
      domain: string;
      recordType: string;
      recordData: string;
    }[]
  >([
    // {
    //   id: "1141353121245",
    //   domain: "example.com",
    //   recordType: "TXT",
    //   recordData: "3f2q255b55yggw5heag3wh5qw3f35",
    // },
  ]);

const domainBatchSelectState = ref<boolean>(false);
const domainBatchSelected = ref<number[]>([]);

function handleSubmitDomain() {
  // TODO
}

function handleDeleteDomain(domainId?: number) {
  // TODO
}

function handleSubmitVerification(verificationId: string) {
  // TODO
}

function handleDomainBatchSelect(domainId: number) {
  if (domainBatchSelected.value.includes(domainId))
    domainBatchSelected.value = domainBatchSelected.value.filter(
      (id) => id !== domainId,
    );
  else domainBatchSelected.value.push(domainId);
  domainBatchSelectState.value = domainData.value
    .map((data) => data.id)
    .every((id) => domainBatchSelected.value.includes(id));
}
function handleDomainSelectAll(val: boolean) {
  if (val)
    domainData.value.forEach((it) => domainBatchSelected.value.push(it.id));
  else domainBatchSelected.value.length = 0;
}
</script>
