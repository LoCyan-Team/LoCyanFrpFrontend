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
            <n-button type="success" @click="loadCaptcha">登录</n-button>
            <captcha-dialog
              :show="captcha.show"
              :type="captcha.config.type"
              :vaptcha-scene="2"
              @error="
                (code: unknown) => {
                  message.error('发生错误: ' + code);
                  capcha.show = false;
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
        @click="handlePasskeyLogin"
        type="success"
        secondary
        style="width: 100%"
      >
        通行密钥登录
      </n-button>
    </n-spin>
    <br />
    <n-card title="第三方登录">
      <n-space>
        <n-spin :show="loading.threeSide">
          <n-button type="info" @click="handleThirdPartyLogin(ThirdParty.QQ)" circle>
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

definePageMeta({
  title: "登录",
  needLogin: false,
  redirectLogined: true,
});

const loading = ref<{
  threeSide: boolean;
  passkey: boolean;
}>({
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

const captcha = ref({
  show: false,
  config: {
    type: null,
  },
});

function loadCaptcha() {}

function handleLogin(token: string, server: string | null) {}

function handlePasskeyLogin() {}

function handleThirdPartyLogin(type: ThirdParty) {}

enum ThirdParty {
  QQ
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
}
@media screen and (max-width: 500px) {
  .login-box {
    margin-inline: 1rem;
  }
}
</style>
