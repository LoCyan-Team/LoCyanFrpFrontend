<template>
  <page-content title="ICP 备案白名单">
    <n-space vertical>
      <n-spin :show="loading.submitSection">
        <n-card title="提交验证">
          <n-form :model="formData">
            <n-form-item label="域名" path="domain">
              <n-select
                v-model:value="formData.domainId"
                :options="domainOptions"
                filterable
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
              <n-button
                type="success"
                :loading="loading.submit"
                :disabled="loading.submit"
                @click="handleSubmit"
              >
                提交
              </n-button>
            </n-space>
          </n-form>
        </n-card>
      </n-spin>

      <n-card v-if="batchSelected.length > 0" embedded>
        <n-space>
          <n-popconfirm @positive-click="handleBatchDeleteIcp">
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

      <n-spin :show="loading.list">
        <n-space vertical>
          <n-card v-if="data.length === 0">
            <n-empty />
          </n-card>
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
                  <n-th>记录 ID</n-th>
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
                      <n-checkbox
                        :checked="batchSelected.includes(domain.id)"
                      />
                    </n-el>
                  </n-td>
                  <n-td>{{ domain.id }}</n-td>
                  <n-td>{{ domain.domain }}</n-td>
                  <n-td>{{ domain.icp }}</n-td>
                  <n-td>{{ domain.natureName }} - {{ domain.unitName }}</n-td>
                  <n-td>
                    <n-popconfirm @positive-click="handleDeleteIcp(domain.id)">
                      <template #trigger>
                        <n-button
                          type="error"
                          secondary
                          :loading="loading.icp.delete.includes(domain.id)"
                          :disabled="loading.icp.delete.includes(domain.id)"
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
          <n-space v-if="data.length !== 0" justify="center">
            <n-pagination
              v-model:page="icpDomainPage.current"
              v-model:page-size="icpDomainPage.size"
              :page-count="icpDomainPage.count"
              :on-update:page="
                (pageSel) => {
                  icpDomainPage.current = pageSel;
                  getIcpDomains();
                }
              "
              :on-update:page-size="
                (pageSizeSel) => {
                  icpDomainPage.size = pageSizeSel;
                  getIcpDomains();
                }
              "
              show-size-picker
              :page-sizes="[10, 25, 50, 100]"
            />
          </n-space>
        </n-space>
      </n-spin>
    </n-space>
    <n-modal v-model:show="modal.miitCaptchaMarker.show">
      <n-card
        style="width: 600px"
        title="请点选验证码"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-spin :show="loading.miitCaptcha">
          <n-space vertical>
            <miit-captcha-marker
              :small-image-src="miit.image.smallBase64!"
              :big-image-src="miit.image.bigBase64!"
              :max-markers="4"
              @update:markers="handleMiitImageMarkerUpdate"
            />
            <n-button
              type="success"
              :loading="loading.submit"
              :disabled="loading.submit"
              @click="handleSubmit"
            >
              刷新验证码
            </n-button>
          </n-space>
        </n-spin>
      </n-card>
    </n-modal>
  </page-content>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";

import type { SelectOption } from "naive-ui";

import { GetDomains, type GetDomainsResponse } from "api/src/api/domains.get";
import {
  GetIcp as GetIcpDomains,
  type GetIcpResponse as GetIcpDomainsResponse,
} from "api/src/api/domain/icp.get";
import {
  GetImage as GetMiitCaptchaImage,
  type GetImageResponse as GetMiitCaptchaImageResponse,
} from "api/src/api/domain/icp/miit/image.get";
import {
  PostSign as PostMiitCaptchaSign,
  type PostSignResponse as PostMiitCaptchaSignResponse,
} from "api/src/api/domain/icp/miit/sign.post";
import { PutIcp, type PutIcpResponse } from "api/src/api/domain/icp.put";
import { DeleteIcp } from "api/src/api/domain/icp.delete";
import { DeleteBatch as DeleteIcpBatch } from "api/src/api/domain/icp/batch.delete";

const mainStore = useMainStore();
const client = useApiClient();

const message = useMessage();
const dialog = useDialog();

useHead({
  title: "ICP 备案白名单",
});

const loading = ref<{
  submitSection: boolean;
  submit: boolean;
  list: boolean;
  miitCaptcha: boolean;
  batch: {
    delete: boolean;
  };
  icp: {
    delete: number[];
  };
}>({
  submitSection: true,
  submit: false,
  list: true,
  miitCaptcha: false,
  batch: {
    delete: false,
  },
  icp: {
    delete: [],
  },
});

const formData = ref<{
  domainId: number | null;
}>({
  domainId: null,
});

const modal = ref<{
  miitCaptchaMarker: {
    show: boolean;
  };
}>({
  miitCaptchaMarker: {
    show: false,
  },
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

interface MIIT {
  clientUid: string | null;
  token: {
    uuid: string | null;
    token: string | null;
  };
  secretKey: string | null;
  image: {
    bigBase64: string | null;
    smallBase64: string | null;
  };
  sign: string | null;
}

const miit = ref<MIIT>({
  clientUid: null,
  token: {
    uuid: null,
    token: null,
  },
  secretKey: null,
  image: {
    bigBase64: null,
    smallBase64: null,
  },
  sign: null,
});

let markerData: {
  origin: object | null;
  string: string | null;
} = {
  origin: null,
  string: null,
};

const domainOptions = ref<SelectOption[]>([]);

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

async function handleSubmit() {
  loading.value.submit = true;
  loading.value.miitCaptcha = true;
  const rs = await client.execute<GetMiitCaptchaImageResponse>(
    new GetMiitCaptchaImage({
      user_id: mainStore.userId!,
      domain_id: formData.value.domainId!,
    }),
  );
  if (rs.status === 200) {
    miit.value = {
      clientUid: rs.data.client_uid,
      token: {
        uuid: rs.data.token.uuid,
        token: rs.data.token.token,
      },
      secretKey: rs.data.secret_key,
      image: {
        bigBase64: rs.data.image.big_base64,
        smallBase64: rs.data.image.small_base64,
      },
      sign: null,
    };
    modal.value.miitCaptchaMarker.show = true;
  } else message.error(rs.message);
  loading.value.submit = false;
  loading.value.miitCaptcha = false;
}

async function handleMiitImageMarkerUpdate(point: object) {
  markerData.origin = point;
  markerData.string = JSON.stringify(point);
  await getMiitCaptchaSign();
}

async function getMiitCaptchaSign() {
  loading.value.miitCaptcha = true;
  const rs = await client.execute<PostMiitCaptchaSignResponse>(
    new PostMiitCaptchaSign({
      user_id: mainStore.userId!,
      client_uid: miit.value.clientUid!,
      secret_key: miit.value.secretKey!,
      token: miit.value.token.token!,
      token_uuid: miit.value.token.uuid!,
      point_json: markerData.string!,
    }),
  );
  if (rs.status === 200) {
    miit.value.sign = rs.data.sign;
    await handleAdd();
  } else message.error(rs.message);
  loading.value.miitCaptcha = false;
}

async function handleAdd() {
  const rs = await client.execute<PutIcpResponse>(
    new PutIcp({
      user_id: mainStore.userId!,
      domain_id: formData.value.domainId!,
      miit_sign: miit.value.sign!,
      miit_token: miit.value.token.token!,
      miit_token_uuid: miit.value.token.uuid!,
    }),
  );
  if (rs.status === 200) {
    modal.value.miitCaptchaMarker.show = false;
    data.value.push({
      id: rs.data.id,
      icp: rs.data.icp,
      domain: domainOptions.value.find(
        (it) => it.value === formData.value.domainId,
      )!.label as string,
      unitName: rs.data.unit_name,
      natureName: rs.data.nature_name,
    });
    dialog.success({
      title: "添加成功",
      content: "已成功校验 ICP 备案。",
    });
  } else message.error(rs.message);
}

async function handleDeleteIcp(icpId: number) {
  loading.value.icp.delete.push(icpId);
  const rs = await client.execute(
    new DeleteIcp({
      user_id: mainStore.userId!,
      icp_id: icpId!,
    }),
  );
  if (rs.status === 200) {
    data.value = data.value.filter((it) => it.id !== icpId);
  } else message.error(rs.message);
  loading.value.icp.delete = loading.value.icp.delete.filter(
    (id) => id !== icpId,
  );
}

async function handleBatchDeleteIcp() {
  loading.value.batch.delete = true;
  const selected = batchSelected.value;

  const rs = await client.execute(
    new DeleteIcpBatch({
      user_id: mainStore.userId!,
      icp_ids: selected,
    }),
  );
  if (rs.status === 200) {
    data.value = data.value.filter((it) => !selected.includes(it.id));
  } else message.error(rs.message);
  loading.value.batch.delete = false;
  batchSelected.value.length = 0;
  batchSelectState.value = false;
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
  const rs = await client.execute<GetDomainsResponse>(
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
        value: it.id,
      });
    });
  } else message.error(rs.message);
  loading.value.submitSection = false;
}

async function getIcpDomains() {
  loading.value.list = true;
  const rs = await client.execute<GetIcpDomainsResponse>(
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
