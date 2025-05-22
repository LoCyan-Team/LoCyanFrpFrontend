<template>
  <n-el class="flex-center outbox">
    <n-spin>
      <template #description> 正在登录，请不要关闭此页面 </template>
    </n-spin>
  </n-el>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";
import { useUserStore } from "@/store/user";

import { Client as ApiClient } from "@/api/src/client";
import {
  PostLogin,
  type PostLoginResponse,
} from "@/api/src/api/auth/third-party/qq/login.post";

definePageMeta({
  title: "QQ 登录回调界面",
  needLogin: false,
  sidebar: false,
});

const message = useMessage();
const notification = useNotification();

const mainStore = useMainStore();
const userStore = useUserStore();
const client = new ApiClient();
client.initClient();

const route = useRoute();

onMounted(async () => {
  const rs = await client.execute<PostLoginResponse>(
    new PostLogin({
      code: route.query.code as string,
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
  } else {
    message.error(rs.message);
    navigateTo("/auth/login");
  }
});
</script>

<style scoped>
.outbox {
  margin-inline: 1rem;
  min-height: calc(100dvh - 61px);
}

.flex-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
