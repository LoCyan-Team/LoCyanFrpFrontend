<template>
  <n-el />
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";
import { useUserStore } from "@/store/user";

import { GetUser } from "@/api/src/api/user.get";

const mainStore = useMainStore();
const userStore = useUserStore();

const router = useRouter();

const message = useMessage();
const notification = useNotification();

async function aliveTest() {
  if (!useLoggedIn()) return;

  const client = useApiClient();

  const rs = await client.execute(
    new GetUser({
      user_id: mainStore.userId!,
    }),
  );
  switch (rs.status) {
    case 200:
      userStore.$patch({
        traffic: rs.data.traffic,
        limit: {
          tunnel: rs.data.limit.tunnel,
          inbound: rs.data.limit.inbound,
          outbound: rs.data.limit.outbound,
        },
        email: rs.data.email,
      });
      break;
    case 401:
      mainStore.$reset();
      userStore.$reset();
      navigateTo({
        path: "/auth/login",
        query: {
          redirect: router.currentRoute.value.fullPath,
        },
      });
      notification.warning({
        title: "登录状态失效",
        content: "请重新登录控制台。",
        duration: 2500,
      });
      break;
    default:
      message.error(rs.message);
  }
}

aliveTest();
setInterval(() => aliveTest(), 15000);
</script>
