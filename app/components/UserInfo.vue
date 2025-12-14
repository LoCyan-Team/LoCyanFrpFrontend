<template>
  <n-space vertical>
    <n-card>
      <n-el style="text-align: center">
        <client-only>
          <n-avatar round :size="80" :src="userStore.avatar + '?s=480'" />
        </client-only>
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
        <n-el class="three-side-buttons">
          <n-spin :show="loading.thirdParty" style="width: min-content">
            <n-tooltip placement="bottom">
              <template #trigger>
                <n-el v-if="!data.thirdParty.bind.qq">
                  <n-button
                    type="tertiary"
                    circle
                    @click="handleThirdPartyButton(ThirdParty.QQ)"
                  >
                    <client-only>
                      <n-icon><Qq /></n-icon>
                    </client-only>
                  </n-button>
                </n-el>
                <n-el v-else>
                  <n-popconfirm
                    @positive-click="handleThirdPartyButton(ThirdParty.QQ)"
                  >
                    <template #trigger>
                      <n-button type="info" circle>
                        <client-only>
                          <n-icon><Qq /></n-icon>
                        </client-only>
                      </n-button>
                    </template>
                    正在解除绑定，请确认。
                  </n-popconfirm>
                </n-el>
              </template>
              <n-el v-if="data.thirdParty.bind.qq">已绑定，点击解绑</n-el>
              <n-el v-else>未绑定，点击绑定</n-el>
            </n-tooltip>
          </n-spin>
        </n-el>
        <n-divider />
        <n-space>
          <n-popconfirm @positive-click="handleResetFrpToken">
            <template #trigger>
              <n-button
                type="error"
                secondary
                :loading="loading.resetFrpToken"
                :disabled="loading.resetFrpToken"
              >
                重置访问密钥
              </n-button>
            </template>
            此操作不可撤销，请确认。
          </n-popconfirm>
          <n-popconfirm @positive-click="handleExitAllDevices">
            <template #trigger>
              <n-button
                type="error"
                secondary
                :loading="loading.exitAllDevices"
                :disabled="loading.exitAllDevices"
              >
                吊销全部登录设备
              </n-button>
            </template>
            确定要吊销全部登录设备吗？这将从所有设备登出。
          </n-popconfirm>
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
            <n-form
              ref="updatePasswordFormRef"
              :model="updatePasswordForm"
              :rules="updatePasswordRules"
            >
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
            <n-form
              ref="updateEmailFormRef"
              :model="updateEmailForm"
              :rules="updateEmailRules"
            >
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
                  @click="handleGetUpdateEmailCodeSend"
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
import type { FormInst, FormItemRule } from "naive-ui";
import { useMainStore } from "@/store/main";
import { useUserStore } from "@/store/user";

import Qq from "@vicons/fa/Qq";

import {
  GetThirdParty as GetThirdPartyBind,
  type GetThirdPartyResponse as GetThirdPartyBindResponse,
} from "api/src/api/user/third-party.get";

import {
  GetBind as GetQqBind,
  type GetBindResponse as GetQqBindResponse,
} from "api/src/api/user/third-party/qq/bind.get";
import { DeleteBind as DeleteQqBind } from "api/src/api/user/third-party/qq/bind.delete";
import {
  PostToken as PostResetFrpToken,
  type PostTokenResponse as PostResetFrpTokenResponse,
} from "api/src/api/user/frp/token.post";
import { DeleteAll as DeleteAllToken } from "api/src/api/user/token/all.delete";
import { PutUsername } from "api/src/api/user/username.put";
import { PutPassword } from "api/src/api/user/password.put";
import { GetEmail as GetUpdateEmailCode } from "api/src/api/email/email.get";
import { PutEmail } from "api/src/api/user/email.put";
import FormValidator from "@/utils/formValidator";

const emit = defineEmits<{
  (e: "logout"): void;
}>();

const mainStore = useMainStore();
const userStore = useUserStore();
const client = useApiClient();

const message = useMessage();
const dialog = useDialog();
const notification = useNotification();

const loading = ref<{
  thirdParty: boolean;
  resetFrpToken: boolean;
  exitAllDevices: boolean;
  updateUsername: boolean;
  updatePassword: boolean;
  updateEmail: {
    emailCode: boolean;
    submit: boolean;
  };
}>({
  thirdParty: true,
  resetFrpToken: false,
  exitAllDevices: false,
  updateUsername: false,
  updatePassword: false,
  updateEmail: {
    emailCode: false,
    submit: false,
  },
});

const data = ref<{
  thirdParty: {
    bind: {
      qq: boolean;
    };
  };
}>({
  thirdParty: {
    bind: {
      qq: false,
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

const updatePasswordFormRef = ref<FormInst | null>(null);
const updateEmailFormRef = ref<FormInst | null>(null);

const updatePasswordRules = {
  oldPassword: [
    {
      required: true,
      message: "请输入原密码",
      trigger: ["input", "blur"],
    },
  ] as FormItemRule[],
  newPassword: [
    {
      required: true,
      message: "请输入新密码",
      trigger: ["input", "blur"],
    },
  ] as FormItemRule[],
  confirmPassword: [
    {
      required: true,
      message: "请确认新密码",
      trigger: ["input", "blur"],
    },
    {
      validator: (_: unknown, value: string) => {
        if (value !== updatePasswordForm.value.newPassword) {
          return new Error("两次输入的密码不一致");
        }
        return true;
      },
      trigger: ["input", "blur"],
    },
  ] as FormItemRule[],
};

const updateEmailRules = {
  email: [
    {
      required: true,
      message: "请输入邮箱地址",
      trigger: ["input", "blur"],
    },
    {
      pattern: FormValidator.regex.email,
      message: "请输入有效的邮箱地址",
      trigger: ["input", "blur"],
    },
  ] as FormItemRule[],
  verifyCode: [
    {
      required: true,
      validator: (_: unknown, value: number) =>
        FormValidator.number(value, "请输入验证码"),
      trigger: ["input", "blur"],
    },
  ] as FormItemRule[],
};

enum ThirdParty {
  QQ,
}

async function handleThirdPartyButton(type: ThirdParty) {
  switch (type) {
    case ThirdParty.QQ:
      await handleQqButton();
      break;
  }

  async function handleQqButton() {
    if (!data.value.thirdParty.bind.qq) {
      const rs = await client.execute<GetQqBindResponse>(
        new GetQqBind({
          user_id: mainStore.userId!,
        }),
      );
      if (rs.status === 200) {
        window.open(rs.data.url);
      } else message.error(rs.message);
    } else {
      const rs = await client.execute(
        new DeleteQqBind({
          user_id: mainStore.userId!,
        }),
      );
      if (rs.status === 200) {
        data.value.thirdParty.bind.qq = false;
        dialog.success({
          title: "解除绑定成功",
          content: "已解除与此第三方服务的绑定。",
        });
      } else message.error(rs.message);
    }
  }
}

async function handleResetFrpToken() {
  loading.value.resetFrpToken = true;
  const rs = await client.execute<PostResetFrpTokenResponse>(
    new PostResetFrpToken({
      user_id: mainStore.userId!,
    }),
  );
  if (rs.status === 200) {
    userStore.$patch({
      frpToken: rs.data.frp_token,
    });
    dialog.success({
      title: "重置成功",
      content: "已重置访问密钥，如您有自定义配置文件，需手动更新。",
    });
  } else message.error(rs.message);
  loading.value.resetFrpToken = false;
}

async function handleExitAllDevices() {
  loading.value.exitAllDevices = true;
  const rs = await client.execute(
    new DeleteAllToken({
      user_id: mainStore.userId!,
    }),
  );
  if (rs.status === 200) {
    emit("logout");
  } else message.error(rs.message);
  loading.value.exitAllDevices = false;
}

async function handleUpdateUsername() {
  loading.value.updateUsername = true;
  const rs = await client.execute(
    new PutUsername({
      user_id: mainStore.userId!,
      new_username: updateUsernameForm.value.username!,
    }),
  );
  if (rs.status === 200) {
    dialog.success({
      title: "更新成功",
      content: "已更新用户名。",
    });
  } else message.error(rs.message);
  loading.value.updateUsername = false;
}

async function handleUpdatePassword() {
  if (!updatePasswordFormRef.value) return;
  updatePasswordFormRef.value.validate().then(async () => {
    loading.value.updatePassword = true;
    const rs = await client.execute(
      new PutPassword({
        user_id: mainStore.userId!,
        old_password: updatePasswordForm.value.oldPassword!,
        new_password: updatePasswordForm.value.newPassword!,
      }),
    );
    if (rs.status === 200) {
      dialog.success({
        title: "更新成功",
        content: "已更新账户密码。",
      });
    } else message.error(rs.message);
    loading.value.updatePassword = false;
  });
}

async function handleGetUpdateEmailCodeSend() {
  loading.value.updateEmail.emailCode = true;
  const rs = await client.execute(
    new GetUpdateEmailCode({
      user_id: mainStore.userId!,
      email: updateEmailForm.value.email!,
    }),
  );
  if (rs.status === 200) {
    notification.success({
      title: "已发送",
      content: "若未收到请检查垃圾箱。",
      duration: 2500,
    });
  } else message.error(rs.message);
  loading.value.updateEmail.emailCode = false;
}

async function handleUpdateEmail() {
  if (!updateEmailFormRef.value) return;
  updateEmailFormRef.value.validate().then(async () => {
    loading.value.updateEmail.submit = true;
    const rs = await client.execute(
      new PutEmail({
        user_id: mainStore.userId!,
        verify_code: updateEmailForm.value.verifyCode!,
      }),
    );
    if (rs.status === 200) {
      dialog.success({
        title: "更新成功",
        content: "已更新账户邮箱。",
      });
    } else message.error(rs.message);
    loading.value.updateEmail.submit = false;
  });
}

async function fetchThirdPartyData() {
  const rs = await client.execute<GetThirdPartyBindResponse>(
    new GetThirdPartyBind({
      user_id: mainStore.userId!,
    }),
  );
  if (rs.status === 200) {
    data.value.thirdParty.bind = {
      qq: rs.data.qq,
    };
    loading.value.thirdParty = false;
  } else message.error(rs.message);
}

onMounted(async () => {
  await fetchThirdPartyData();
});
</script>
