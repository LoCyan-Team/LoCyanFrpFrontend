<template>
  <n-el class="auth-box">
    <n-h1>重置密码</n-h1>
    <n-card title="修改密码">
      <n-form
        ref="resetPasswordFormRef"
        :model="resetPasswordForm"
        :rules="formRules"
      >
        <n-form-item label="用户名 / 邮箱" path="user">
          <n-input
            v-model:value="resetPasswordForm.user"
            type="text"
            placeholder="用户名"
            @keydown.enter="handleResetPassword"
          />
        </n-form-item>
        <n-form-item label="邮件验证代码" path="verifyCode">
          <n-input-number
            v-model:value="resetPasswordForm.verifyCode"
            placeholder="邮件验证代码"
            clearable
            style="width: 100%; margin-right: 1rem"
          />
          <captcha-dialog
            ref="captchaRef"
            @unsupported="
              message.error(
                '您的浏览器不支持加载验证码，请更换或升级浏览器后重试',
              )
            "
            @error="
              (e) => {
                loading.captcha.solving = false;
                message.error(e);
                loading.emailCode = false;
              }
            "
            @callback="handleEmailCodeSend"
          />
          <n-tooltip :show="loading.captcha.solving" trigger="manual">
            <template #trigger>
              <n-button
                v-umami="'click-button-auth-reset-password-email-code-send'"
                type="success"
                secondary
                :loading="loading.emailCode"
                :disabled="loading.emailCode"
                @click="handleEmailCodeSendButton"
              >
                获取验证码
              </n-button>
            </template>
            <n-spin class="captcha-solving" :size="14" />
            验证中...
          </n-tooltip>
        </n-form-item>
        <n-form-item label="新密码" path="password">
          <n-input
            v-model:value="resetPasswordForm.password"
            type="password"
            placeholder="新密码"
            @keydown.enter="handleResetPassword"
          />
        </n-form-item>
        <n-el>
          <n-space style="margin-bottom: 1rem">
            <n-button
              v-umami="'click-button-auth-reset-password-redirect-login'"
              ghost
              text
              type="success"
              @click="() => navigateTo('/auth/login')"
            >
              想起密码了？去登录
            </n-button>
          </n-space>
          <n-space>
            <n-button
              v-umami="'click-button-auth-reset-password-reset'"
              type="success"
              :loading="loading.reset"
              :disabled="loading.reset"
              @click="handleResetPassword"
            >
              重置
            </n-button>
          </n-space>
        </n-el>
      </n-form>
    </n-card>
  </n-el>
</template>

<script setup lang="ts">
import "~/assets/css/auth.css";

import type { FormInst, FormItemRule } from "naive-ui";
import {
  GetPassword as GetEmailCode,
  type GetPasswordResponse as GetEmailCodeResponse,
} from "api/src/api/email/password.get";
import { PutPassword } from "api/src/api/user/password.put";
import CaptchaDialog from "@/components/CaptchaDialog.vue";
import FormValidator from "~/utils/formValidator";

definePageMeta({
  needLogin: false,
  redirectLoggedIn: true,
});

useHead({
  title: "重置密码",
});

const message = useMessage();
const notification = useNotification();

const client = useApiClient({
  auth: false,
});

const captchaRef = ref<typeof CaptchaDialog | null>(null);

const resetPasswordFormRef = ref<FormInst | null>(null);

const formRules = {
  user: [
    {
      required: true,
      message: "请输入用户名或邮箱",
      trigger: ["input", "blur"],
    },
  ] as FormItemRule[],
  verifyCode: [
    {
      required: true,
      validator: (_, val) => FormValidator.number(val, "请输入验证码"),
      trigger: ["input", "blur"],
    },
  ] as FormItemRule[],
  password: [
    {
      required: true,
      message: "请输入新密码",
      trigger: ["input", "blur"],
    },
    {
      min: 6,
      message: "密码长度至少6位",
      trigger: ["input", "blur"],
    },
  ] as FormItemRule[],
};

const loading = ref<{
  reset: boolean;
  emailCode: boolean;
  captcha: {
    solving: boolean;
  };
}>({
  reset: false,
  emailCode: false,
  captcha: {
    solving: false,
  },
});

const resetPasswordForm = ref<{
  user: string | null;
  verifyCode: number | null;
  password: string | null;
}>({
  user: null,
  verifyCode: null,
  password: null,
});

const data: {
  userId: number | null;
} = {
  userId: null,
};

async function handleEmailCodeSendButton() {
  loading.value.emailCode = true;
  loading.value.captcha.solving = true;
  captchaRef?.value?.solve();
}

async function handleEmailCodeSend(captchaToken: string) {
  loading.value.captcha.solving = false;
  const rs = await client.execute<GetEmailCodeResponse>(
    new GetEmailCode({
      user: resetPasswordForm.value.user!,
      captcha_token: captchaToken,
    }),
  );
  if (rs.status === 200) {
    data.userId = rs.data.user_id;
    notification.success({
      title: "已发送",
      content: "若未收到请检查垃圾箱。",
      duration: 2500,
    });
  } else message.error(rs.message);
  loading.value.emailCode = false;
}

function handleResetPassword() {
  if (!resetPasswordFormRef.value) return;
  resetPasswordFormRef.value.validate().then(async () => {
    loading.value.reset = true;
    const rs = await client.execute(
      new PutPassword({
        user_id: data.userId!,
        new_password: resetPasswordForm.value.password!,
        verify_code: resetPasswordForm.value.verifyCode!,
      }),
    );
    if (rs.status === 200) {
      notification.success({
        title: "重置密码成功",
        content: "重置密码成功，已为您导航至登录。",
        duration: 2500,
      });
      navigateTo("/auth/login");
    } else message.error(rs.message);
    loading.value.reset = false;
  });
}
</script>
