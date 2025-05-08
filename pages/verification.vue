<template>
  <page-content title="身份认证">
    <n-space vertical>
      <n-alert title="说明" type="info">
        请填写您的姓名和身份证证件号码进行身份认证（请确保信息真实准确，认证一旦成功除特殊情况外无法修改）
      </n-alert>
      <n-alert title="请勿冒用他人信息实名" type="warning">
        我们允许未成年人注册，请勿冒用非本人身份证实名，已经实名过得既往不咎！
      </n-alert>
      <n-spin :show="loading.page">
        <n-space vertical>
          <!-- 总览 -->
          <n-card title="认证总览">
            <n-h4>认证说明</n-h4>
            一级认证可使用二级认证及一级认证节点。
            <br />二级认证仅可使用二级认证节点。
            <n-h4>认证状态</n-h4>
            <n-space vertical>
              <n-el>
                一级认证:
                <n-tag v-if="!data.realPerson" type="warning">未通过</n-tag>
                <n-tag v-if="data.realPerson" type="success">已通过</n-tag>
              </n-el>
            </n-space>
            <n-el>
              二级认证:
              <n-tag v-if="!data.realName" type="warning">未通过</n-tag>
              <n-tag v-if="data.realName" type="success">已通过</n-tag>
            </n-el>
          </n-card>

          <!-- 一级认证 -->
          <n-card title="实人认证（一级认证）">
            <n-space vertical>
              <!-- 认证次数 -->
              <n-card title="认证次数" size="small">
                <n-text>剩余认证次数：{{ data.accreditations }}</n-text>
                <n-tabs type="line" default-value="buy" animated>
                  <n-tab-pane name="buy" tab="购买">
                    <n-space>
                      <n-button
                        type="success"
                        :loading="loading.buyAccreditation"
                        :disabled="loading.buyAccreditation"
                        @click="handleBuyRealPersonAccreditation()"
                      >
                        购买
                      </n-button>
                      <n-button
                        type="success"
                        secondary
                        :loading="loading.buyAccreditation"
                        :disabled="loading.buyAccreditation"
                        @click="handleRefreshBuyRealPersonAccreditation()"
                      >
                        刷新状态
                      </n-button>
                    </n-space>
                  </n-tab-pane>
                  <n-tab-pane name="recieve" tab="赠送">
                    <n-form
                      :model="verificationForm"
                      label-width="auto"
                      :size="'large'"
                    >
                      <n-form-item
                        label="目标用户 ID"
                        path="giftAccreditationUserId"
                      >
                        <n-input-number
                          v-model:value="
                            verificationForm.giftAccreditationUserId
                          "
                          placeholder="目标用户 ID"
                        />
                      </n-form-item>
                      <n-button
                        type="success"
                        :loading="loading.giftAccreditation"
                        :disabled="loading.giftAccreditation"
                        @click="handleGiftRealPersonAccreditation()"
                      >
                        赠送
                      </n-button>
                    </n-form>
                  </n-tab-pane>
                </n-tabs>
              </n-card>

              <!-- 认证 -->
              <n-spin :show="data.realPerson" :rotate="false">
                <template #icon>
                  <n-icon>
                    <FileDownloadDoneOutlined />
                  </n-icon>
                </template>
                <template #description> 已完成 </template>
                <n-card title="提交认证" size="small">
                  <n-space vertical>
                    <n-alert title="认证失败重新发起方式" type="error">
                      若认证失败，请先点击
                      <n-tag>重置认证状态</n-tag>
                      重置状态，再重新发起认证！
                    </n-alert>
                    <n-form
                      :model="verificationForm"
                      label-width="auto"
                      :size="'large'"
                    >
                      <n-form-item label="证件类型" path="idType">
                        <n-select
                          v-model:value="verificationForm.idType"
                          :options="options.idType"
                        />
                      </n-form-item>
                      <n-form-item label="姓名" path="name">
                        <n-input
                          v-model:value="verificationForm.name"
                          placeholder="您的姓名"
                        />
                      </n-form-item>
                      <n-form-item label="身份证号" path="idCard">
                        <n-input
                          v-model:value="verificationForm.idCard"
                          placeholder="您的身份证号"
                        />
                      </n-form-item>
                      <n-space>
                        <n-button
                          type="success"
                          :loading="loading.realPerson"
                          :disabled="loading.realPerson"
                          @click="handleRealPersonQrCode()"
                        >
                          提交
                        </n-button>
                        <n-button
                          type="success"
                          secondary
                          :loading="loading.realPerson"
                          :disabled="loading.realPerson"
                          @click="handleRefreshRealPerson()"
                        >
                          刷新状态
                        </n-button>
                        <n-button
                          type="error"
                          secondary
                          :loading="loading.realPerson"
                          :disabled="loading.realPerson"
                          @click="handleResetRealPerson()"
                        >
                          重置认证状态
                        </n-button>
                      </n-space>
                    </n-form>
                  </n-space>
                </n-card>
              </n-spin>
            </n-space>
          </n-card>

          <!-- 二级认证 -->
          <n-card title="二级认证（实名认证）">
            <n-spin :show="data.realName" :rotate="false">
              <template #icon>
                <n-icon>
                  <FileDownloadDoneOutlined />
                </n-icon>
              </template>
              <template #description> 已完成 </template>
              <n-form
                :model="verificationForm"
                label-width="auto"
                :size="'large'"
              >
                <n-form-item label="姓名" path="name">
                  <n-input
                    v-model:value="verificationForm.name"
                    placeholder="您的姓名"
                  />
                </n-form-item>
                <n-form-item label="身份证号" path="idCard">
                  <n-input
                    v-model:value="verificationForm.idCard"
                    placeholder="您的身份证号"
                  />
                </n-form-item>
                <n-button
                  type="success"
                  :loading="loading.realName"
                  :disabled="loading.realName"
                  @click="handleRealName()"
                >
                  提交
                </n-button>
              </n-form>
            </n-spin>
          </n-card>
        </n-space>
      </n-spin>
    </n-space>
    <n-modal
      v-model:show="modal.realPerson.show"
      :mask-closable="false"
      preset="card"
      style="max-width: 600px"
      title="请使用支付宝扫描二维码进行认证"
      :bordered="false"
      content-style="text-align: center;"
      footer-style="text-align: center;"
    >
      <n-qr-code
        :value="modal.realPerson.qrCodeUrl"
        :size="200"
        :error-correction-level="'L'"
      />
      <template #footer>
        <n-button
          type="success"
          :loading="loading.realPerson"
          :disabled="loading.realPerson"
          @click="handleRefreshRealPerson()"
        >
          刷新状态
        </n-button>
      </template>
    </n-modal>
  </page-content>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";

import { FileDownloadDoneOutlined } from "@vicons/material";

import { Client as ApiClient } from "@/api/src/client";
import { GetVerification as GetStatus } from "@/api/src/api/verification.get";
import { PostPayment as PostBuyAccreditation } from "@/api/src/api/verification/real-person/payment.post";
import { PostGiven as PostGivenAccreditation } from "@/api/src/api/verification/real-person/given.post";
import { PostRealPerson } from "@/api/src/api/verification/real-person.post";
import { GetRealPerson } from "@/api/src/api/verification/real-person.get";
import { DeleteRealPerson } from "@/api/src/api/verification/real-person.delete";
import { PostRealName } from "@/api/src/api/verification/real-name.post";

definePageMeta({
  title: "身份认证",
});

const mainStore = useMainStore();
const client = new ApiClient(mainStore.token!);
client.initClient();

const message = useMessage();
const dialog = useDialog();

const loading = ref<{
  page: boolean;
  realName: boolean;
  realPerson: boolean;
  buyAccreditation: boolean;
  giftAccreditation: boolean;
}>({
  page: true,
  realName: false,
  realPerson: false,
  buyAccreditation: false,
  giftAccreditation: false,
});

const data = ref<{
  realName: boolean;
  realPerson: boolean;
  accreditations: number;
}>({
  realName: false,
  realPerson: false,
  accreditations: 0,
});

const modal = ref<{
  realPerson: {
    show: boolean;
    qrCodeUrl: string | null;
  };
}>({
  realPerson: {
    show: false,
    qrCodeUrl: null,
  },
});

const verificationForm = ref<{
  name: string | null;
  idCard: string | null;
  idType: string;
  giftAccreditationUserId: number | null;
}>({
  name: null,
  idCard: null,
  idType: "IDENTITY_CARD",
  giftAccreditationUserId: null,
});

const options = {
  idType: [
    {
      label: "中国大陆身份证",
      value: "IDENTITY_CARD",
    },
    {
      label: "港澳居民来往内地通行证",
      value: "HOME_VISIT_PERMIT_HK_MC",
    },
    {
      label: "台湾居民来往内地通行证",
      value: "HOME_VISIT_PERMIT_TAIWAN",
    },
    {
      label: "港澳居民居住证",
      value: "RESIDENCE_PERMIT_HK_MC",
    },
    {
      label: "台湾居民居住证",
      value: "RESIDENCE_PERMIT_TAIWAN",
    },
  ],
};

async function handleBuyRealPersonAccreditation() {
  loading.value.buyAccreditation = true;
  const rs = await client.execute(
    new PostBuyAccreditation({
      user_id: mainStore.userId!,
    }),
  );
  if (rs.status === 200) {
    window.open(rs.data.url);
  } else message.error(rs.message);
  loading.value.buyAccreditation = false;
}

async function handleRefreshBuyRealPersonAccreditation() {
  loading.value.buyAccreditation = true;
  await getStatus();
  loading.value.buyAccreditation = false;
}

async function handleGiftRealPersonAccreditation() {
  if (verificationForm.value.giftAccreditationUserId === null)
    return message.error("请提供赠与目标用户的 ID");
  loading.value.giftAccreditation = true;
  dialog.warning({
    title: "确认",
    content: `请确认您要赠送的目标用户 ID: ${verificationForm.value.giftAccreditationUserId}，一旦赠出无法撤销。`,
    positiveText: "确定",
    negativeText: "再考虑一下",
    onPositiveClick: async () => {
      const rs = await client.execute(
        new PostGivenAccreditation({
          user_id: mainStore.userId!,
          give_user_id: verificationForm.value.giftAccreditationUserId!,
        }),
      );
      if (rs.status === 200) {
        data.value.accreditations--;
        message.success("赠送成功");
      } else message.error(rs.message);
    },
    onNegativeClick: () => {},
  });
  loading.value.giftAccreditation = false;
}

async function handleRealPersonQrCode() {
  loading.value.realPerson = true;
  const rs = await client.execute(
    new PostRealPerson({
      user_id: mainStore.userId!,
      name: verificationForm.value.name!,
      id_card: verificationForm.value.idCard!,
      id_type: verificationForm.value.idType,
    }),
  );
  if (rs.status === 200) {
    modal.value.realPerson.qrCodeUrl = rs.data.url;
    modal.value.realPerson.show = true;

    async function query(timer: NodeJS.Timeout) {
      await handleRefreshRealPerson();
      if (data.value.realPerson) clearTimeout(timer);
    }

    const timer = setTimeout(() => query(timer), 1000);
  } else message.error(rs.message);
  loading.value.realPerson = false;
}

async function handleRefreshRealPerson() {
  loading.value.realPerson = true;
  const rs = await client.execute(
    new GetRealPerson({
      user_id: mainStore.userId!,
    }),
  );
  if (rs.status === 200) {
    data.value.realPerson = true;
    data.value.accreditations--;
    dialog.success({
      title: "认证成功",
      content: "一级认证成功。",
    });
  } else if (rs.status !== 403) message.error(rs.message);
  loading.value.realPerson = false;
}

async function handleResetRealPerson() {
  loading.value.realPerson = true;
  const rs = await client.execute(
    new DeleteRealPerson({
      user_id: mainStore.userId!,
    }),
  );
  if (rs.status === 200) message.success("重置成功");
  else message.error(rs.message);
  loading.value.realPerson = false;
}

async function handleRealName() {
  loading.value.realName = true;
  const rs = await client.execute(
    new PostRealName({
      user_id: mainStore.userId!,
      name: verificationForm.value.name!,
      id_card: verificationForm.value.idCard!,
    }),
  );
  if (rs.status === 200) {
    data.value.realName = true;
    dialog.success({
      title: "认证成功",
      content: "二级认证成功。",
    });
  } else message.error(rs.message);
  loading.value.realName = false;
}

async function getStatus() {
  const resStatus = await client.execute(
    new GetStatus({
      user_id: mainStore.userId!,
    }),
  );
  if (resStatus.status === 200) {
    data.value.realName = resStatus.data.real_name;
    data.value.realPerson = resStatus.data.real_person;
    data.value.accreditations = resStatus.data.limit.real_person_accreditations;
  } else message.error(resStatus.message);
}

onMounted(async () => {
  await getStatus();

  loading.value.page = false;
});
</script>

<style scoped></style>
