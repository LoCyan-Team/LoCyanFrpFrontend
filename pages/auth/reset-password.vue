<template>
  <n-el class="reset-box">
    <n-h1>重置密码</n-h1>
    <n-card title="修改密码">
      <n-form ref="resetPasswordFormRef" :model="resetPasswordForm" :rules="formRules">
        <n-form-item label="用户名 / 邮箱" path="user">
          <n-input
            v-model:value="resetPasswordForm.user"
            type="text"
            placeholder="用户名"
          />
        </n-form-item>
        <n-form-item label="邮件验证代码" path="verifyCode">
          <n-input-number
            v-model:value="resetPasswordForm.verifyCode"
            placeholder="邮件验证代码"
            clearable
            style="width: 100%; margin-right: 1rem"
          />
          <n-button
            type="success"
            secondary
            :loading="loading.emailCode"
            :disabled="loading.emailCode"
            @click="loadCaptcha"
          >
            获取验证码
          </n-button>
          <captcha-dialog
            :show="captcha.show"
            :type="captcha.config.type"
            :vaptcha-scene="4"
            @error="
              (code: unknown) => {
                message.error('发生错误: ' + code);
                captcha.show = false;
              }
            "
            @unsupported="
              message.error(
                '您的浏览器不支持加载验证码，请更换或升级浏览器后重试',
              )
            "
            @callback="handleEmailCodeSend"
          />
        </n-form-item>
        <n-form-item label="新密码" path="password">
          <n-input
            v-model:value="resetPasswordForm.password"
            type="password"
            placeholder="新密码"
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
              想起密码了？去登录
            </n-button>
          </n-space>
          <n-space>
            <n-button
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
import type { FormInst, FormItemRule } from "naive-ui";
import { GetCaptcha, type GetCaptchaResponse } from "@/api/src/api/captcha.get";
import {
  GetPassword as GetEmailCode,
  type GetPasswordResponse as GetEmailCodeResponse,
} from "@/api/src/api/email/password.get";
import { PutPassword } from "@/api/src/api/user/password.put";

definePageMeta({
  needLogin: false,
  redirectLogined: true,
});

useHead({
  title: "重置密码",
});

const message = useMessage();
const notification = useNotification();

const client = useApiClient({
  auth: false,
});

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
      validator: (_rule: FormItemRule, value: number | null) => {
        if (value === null || value === undefined) {
          return new Error("请输入验证码");
        }
        return true;
      },
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
}>({
  reset: false,
  emailCode: false,
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

const captcha = ref<{
  show: boolean;
  config: {
    id: string | null;
    type: string | null;
  };
}>({
  show: false,
  config: {
    id: null,
    type: null,
  },
});

async function loadCaptcha() {
  loading.value.emailCode = true;
  const rs = await client.execute<GetCaptchaResponse>(
    new GetCaptcha({ action: "reset-password" }),
  );
  if (rs.status === 200) {
    captcha.value.config.id = rs.data.id;
    captcha.value.config.type = rs.data.type;
    captcha.value.show = true;
  } else message.error(rs.message);
  loading.value.emailCode = false;
}

async function handleEmailCodeSend(token: string, server?: string) {
  captcha.value.show = false;
  loading.value.emailCode = true;
  const rs = await client.execute<GetEmailCodeResponse>(
    new GetEmailCode({
      user: resetPasswordForm.value.user!,
      captcha_id: captcha.value.config.id!,
      captcha_token: token,
      captcha_server: server,
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

async function handleResetPassword() {
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
}
</script>

<style scoped>
.reset-box {
  margin-inline: auto;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-block: 0.5rem;
}
@media screen and (max-width: 500px) {
  .reset-box {
    margin-inline: 0, 5rem;
  }
}
</style>
