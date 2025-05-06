<template>
  <n-el class="reset-box">
    <n-h1>重置密码</n-h1>
    <n-card title="修改密码">
      <n-form>
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
          <n-button type="success" secondary @click="loadCaptcha"
            >获取验证码</n-button
          >
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
            <n-button type="success" @click="handleResetPassword">
              重置
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

definePageMeta({
  title: "重置密码",
  needLogin: false,
  redirectLogined: true,
});

const message = useMessage();

const mainStore = useMainStore();
const client = new ApiClient(mainStore.token);

const resetPasswordForm = ref<{
  user: string | null;
  verifyCode: string | null;
  password: string | null;
}>({
  user: null,
  verifyCode: null,
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
  const rs = await client.execute(new GetCaptcha({ action: "login" }));
  if (rs.status === 200) {
    captcha.value.config.id = rs.data.id;
    captcha.value.config.type = rs.data.type;
    captcha.value.show = true;
  } else message.error(rs.message);
  loading.value.login = false;
}

function handleEmailCodeSend(token: string, server?: string) {
  // TODO
}

function handleResetPassword() {
  // TODO
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
}
@media screen and (max-width: 500px) {
  .reset-box {
    margin-inline: 1rem;
  }
}
</style>
