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
            type="email"
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
            @click="loadCaptcha"
          >
            获取验证码
          </n-button>
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
            <n-button type="success" @click="handleRegister">注册</n-button>
          </n-space>
        </n-el>
      </n-form>
    </n-card>
  </n-el>
</template>
<script setup lang="ts">
definePageMeta({
  title: "注册",
  needLogin: false,
  redirectLogined: true,
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

const captcha = ref({
  show: false,
  config: {
    type: null,
  },
});

function loadCaptcha() {}

function handleEmailCodeSend(token: string, server: string | null) {}

function handleRegister() {}
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
