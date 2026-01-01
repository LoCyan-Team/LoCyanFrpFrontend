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

import {
  PostLogin,
  type PostLoginResponse,
} from "@locyanfrp-dashboard-frontend/api/src/auth/third-party/qq/login.post";

definePageMeta({
  needLogin: false,
  sidebar: false,
});

useHead({
  title: "QQ 登录回调界面",
});

const message = useMessage();
const notification = useNotification();

const mainStore = useMainStore();
const userStore = useUserStore();
const client = useApiClient({
  auth: false,
});

const route = useRoute();

onMounted(async () => {
  const code = route.query.code as string;
  if (!code) {
    message.error("缺少授权码");
  }

  const rs = await client.execute<PostLoginResponse>(
    new PostLogin({
      code,
    }),
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
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
