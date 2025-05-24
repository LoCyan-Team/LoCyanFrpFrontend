<template>
  <n-el class="flex-center outbox">
    <n-spin v-if="status === Status.WORKING">
      <template #description> 正在绑定，请不要关闭此页面 </template>
    </n-spin>
    <n-el v-else-if="status === Status.SUCCESS" class="flex-center">
      <n-h1>绑定成功</n-h1>
      <n-h3 style="margin-top: 0">已成功绑定 QQ 账户</n-h3>
    </n-el>
    <n-el v-else-if="status === Status.ERROR" class="flex-center">
      <n-h1>绑定失败</n-h1>
      <n-h3 style="margin-top: 0">{{ error }}</n-h3>
    </n-el>
  </n-el>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";

import { Client as ApiClient } from "@/api/src/client";
import { PostBind } from "@/api/src/api/user/third-party/qq/bind.post";

definePageMeta({
  title: "QQ 绑定回调界面",
  needLogin: false,
  sidebar: false,
});

const mainStore = useMainStore();
const client = new ApiClient(mainStore.token!);
client.init();

const route = useRoute();

enum Status {
  WORKING,
  SUCCESS,
  ERROR,
}

const status = ref<Status>(Status.WORKING);
const error = ref<string>("");

onMounted(async () => {
  const rs = await client.execute(
    new PostBind({
      user_id: mainStore.userId!,
      code: route.query.code as string,
    }),
  );
  if (rs.status === 200) {
    status.value = Status.SUCCESS;
  } else {
    error.value = rs.message;
    status.value = Status.ERROR;
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
