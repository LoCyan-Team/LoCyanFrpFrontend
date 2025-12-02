<template>
  <n-el class="flex-center outbox">
    <n-spin v-if="status === Status.WORKING">
      <template #description> 正在查询，请不要关闭此页面 </template>
    </n-spin>
    <n-el v-else-if="status === Status.SUCCESS" class="flex-center">
      <n-h1>认证成功</n-h1>
      <n-h3 style="margin-top: 0">请回到原页面进行下一步认证</n-h3>
    </n-el>
    <n-el v-else-if="status === Status.ERROR" class="flex-center">
      <n-h1>认证失败</n-h1>
      <n-h3 style="margin-top: 0">{{ error }}</n-h3>
    </n-el>
  </n-el>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";

import { GetRealPerson } from "api/src/api/verification/real-person.get";

definePageMeta({
  sidebar: false,
});

useHead({
  title: "身份认证回调界面",
});

const mainStore = useMainStore();
const client = useApiClient();

enum Status {
  WORKING,
  SUCCESS,
  ERROR,
}

const status = ref<Status>(Status.WORKING);
const error = ref<string>("");

onMounted(async () => {
  const rs = await client.execute(
    new GetRealPerson({
      user_id: mainStore.userId!,
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
