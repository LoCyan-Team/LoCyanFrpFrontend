<template>
  <n-el class="register-box">
    <n-h1>注册</n-h1>
    <n-card title="账户注册">
      <n-form ref="registerFormRef" :model="registerForm" :rules="formRules">
        <n-form-item label="用户名" path="username">
          <n-input
            v-model:value="registerForm.username"
            type="text"
            placeholder="用户名"
          />
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input
            v-model:value="registerForm.email"
            type="text"
            placeholder="邮箱"
          />
        </n-form-item>
        <n-form-item label="邮件验证代码" path="verifyCode">
          <n-input-number
            v-model:value="registerForm.verifyCode"
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
        <n-form-item label="密码" path="password">
          <n-input
            v-model:value="registerForm.password"
            type="password"
            placeholder="密码"
            @keydown.enter="handleRegister"
          />
        </n-form-item>
        <n-form-item label="确认密码" path="confirmPassword">
          <n-input
            v-model:value="registerForm.confirmPassword"
            type="password"
            placeholder="确认密码"
            @keydown.enter="handleRegister"
          />
        </n-form-item>
        <n-el>
          <n-space style="margin-bottom: 1rem">
            <n-button
              ghost
              text
              type="success"
              @click="() => navigateTo('/auth/login')"
            >
              已有账户？去登录
            </n-button>
          </n-space>
          <n-space>
            <n-button
              type="success"
              :loading="loading.register"
              :disabled="loading.register"
              @click="handleRegister"
            >
              注册
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
import FormValidator from "@/utils/formValidator";

import { PostRegister } from "api/src/api/auth/register.post";
import { GetRegister as GetEmailCode } from "api/src/api/email/register.get";
import CaptchaDialog from "@/components/CaptchaDialog.vue";

definePageMeta({
  needLogin: false,
  redirectLoggedIn: true,
});

useHead({
  title: "注册",
});

const message = useMessage();
const notification = useNotification();

const client = useApiClient({
  auth: false,
});

const captchaRef = ref<typeof CaptchaDialog | null>(null);

const registerFormRef = ref<FormInst | null>(null);

// 表单验证规则
const formRules = {
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: ["input", "blur"],
    },
    {
      pattern: FormValidator.regex.username,
      message:
        "用户名长度1-24位，只能包含字母、数字、下划线、中文、日文、韩文和连字符",
      trigger: ["input", "blur"],
    },
  ] as FormItemRule[],
  email: [
    {
      required: true,
      message: "请输入邮箱",
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
      validator: (_, val) => FormValidator.number(val, "请输入验证码"),
      trigger: ["input", "blur"],
    },
  ] as FormItemRule[],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: ["input", "blur"],
    },
  ] as FormItemRule[],
  confirmPassword: [
    {
      required: true,
      message: "请确认密码",
      trigger: ["input", "blur"],
    },
    {
      validator: (_rule: FormItemRule, value: string) => {
        if (value !== registerForm.value.password) {
          return new Error("两次输入的密码不一致");
        }
        return true;
      },
      trigger: ["input", "blur"],
    },
  ] as FormItemRule[],
};

const loading = ref<{
  register: boolean;
  emailCode: boolean;
  captcha: {
    solving: boolean;
  };
}>({
  register: false,
  emailCode: false,
  captcha: {
    solving: false,
  },
});

const registerForm = ref<{
  username: string | null;
  email: string | null;
  verifyCode: number | null;
  password: string | null;
  confirmPassword: string | null;
}>({
  username: null,
  email: null,
  verifyCode: null,
  password: null,
  confirmPassword: null,
});

async function handleEmailCodeSendButton() {
  loading.value.emailCode = true;
  loading.value.captcha.solving = true;
  captchaRef?.value?.solve();
}

async function handleEmailCodeSend(captchaToken: string) {
  loading.value.captcha.solving = false;
  const rs = await client.execute(
    new GetEmailCode({
      email: registerForm.value.email!,
      captcha_token: captchaToken,
    }),
  );
  if (rs.status === 200) {
    notification.success({
      title: "已发送",
      content: "若未收到请检查垃圾箱。",
      duration: 2500,
    });
  } else message.error(rs.message);
  loading.value.emailCode = false;
}

async function handleRegister() {
  if (!registerFormRef.value) return;
  registerFormRef.value.validate().then(async () => {
    loading.value.register = true;
    const rs = await client.execute(
      new PostRegister({
        username: registerForm.value.username!,
        password: registerForm.value.password!,
        email: registerForm.value.email!,
        verify_code: registerForm.value.verifyCode!,
      }),
    );
    if (rs.status === 200) {
      notification.success({
        title: "注册成功",
        content: "注册成功，已为您导航至登录。",
        duration: 2500,
      });
      navigateTo("/auth/login");
    } else message.error(rs.message);
    loading.value.register = false;
  });
}
</script>

<style scoped>
.register-box {
  flex: 1;
  width: 100%;
  margin-inline: auto;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-block: 0.5rem;
}

@media screen and (max-width: 500px) {
  .register-box {
    margin-inline: 0.5rem;
  }
}
</style>
