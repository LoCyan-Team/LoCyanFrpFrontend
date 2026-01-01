<template>
  <n-el class="auth-box">
    <n-h1>登录</n-h1>
    <n-card title="账户登录">
      <n-form ref="loginFormRef" :model="loginForm" :rules="formRules">
        <n-form-item label="用户名 / 邮箱" path="user">
          <n-input
            v-model:value="loginForm.user"
            type="text"
            placeholder="用户名或邮箱"
          />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input
            v-model:value="loginForm.password"
            type="password"
            placeholder="密码"
            @keydown.enter="handleLoginButton"
          />
        </n-form-item>
        <n-el>
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
                loading.login = false;
              }
            "
            @callback="handleLogin"
          />
          <n-space style="margin-bottom: 1rem">
            <n-button
              v-umami="'click-button-auth-login-redirect-register'"
              ghost
              text
              type="success"
              @click="navigateTo('/auth/register')"
            >
              没有账户？去注册
            </n-button>
          </n-space>
          <n-space>
            <n-tooltip :show="loading.captcha.solving" trigger="manual">
              <template #trigger>
                <n-button
                  v-umami="'click-button-auth-login-login'"
                  type="success"
                  :loading="loading.login"
                  :disabled="loading.login"
                  @click="handleLoginButton"
                >
                  登录
                </n-button>
              </template>
              <n-spin class="captcha-solving" :size="14" />
              验证中...
            </n-tooltip>
          </n-space>
        </n-el>
      </n-form>
    </n-card>
    <n-el style="margin-block: 1rem; width: 100%">
      <n-button
        v-umami="'click-button-auth-login-passkey-login'"
        type="success"
        secondary
        style="width: 100%"
        :loading="loading.passkey"
        :disabled="loading.passkey"
        @click="handlePasskeyLogin"
      >
        通行密钥登录
      </n-button>
    </n-el>
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
    <n-modal
      v-model:show="showTotpModal"
      title="双因素身份验证"
      preset="card"
      :bordered="false"
      :mask-closable="false"
      style="width: auto"
    >
      <n-spin :show="loading.totp" style="margin-inline: 2rem">
        <n-form ref="totpFormRef" :model="totpForm" :rules="totpFormRules">
          <n-form-item label="TOTP 验证代码" path="code">
            <n-input-otp
              v-model:value="totpForm.code"
              :allow-input="(value: string) => !value || /^\d+$/.test(value)"
              @finish="handleTotpInputFinish"
            />
          </n-form-item>
        </n-form>
      </n-spin>
    </n-modal>
  </n-el>
</template>

<script setup lang="ts">
import "~/assets/css/auth.css";

import Qq from "@vicons/fa/Qq";
import type { FormInst, FormItemRule } from "naive-ui";

import { useMainStore } from "@/store/main";
import { useUserStore } from "@/store/user";

import {
  PostLogin,
  type PostLoginResponse,
} from "@locyanfrp-dashboard-frontend/api/src/auth/login.post";
import {
  PostLogin as PostPasskeyLogin,
  type PostLoginResponse as PostPasskeyLoginResponse,
} from "@locyanfrp-dashboard-frontend/api/src/auth/webauthn/passkey/login.post";
import {
  GetLogin as GetQqLogin,
  type GetLoginResponse as GetQqLoginResponse,
} from "@locyanfrp-dashboard-frontend/api/src/auth/third-party/qq/login.get";
import CaptchaDialog from "@/components/CaptchaDialog.vue";
import FormValidator from "~/utils/formValidator";

definePageMeta({
  needLogin: false,
  redirectLoggedIn: true,
});

useHead({
  title: "登录",
});

const message = useMessage();
const notification = useNotification();

const mainStore = useMainStore();
const userStore = useUserStore();
const client = useApiClient({ auth: false });

const route = useRoute();

const captchaRef = ref<typeof CaptchaDialog | null>(null);

const loginFormRef = ref<FormInst | null>(null),
  totpFormRef = ref<FormInst | null>(null);

// 表单验证规则
const formRules = {
  user: [
    {
      required: true,
      message: "请输入用户名或邮箱",
      trigger: ["input", "blur"],
    },
  ] as FormItemRule[],
  password: [
    {
      required: true,
      message: "请输入密码",
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
    login: boolean;
    threeSide: boolean;
    passkey: boolean;
    captcha: {
      solving: boolean;
    };
    totp: boolean;
  }>({
    login: false,
    threeSide: false,
    passkey: false,
    captcha: {
      solving: false,
    },
    totp: false,
  }),
  totpFormRules = {
    code: [
      {
        required: true,
        validator: (_: unknown, value: number) =>
          FormValidator.number(value, "请输入验证代码"),
        trigger: ["input", "blur"],
      },
    ] as FormItemRule[],
  };

const loginForm = ref<{
    user: string | null;
    password: string | null;
  }>({
    user: null,
    password: null,
  }),
  totpForm = ref<{
    code: string[] | null;
  }>({
    code: null,
  });

const showTotpModal = ref(false);

async function handleLoginButton() {
  if (!loginFormRef.value) return;
  loginFormRef.value.validate().then(async () => {
    loading.value.login = true;
    loading.value.captcha.solving = true;
    captchaRef?.value?.solve();
  });
}

async function handleTotpInputFinish() {
  if (!loginFormRef.value) return;
  loginFormRef.value.validate().then(async () => {
    loading.value.totp = true;
    captchaRef?.value?.solve();
  });
}

async function handleLogin(captchaToken: string) {
  loading.value.captcha.solving = false;
  const rs = await client.execute<PostLoginResponse>(
    new PostLogin({
      user: loginForm.value.user!,
      password: loginForm.value.password!,
      totp_code: totpForm.value.code
        ? Number(totpForm.value.code.join(""))
        : undefined,
      captcha_token: captchaToken,
    }),
  );
  if (rs.status === 200) {
    mainStore.$patch({
      token: rs.data.token,
      userId: rs.data.user_id,
    });
    showTotpModal.value = false;
    userStore.$patch({
      frpToken: rs.data.frp_token,
      username: rs.data.user_info.username,
      email: rs.data.user_info.email,
      group: rs.data.user_info.group,
      limit: rs.data.user_info.limit,
      traffic: rs.data.user_info.traffic,
      avatar: rs.data.user_info.avatar,
      registerTime: rs.data.user_info.register_time,
    });

    notification.success({
      title: "登录成功",
      content: "欢迎回来，指挥官 " + rs.data.user_info.username + "！",
      duration: 2500,
    });
    navigateTo((route.query.redirect as string | undefined) ?? "/dashboard");
  } else if (rs.status === 202) {
    showTotpModal.value = true;
  } else message.error(rs.message);
  loading.value.login = false;
  loading.value.totp = false;
}

async function handlePasskeyLogin() {
  // TODO: Get credential from navigator
  loading.value.passkey = true;
  const rs = await client.execute<PostPasskeyLoginResponse>(
    new PostPasskeyLogin({ response_json: "" }),
  );
  if (rs.status === 200) {
    mainStore.$patch({
      token: rs.data.token,
      userId: rs.data.user_id,
    });
    userStore.$patch({
      frpToken: rs.data.frp_token,
      username: rs.data.user_info.username,
      email: rs.data.user_info.email,
      group: rs.data.user_info.group,
      limit: rs.data.user_info.limit,
      traffic: rs.data.user_info.traffic,
      avatar: rs.data.user_info.avatar,
      registerTime: rs.data.user_info.register_time,
    });

    notification.success({
      title: "登录成功",
      content: "欢迎回来，指挥官 " + rs.data.user_info.username + "！",
      duration: 2500,
    });
    navigateTo((route.query.redirect as string | undefined) ?? "/dashboard");
  } else message.error(rs.message);
  loading.value.passkey = false;
}

async function handleThirdPartyLogin(type: ThirdParty) {
  loading.value.threeSide = true;
  switch (type) {
    case ThirdParty.QQ: {
      umTrackEvent("click-button-auth-login-third-party-login", {
        第三方账户: "QQ",
      });
      const rs = await client.execute<GetQqLoginResponse>(new GetQqLogin());
      if (rs.status === 200) {
        window.open(rs.data.url);
      } else {
        message.error(rs.message);
      }
      break;
    }
    // Reserved
    // default:
    //   break;
  }
  loading.value.threeSide = false;
}

enum ThirdParty {
  QQ,
}
</script>
