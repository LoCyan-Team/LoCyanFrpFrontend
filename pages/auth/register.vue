<template>
  <n-el class="register-box">
    <n-h1>注册</n-h1>
    <n-card title="账户注册">
      <n-form>
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
            :vaptcha-scene="3"
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
        <n-form-item label="密码" path="password">
          <n-input
            v-model:value="registerForm.password"
            type="password"
            placeholder="密码"
          />
        </n-form-item>
        <n-form-item label="确认密码" path="confirmPassword">
          <n-input
            v-model:value="registerForm.confirmPassword"
            type="password"
            placeholder="确认密码"
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
import { useMainStore } from "@/store/main";

import { Client as ApiClient } from "@/api/src/client";
import { GetCaptcha } from "@/api/src/api/captcha.get";
import { PostRegister } from "@/api/src/api/auth/register.post";
import { GetRegister as GetEmailCode } from "@/api/src/api/email/register.get";

definePageMeta({
  title: "注册",
  needLogin: false,
  redirectLogined: true,
});

const message = useMessage();
const notification = useNotification();

const mainStore = useMainStore();
const client = new ApiClient(mainStore.token);
client.initClient();

const loading = ref<{
  register: boolean;
  emailCode: boolean;
}>({
  register: false,
  emailCode: false,
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
  const rs = await client.execute(new GetCaptcha({ action: "register" }));
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
  const rs = await client.execute(
    new GetEmailCode({
      email: registerForm.value.email!,
      captcha_id: captcha.value.config.id!,
      captcha_token: token,
      captcha_server: server,
    }),
  );
  if (rs.status === 200) {
    notification.success({
      title: "已发送",
      content: "若未收到请检查垃圾箱。",
    });
  } else message.error(rs.message);
  loading.value.emailCode = false;
}

async function handleRegister() {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    message.error("两次输入的密码不匹配");
    return;
  }

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
}
</script>

<style scoped>
.register-box {
  margin-inline: auto;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
@media screen and (max-width: 500px) {
  .register-box {
    margin-inline: 1rem;
  }
}
</style>
