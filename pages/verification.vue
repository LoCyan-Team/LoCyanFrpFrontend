<template>
  <page-content title="身份认证">
    <n-space vertical>
      <n-alert title="说明" type="info">
        请填写您的姓名和身份证证件号码进行身份认证（请确保信息真实准确，认证一旦成功除特殊情况外无法修改）
      </n-alert>
      <n-alert title="请勿冒用他人信息实名" type="warning">
        我们允许未成年人注册，请勿冒用非本人身份证实名，已经实名过得既往不咎！
      </n-alert>
      <n-spin :show="loading">
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
                        @click="handleBuyRealPersonAccreditation()"
                      >
                        购买
                      </n-button>
                      <n-button
                        type="success"
                        secondary
                        @click="handleRefreshBuyRealPersonAccreditation()"
                      >
                        刷新付款状态
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
                        <n-input
                          v-model:value="
                            verificationForm.giftAccreditationUserId
                          "
                          placeholder="目标用户 ID"
                        />
                      </n-form-item>
                      <n-button
                        type="success"
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
                      <n-tag>重置验认状态</n-tag>
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
                          @click="handleRealPersonQrCode()"
                          >提交</n-button
                        >
                        <n-button
                          type="success"
                          secondary
                          @click="handleRefreshRealPerson()"
                        >
                          刷新状态
                        </n-button>
                        <n-button
                          type="error"
                          secondary
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
                <n-button type="success" @click="handleRealName()"
                  >提交</n-button
                >
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
      title="请使用支付宝扫描二维码"
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
        <n-button type="success" @click="handleRefreshRealPerson()"
          >刷新状态</n-button
        >
      </template>
    </n-modal>
  </page-content>
</template>

<script setup lang="ts">
import { FileDownloadDoneOutlined } from "@vicons/material";

definePageMeta({
  title: "身份认证",
});

const loading = ref(true);

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

function handleBuyRealPersonAccreditation() {
  // TODO
}

function handleRefreshBuyRealPersonAccreditation() {
  // TODO
}

function handleGiftRealPersonAccreditation() {
  // TODO
}

function handleRealPersonQrCode() {
  // TODO
}

function handleRefreshRealPerson() {
  // TODO
}
function handleResetRealPerson() {
  // TODO
}

function handleRealName() {
  // TODO
}

onMounted(() => {
  loading.value = false;
});
</script>

<style scoped></style>
