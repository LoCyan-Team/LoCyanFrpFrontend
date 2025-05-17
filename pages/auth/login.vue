<template>
  <n-el class="login-box">
    <n-h1>登录</n-h1>
    <n-card title="账户登录">
      <n-form>
        <n-form-item label="用户名 / 邮箱" path="user">
          <n-input
            v-model:value="loginForm.user"
            type="text"
            placeholder="用户名"
          />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input
            v-model:value="loginForm.password"
            type="password"
            placeholder="密码"
          />
        </n-form-item>
        <n-el>
          <n-space style="margin-bottom: 1rem">
            <n-button
              ghost
              text
              type="success"
              @click="() => navigateTo('/auth/register')"
            >
              没有账户？去注册
            </n-button>
          </n-space>
          <n-space>
            <n-button
              type="success"
              :loading="loading.login"
              :disabled="loading.login"
              @click="loadCaptcha"
            >
              登录
            </n-button>
            <captcha-dialog
              :show="captcha.show"
              :type="captcha.config.type"
              :vaptcha-scene="2"
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
              @callback="handleLogin"
            />
          </n-space>
        </n-el>
      </n-form>
    </n-card>
    <br />
    <n-spin :show="loading.passkey" style="width: 100%">
      <n-button
        type="success"
        secondary
        style="width: 100%"
        @click="handlePasskeyLogin"
      >
        通行密钥登录
      </n-button>
    </n-spin>
    <br />
    <n-card title="第三方登录">
      <n-space>
        <n-spin :show="loading.threeSide">
          <n-button
            type="info"
            circle
            @click="handleThirdPartyLogin(ThirdParty.QQ)"
          >
            <n-icon>
              <Qq />
            </n-icon>
          </n-button>
        </n-spin>
      </n-space>
    </n-card>
  </n-el>
</template>

<script setup lang="ts">
import { Qq } from "@vicons/fa";

import { useMainStore } from "@/store/main";
import { useUserStore } from "@/store/user";

import { Client as ApiClient } from "@/api/src/client";
import { GetCaptcha } from "@/api/src/api/captcha.get";
import { PostLogin } from "@/api/src/api/auth/login.post";
import { PostPasskeyLogin } from "~/api/src/api/auth/login-passkey.post";

import type { GetCaptchaData } from "@/api/src/api/captcha.get";
import type { PostLoginData } from "@/api/src/api/auth/login.post";
import type { PostPasskeyLoginData } from "@/api/src/api/auth/login-passkey.post";
import { GetQQLogin } from "~/api/src/api/auth/third-party/qq/login.get";
definePageMeta({
  title: "登录",
  needLogin: false,
  redirectLogined: true,
});

const message = useMessage();
const notification = useNotification();

const mainStore = useMainStore();
const userStore = useUserStore();
const client = new ApiClient();
client.initClient();

const loading = ref<{
  login: boolean;
  threeSide: boolean;
  passkey: boolean;
}>({
  login: false,
  threeSide: false,
  passkey: false,
});

const loginForm = ref<{
  user: string | null;
  password: string | null;
}>({
  user: null,
  password: null,
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
  loading.value.login = true;
  const rs = await client.execute<GetCaptchaData>(
    new GetCaptcha({ action: "login" }),
  );
  if (rs.status === 200) {
    captcha.value.config.id = rs.data.id;
    captcha.value.config.type = rs.data.type;
    captcha.value.show = true;
  } else message.error(rs.message);
  loading.value.login = false;
}

async function handleLogin(token: string, server?: string) {
  captcha.value.show = false;
  loading.value.login = true;
  const rs = await client.execute<PostLoginData>(
    new PostLogin({
      user: loginForm.value.user!,
      password: loginForm.value.password!,
      captcha_id: captcha.value.config.id!,
      captcha_token: token,
      captcha_server: server,
    }),
  );
  if (rs.status === 200) {
    mainStore.token = rs.data.token;
    mainStore.userId = rs.data.user_id;
    userStore.frpToken = rs.data.frp_token;
    userStore.username = rs.data.user_info.username;
    userStore.email = rs.data.user_info.email;
    userStore.group = rs.data.user_info.group;
    userStore.limit = rs.data.user_info.limit;
    userStore.traffic = rs.data.user_info.traffic;
    userStore.avatar = rs.data.user_info.avatar;
    userStore.registerTime = rs.data.user_info.register_time;

    notification.success({
      title: "登录成功",
      content: "欢迎回来，指挥官 " + rs.data.user_info.username + "！",
      duration: 2500,
    });
    navigateTo("/dashboard");
  } else message.error(rs.message);
  loading.value.login = false;
}

async function handlePasskeyLogin() {
  // TODO
  loading.value.passkey = true;
  const rs = await client.execute<PostPasskeyLoginData>(
    new PostPasskeyLogin({ credential: "" }),
  );
  if (rs.status === 200) {
    mainStore.token = rs.data.token;
    mainStore.userId = rs.data.user_id;
    userStore.frpToken = rs.data.frp_token;
    userStore.username = rs.data.user_info.username;
    userStore.email = rs.data.user_info.email;
    userStore.group = rs.data.user_info.group;
    userStore.limit = rs.data.user_info.limit;
    userStore.traffic = rs.data.user_info.traffic;
    userStore.avatar = rs.data.user_info.avatar;
    userStore.registerTime = rs.data.user_info.register_time;

    notification.success({
      title: "登录成功",
      content: "欢迎回来，指挥官 " + rs.data.user_info.username + "！",
      duration: 2500,
    });
    navigateTo("/dashboard");
  } else message.error(rs.message);
  loading.value.login = false;
}

async function handleThirdPartyLogin(type: ThirdParty) {
  // TODO
  loading.value.threeSide = true;
  if (type === ThirdParty.QQ) {
    const getQQLoginRes = await client.execute(new GetQQLogin());
    if (getQQLoginRes.status === 200) {
      const QQURL = getQQLoginRes.data.url;
      window.location.href = QQURL;
    } else {
      // 处理获取QQ登录URL失败的情况，例如显示错误消息
      console.error("获取QQ登录URL失败", getQQLoginRes.status);
      loading.value.threeSide = false;
    }
  }
}

enum ThirdParty {
  QQ,
}
</script>

<style scoped>
.login-box {
  margin-inline: auto;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-block: 0.5rem;
}

@media screen and (max-width: 500px) {
  .login-box {
    margin-inline: 0.5rem;
  }
}
</style>
