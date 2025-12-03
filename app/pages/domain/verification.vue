<template>
  <page-content title="所有权验证">
    <n-space vertical>
      <n-card title="提交验证">
        <n-form :model="formData">
          <n-form-item label="域名" path="domain">
            <n-input v-model:value="formData.domain" placeholder="请输入域名" />
          </n-form-item>
          <n-button
            type="success"
            :loading="loading.submit"
            :disabled="loading.submit"
            @click="handleSubmitDomain"
          >
            提交
          </n-button>
        </n-form>
      </n-card>

      <n-tabs type="line" default-value="verified" animated>
        <n-tab-pane name="verified" tab="已认证域名">
          <n-spin :show="loading.list.domain">
            <n-space vertical>
              <n-card v-if="domainBatchSelected.length > 0" embedded>
                <n-space>
                  <n-popconfirm @positive-click="handleBatchDeleteDomain">
                    <template #trigger>
                      <n-button
                        type="error"
                        secondary
                        :loading="loading.batch.delete"
                        :disabled="loading.batch.delete"
                      >
                        删除
                      </n-button>
                    </template>
                    确定要删除这些域名吗？此操作无法撤销。
                  </n-popconfirm>
                </n-space>
              </n-card>
              <n-empty v-if="domainData.length === 0" />
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
                        <n-popconfirm
                          @positive-click="handleDeleteDomain(domain.id)"
                        >
                          <template #trigger>
                            <n-button
                              type="error"
                              secondary
                              :loading="
                                loading.domain.delete.includes(domain.id)
                              "
                              :disabled="
                                loading.domain.delete.includes(domain.id)
                              "
                            >
                              删除
                            </n-button>
                          </template>
                          确定要删除此域名吗？此操作无法撤销。
                        </n-popconfirm>
                      </n-td>
                    </n-tr>
                  </n-tbody>
                </n-table>
              </n-scrollbar>
              <n-space v-if="domainData.length !== 0" justify="center">
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
            </n-space>
          </n-spin>
        </n-tab-pane>

        <n-tab-pane name="submitted" tab="认证中域名">
          <n-spin :show="loading.list.verification">
            <n-space vertical>
              <n-alert type="warning">
                24 小时未验证的域名将自动过期删除。
              </n-alert>
              <n-empty v-if="verificationData.length === 0" />
              <n-scrollbar v-else x-scrollable>
                <n-table
                  style="min-width: 800px"
                  :bordered="true"
                  :single-line="false"
                >
                  <n-thead>
                    <n-tr>
                      <n-th>域名</n-th>
                      <n-th>DNS 记录类型</n-th>
                      <n-th>DNS 记录内容</n-th>
                      <n-th>操作</n-th>
                    </n-tr>
                  </n-thead>
                  <n-tbody>
                    <n-tr
                      v-for="verification in verificationData"
                      :key="verification.domain"
                    >
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
                          @click="handleSubmitVerification(verification.domain)"
                        >
                          验证
                        </n-button>
                      </n-td>
                    </n-tr>
                  </n-tbody>
                </n-table>
              </n-scrollbar>
              <n-space v-if="verificationData.length !== 0" justify="center">
                <n-pagination
                  v-model:page="verificationPage.current"
                  v-model:page-size="verificationPage.size"
                  :page-count="verificationPage.count"
                  :on-update:page="
                    (pageSel) => {
                      verificationPage.current = pageSel;
                      getVerifications();
                    }
                  "
                  :on-update:page-size="
                    (pageSizeSel) => {
                      verificationPage.size = pageSizeSel;
                      getVerifications();
                    }
                  "
                  show-size-picker
                  :page-sizes="[10, 25, 50, 100]"
                />
              </n-space>
            </n-space>
          </n-spin>
        </n-tab-pane>
      </n-tabs>
    </n-space>
    <n-modal v-model:show="modal.verification.show">
      <n-card
        style="width: 600px"
        title="验证域名"
        :bordered="false"
        size="huge"
        aria-modal="true"
      >
        <n-el>
          <n-text>请在您的域名 DNS 服务商添加以下 DNS 记录：</n-text>
          <br />
          <n-text>
            记录类型：
            <n-code :code="modal.verification.record.type" />
            记录名称：
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button
                  text
                  @click="$copyToClipboard(`_lcf-verify.${formData.domain}.`)"
                >
                  <n-code :code="`_lcf-verify.${formData.domain}.`" />
                </n-button>
              </template>
              点击复制
            </n-tooltip>
            <br />
            记录内容：
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button
                  text
                  @click="$copyToClipboard(modal.verification.record.data)"
                >
                  <n-code :code="modal.verification.record.data" />
                </n-button>
              </template>
              点击复制
            </n-tooltip>
          </n-text>
        </n-el>
        <template #footer>
          <n-button
            type="success"
            @click="handleSubmitVerification(formData.domain!)"
          >
            验证
          </n-button>
        </template>
      </n-card>
    </n-modal>
  </page-content>
</template>
<script setup lang="ts">
import { useMainStore } from "@/store/main";

import { GetDomains, type GetDomainsResponse } from "api/src/api/domains.get";
import {
  GetVerifications,
  type GetVerificationsResponse,
} from "api/src/api/domain/verifications.get";
import {
  PutDns as PutDnsVerification,
  type PutDnsResponse as PutDnsVerificationResponse,
} from "api/src/api/domain/verification/dns.put";
import { PostDns as PostDnsVerification } from "api/src/api/domain/verification/dns.post";
import { DeleteDomain } from "api/src/api/domain.delete";
import { DeleteBatch as DeleteDomainBatch } from "api/src/api/domain/batch.delete";

const mainStore = useMainStore();
const client = useApiClient();

const message = useMessage();
const notification = useNotification();

useHead({
  title: "所有权验证",
});

const loading = ref<{
  submit: boolean;
  list: {
    domain: boolean;
    verification: boolean;
  };
  batch: {
    delete: boolean;
  };
  domain: {
    delete: number[];
  };
}>({
  submit: false,
  list: {
    domain: true,
    verification: true,
  },
  batch: {
    delete: false,
  },
  domain: {
    delete: [],
  },
});

const modal = ref<{
  verification: {
    show: boolean;
    record: {
      type: string;
      data: string;
    };
  };
}>({
  verification: {
    show: false,
    record: {
      type: "",
      data: "",
    },
  },
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
  >([]),
  verificationData = ref<
    {
      domain: string;
      recordType: string;
      recordData: string;
    }[]
  >([]);

const domainPage = ref<{
    current: number;
    size: number;
    count: number;
  }>({
    current: 1,
    size: 10,
    count: 1,
  }),
  verificationPage = ref<{
    current: number;
    size: number;
    count: number;
  }>({
    current: 1,
    size: 10,
    count: 1,
  });

const domainBatchSelectState = ref<boolean>(false);
const domainBatchSelected = ref<number[]>([]);

async function handleSubmitDomain() {
  loading.value.submit = true;
  const rs = await client.execute<PutDnsVerificationResponse>(
    new PutDnsVerification({
      user_id: mainStore.userId!,
      domain: formData.value.domain!,
    }),
  );
  if (rs.status === 200) {
    modal.value.verification.record = {
      type: rs.data.record_type,
      data: rs.data.record_data,
    };
    modal.value.verification.show = true;
    verificationData.value.push({
      domain: formData.value.domain!,
      recordType: rs.data.record_type,
      recordData: rs.data.record_data,
    });
  } else message.error(rs.message);
  loading.value.submit = false;
}

async function handleDeleteDomain(domainId: number) {
  loading.value.domain.delete.push(domainId);
  const rs = await client.execute(
    new DeleteDomain({
      user_id: mainStore.userId!,
      domain_id: domainId,
    }),
  );
  if (rs.status === 200) {
    domainData.value = domainData.value.filter((it) => it.id !== domainId);
  } else message.error(rs.message);
  loading.value.domain.delete = loading.value.domain.delete.filter(
    (id) => id !== domainId,
  );
}

async function handleBatchDeleteDomain() {
  loading.value.batch.delete = true;
  const rs = await client.execute(
    new DeleteDomainBatch({
      user_id: mainStore.userId!,
      domain_ids: domainBatchSelected.value,
    }),
  );
  if (rs.status === 200) {
    domainData.value = domainData.value.filter(
      (it) => !domainBatchSelected.value.includes(it.id),
    );
  } else message.error(rs.message);
  loading.value.batch.delete = false;
  domainBatchSelected.value.length = 0;
  domainBatchSelectState.value = false;
}

async function handleSubmitVerification(domain: string) {
  const rs = await client.execute(
    new PostDnsVerification({
      user_id: mainStore.userId!,
      domain: domain,
    }),
  );
  if (rs.status === 200) {
    modal.value.verification.show = false;
    notification.success({
      title: "验证成功",
      content: "域名已通过 DNS 验证。",
      duration: 2500,
    });
  } else message.error(rs.message);
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

async function getDomains() {
  loading.value.list.domain = true;
  const rs = await client.execute<GetDomainsResponse>(
    new GetDomains({
      user_id: mainStore.userId!,
      page: domainPage.value.current,
      size: domainPage.value.size,
    }),
  );
  if (rs.status === 200) {
    domainPage.value.count = rs.data.pagination.count;
    domainData.value.length = 0;
    rs.data.list.forEach((it) => {
      domainData.value.push({
        id: it.id,
        domain: it.domain,
        icpId: it.icp_id,
      });
    });
  } else message.error(rs.message);
  loading.value.list.domain = false;
}
async function getVerifications() {
  loading.value.list.verification = true;
  const rs = await client.execute<GetVerificationsResponse>(
    new GetVerifications({
      user_id: mainStore.userId!,
      page: verificationPage.value.current,
      size: verificationPage.value.size,
    }),
  );
  if (rs.status === 200) {
    verificationPage.value.count = rs.data.pagination.count;
    verificationData.value.length = 0;
    rs.data.list.forEach((it) => {
      verificationData.value.push({
        domain: it.domain,
        recordType: it.record_type,
        recordData: it.record_data,
      });
    });
  } else message.error(rs.message);
  loading.value.list.verification = false;
}

onMounted(async () => {
  await getDomains();
  await getVerifications();
});
</script>
