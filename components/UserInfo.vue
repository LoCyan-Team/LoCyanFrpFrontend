<template>
  <n-space vertical>
    <n-card>
      <n-el style="text-align: center">
        <n-avatar round :size="80" :src="userStore.avatar + '?s=480'" />
        <br />
        <n-text style="font-size: 20px">
          {{ userStore.username }}
          <n-tag type="info">ID: {{ mainStore.userId }}</n-tag>
        </n-text>
        <br />
        <n-text style="color: gray"
          >本站使用 WeAvatar 公用头像库 API ，可以前往
          <n-a target="_blank" href="https://weavatar.com/">WeAvatar</n-a> 或
          <n-a target="_blank" href="https://gravatar.com/">Gravatar</n-a>
          修改您的头像
        </n-text>
      </n-el>
      <n-divider />
      <n-el>
        <n-h3>账户信息</n-h3>
        <n-text>邮箱: {{ userStore.email }}</n-text>
        <br />
        <n-text>
          <n-space align="center">
            <n-text>访问密钥:</n-text>
            <n-tooltip trigger="click">
              <template #trigger>
                <n-button type="success" size="small" secondary>
                  点击显示
                </n-button>
              </template>
              <n-scrollbar x-scrollable>
                <n-code :code="userStore.frpToken!" />
              </n-scrollbar>
            </n-tooltip>
            <n-button
              type="info"
              size="small"
              secondary
              @click="$copyToClipboard(userStore.frpToken!)"
            >
              点击复制
            </n-button>
          </n-space>
        </n-text>
        <n-h3>第三方账户绑定</n-h3>
        <n-el class="three-side-buttons" style="width: min-content">
          <n-tooltip>
            <template #trigger>
              <n-spin :show="loading.thirdParty.qq">
                <n-button
                  :type="data.thirdParty.qq.bond ? 'info' : 'tertiary'"
                  circle
                  @click="handleThirdPartyButton(ThirdParty.QQ)"
                >
                  <n-icon><Qq /></n-icon>
                </n-button>
              </n-spin>
            </template>
            <n-el v-if="data.thirdParty.qq.bond">已绑定</n-el>
            <n-el v-else>未绑定</n-el>
          </n-tooltip>
        </n-el>
        <n-divider />
        <n-space>
          <n-button type="error" secondary @click="handleResetFrpToken"
            >重置访问密钥</n-button
          >
          <n-button type="error" secondary @click="handleExitAllDevices"
            >吊销全部登录设备</n-button
          >
        </n-space>
      </n-el>
    </n-card>
    <n-card title="修改信息">
      <n-tabs type="line" default-value="username" animated>
        <!-- 用户名 -->
        <n-tab-pane name="username" tab="修改用户名">
          <n-space vertical>
            <n-alert type="info" title="注意">
              修改后，账户登录信息也会随之改变。
            </n-alert>
            <n-form :model="updateUsernameForm">
              <n-form-item label="新用户名" path="username">
                <n-input
                  v-model:value="updateUsernameForm.username"
                  placeholder="请输入新用户名"
                />
              </n-form-item>
              <n-button
                :loading="loading.updateUsername"
                :disabled="loading.updateUsername"
                type="success"
                @click="handleUpdateUsername"
              >
                提交
              </n-button>
            </n-form>
          </n-space>
        </n-tab-pane>

        <!-- 密码 -->
        <n-tab-pane name="password" tab="修改密码">
          <n-space vertical>
            <n-alert type="info" title="注意">
              修改后，账户登录信息也会随之改变。
            </n-alert>
            <n-form :model="updatePasswordForm">
              <n-form-item label="原密码" path="oldPassword">
                <n-input
                  v-model:value="updatePasswordForm.oldPassword"
                  type="password"
                  placeholder="请输入旧密码"
                />
              </n-form-item>
              <n-form-item label="新密码" path="newPassword">
                <n-input
                  v-model:value="updatePasswordForm.newPassword"
                  type="password"
                  placeholder="请输入新密码"
                />
              </n-form-item>
              <n-form-item label="确认密码" path="confirmPassword">
                <n-input
                  v-model:value="updatePasswordForm.confirmPassword"
                  type="password"
                  placeholder="请重复新密码"
                />
              </n-form-item>
              <n-button
                :loading="loading.updatePassword"
                :disabled="loading.updatePassword"
                type="success"
                @click="handleUpdatePassword"
              >
                提交
              </n-button>
            </n-form>
          </n-space>
        </n-tab-pane>

        <!-- 邮箱 -->
        <n-tab-pane name="email" tab="修改邮箱">
          <n-space vertical>
            <n-alert type="info" title="注意">
              修改后，账户登录信息也会随之改变。
            </n-alert>
            <n-form :model="updateEmailForm">
              <n-form-item label="新邮箱" path="email">
                <n-input
                  v-model:value="updateEmailForm.email"
                  placeholder="请输入新邮箱"
                />
              </n-form-item>
              <n-form-item label="邮件验证码" path="verifyCode">
                <n-input-number
                  v-model:value="updateEmailForm.verifyCode"
                  placeholder="请输入验证码"
                />
                <n-button
                  style="margin-left: 0.5rem"
                  :loading="loading.updateEmail.emailCode"
                  :disabled="loading.updateEmail.emailCode"
                  type="success"
                  secondary
                  @click="handleGetUpdateEmailCode"
                >
                  发送验证码
                </n-button>
              </n-form-item>
              <n-button
                :loading="loading.updateEmail.submit"
                :disabled="loading.updateEmail.submit"
                type="success"
                @click="handleUpdateEmail"
              >
                提交
              </n-button>
            </n-form>
          </n-space>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </n-space>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";
import { useUserStore } from "@/store/user";

import { Qq } from "@vicons/fa";

const mainStore = useMainStore();
const userStore = useUserStore();

const loading = ref<{
  thirdParty: {
    qq: boolean;
  };
  updateUsername: boolean;
  updatePassword: boolean;
  updateEmail: {
    emailCode: boolean;
    submit: boolean;
  };
}>({
  thirdParty: {
    qq: true,
  },
  updateUsername: false,
  updatePassword: false,
  updateEmail: {
    emailCode: false,
    submit: false,
  },
});

const data = ref<{
  thirdParty: {
    qq: {
      bond: boolean;
    };
  };
}>({
  thirdParty: {
    qq: {
      bond: false,
    },
  },
});

const updateUsernameForm = ref<{
    username: string | null;
  }>({
    username: null,
  }),
  updatePasswordForm = ref<{
    oldPassword: string | null;
    newPassword: string | null;
    confirmPassword: string | null;
  }>({
    oldPassword: null,
    newPassword: null,
    confirmPassword: null,
  }),
  updateEmailForm = ref<{
    email: string | null;
    verifyCode: number | null;
  }>({
    email: null,
    verifyCode: null,
  });

enum ThirdParty {
  QQ,
}

function handleThirdPartyButton(type: ThirdParty) {
  // TODO
}

function handleResetFrpToken() {
  // TODO
}

function handleExitAllDevices() {
  // TODO
}

function handleUpdateUsername() {
  // TODO
}

function handleUpdatePassword() {
  // TODO
}

function handleGetUpdateEmailCode() {
  // TODO
}

function handleUpdateEmail() {
  // TODO
}
</script>
