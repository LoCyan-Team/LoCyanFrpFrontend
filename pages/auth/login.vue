<template>
  <n-el class="login-box">
    <n-h1>登录</n-h1>
    <n-card>
      <n-form>
        <n-form-item label="用户名 / 邮箱" path="username">
          <n-input
            v-model:value="formData.username"
            type="text"
            placeholder="用户名"
          />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input
            v-model:value="formData.password"
            type="password"
            placeholder="密码"
          />
        </n-form-item>
        <n-el>
          <n-space justify="space-between">
            <n-space>
              <n-spin :show="loading.threeSide">
                <n-button type="info" @click="handleQqLogin" circle>
                  <n-icon>
                    <Qq />
                  </n-icon>
                </n-button>
              </n-spin>
              <n-spin :show="loading.passkey">
                <n-button @click="startPasskeyLogin" ghost
                  >通行密钥登录</n-button
                >
              </n-spin>
            </n-space>
            <n-space justify="end">
              <n-button
                ghost
                style="--n-border: none"
                type="success"
                @click="() => router.push({ name: 'Register' })"
              >
                没有账户？去注册
              </n-button>
              <n-button type="success" @click="loadCaptcha"> 登录</n-button>
              <captcha-component
                :show="captcha.show"
                :type="captcha.preData.type"
                :vaptcha-scene="2"
                @error="
                  (code) => {
                    message.error('发生错误: ' + code);
                    capcha.show = false;
                  }
                "
                @unsupported="
                  message.error(
                    '您的浏览器不支持加载验证码，请更换或升级浏览器后重试',
                  )
                "
                @callback="captchaCallback"
              />
            </n-space>
          </n-space>
        </n-el>
      </n-form>
    </n-card>
  </n-el>
</template>

<script setup lang="ts">
import { Qq } from "@vicons/fa";

definePageMeta({
  title: "登录",
  needLogin: false,
});

const loading = ref<{
  threeSide: boolean;
  passkey: boolean;
}>({
  threeSide: false,
  passkey: false,
});

const formData = ref<{
  username: string;
  password: string;
}>({
  username: null,
  password: null,
});

const captcha = ref({
  show: false,
  preData: {
    type: null,
  },
});
</script>

<style scoped>
.login-box {
  margin: 1rem;
  margin-top: 3rem;
  margin-inline: auto;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
