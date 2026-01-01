<template>
  <page-content title="新年祝福">
    <n-flex :vertical="true" size="large">
      <n-input v-model:value="messageInput" />
      <n-grid :y-gap="8" :x-gap="12" :cols="10" item-responsive>
        <n-grid-item span="0:3 1000:4">
          <n-button
            v-umami="'click-button-activity-send-message'"
            type="primary"
            @click="sendMessage"
          >
            发送留言
          </n-button>
        </n-grid-item>
      </n-grid>
      <n-spin :show="loading">
        <n-grid :y-gap="8" :x-gap="12" :cols="3" item-responsive>
          <n-grid-item v-for="i in messageList" :key="i.id" span="0:3 1000:1">
            <n-card
              :title="i.username"
              :segmented="{
                content: true,
                footer: 'soft',
              }"
            >
              <template #header-extra>{{ i.time }}</template>
              <MDC :value="i.context" />
            </n-card>
          </n-grid-item>
        </n-grid>
      </n-spin>
    </n-flex>
  </page-content>
</template>
<script setup lang="ts">
import { useMainStore } from "@/store/main";

import {
  GetMessage,
  type GetMessageResponse,
} from "@locyanfrp-dashboard-frontend/api/src/message.get";

import { PostMessage } from "@locyanfrp-dashboard-frontend/api/src/message.post";

const dayjs = useDayjs();

const mainStore = useMainStore();
const client = useApiClient();

const message = useMessage();

const loading = ref(true);

const messageList = ref<
  {
    context: string;
    id: number;
    time: string;
    username: string;
  }[]
>([]);
const messageInput = ref("");

useHead({
  title: "新年祝福",
});

async function getMessageList() {
  const rs = await client.execute<GetMessageResponse>(
    new GetMessage({
      user_id: mainStore.userId!,
    }),
  );
  if (rs.status === 200) {
    rs.data.list.forEach((item) => {
      item.time = dayjs(item.time).format("L LT");
    });
    messageList.value = rs.data.list;
    loading.value = false;
  } else {
    message.error(rs.message);
  }
}

async function sendMessage() {
  if (!messageInput.value) {
    message.error("留言内容不能为空");
    return;
  }
  const rs = await client.execute(
    new PostMessage({
      context: messageInput.value,
      user_id: mainStore.userId!,
    }),
  );
  if (rs.status === 200) {
    message.success("参与成功");
    getMessageList();
  } else {
    message.error(rs.message);
  }
}

getMessageList();
</script>
