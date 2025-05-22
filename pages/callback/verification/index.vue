<template>
  <n-el class="flex-center outbox">
    <n-spin v-if="status === Status.WORKING">
      <template #description> 正在查询，请不要关闭此页面 </template>
    </n-spin>
    <n-el v-else-if="status === Status.SUCCESS">
      <n-h1>认证成功</n-h1>
      <n-h3 style="margin-top: 0">请回到原页面进行下一步认证</n-h3>
    </n-el>
    <n-el v-else-if="status === Status.ERROR">
      <n-h1>认证失败</n-h1>
      <n-h3 style="margin-top: 0">{{ error }}</n-h3>
    </n-el>
  </n-el>
</template>

<script setup lang="ts">
definePageMeta({
  title: "身份认证回调界面",
  needLogin: false,
  sidebar: false,
});

enum Status {
  WORKING,
  SUCCESS,
  ERROR,
}

const status = ref<Status>(Status.WORKING);
const error = ref<string>("");

onMounted(async () => {
  // TODO: 查询认证状态是否已认证
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
