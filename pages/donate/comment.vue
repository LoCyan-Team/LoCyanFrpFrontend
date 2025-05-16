<template>
  <page-content title="留言">
    <n-space vertical>
      <n-alert type="success" title="坚持本心，用爱发电">
        感谢他们的赞助，让 LCF 变得更好。
      </n-alert>
      <n-empty v-if="data.length === 0" />
      <n-grid v-else :y-gap="8" :x-gap="12" :cols="3" item-responsive>
        <n-grid-item v-for="comment in data" :key="comment" span="0:3 1000:1">
          <n-card>
            <n-space align="center" style="width: 100%">
              <n-gradient-text type="success">
                {{ comment.username }}
              </n-gradient-text>

              <n-gradient-text type="warning">
                {{ comment.amount }} CNY
              </n-gradient-text>
            </n-space>

            <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
              {{ comment.message }}
            </n-ellipsis>

            <template #footer>
              {{ dayjs(comment.time).format("L LT") }}
            </template>
          </n-card>
        </n-grid-item>
      </n-grid>
      <n-space v-if="data.length !== 0" justify="center" style="width: 100%">
        <n-pagination
          v-model:page="page.current"
          v-model:page-size="page.size"
          :page-count="page.count"
          :on-update:page="
            (pageSel) => {
              page.current = pageSel;
              getComments();
            }
          "
          :on-update:page-size="
            (pageSizeSel) => {
              page.size = pageSizeSel;
              getComments();
            }
          "
          show-size-picker
          :page-sizes="[10, 25, 50, 100]"
        />
      </n-space>
    </n-space>
  </page-content>
</template>
<script setup lang="ts">
import { useMainStore } from "@/store/main";

import { Client as ApiClient } from "@/api/src/client";
import { GetComments } from "@/api/src/api/donation/comments.get";

definePageMeta({
  title: "留言",
});

const dayjs = useDayjs();

const message = useMessage();

const mainStore = useMainStore();
const client = new ApiClient(mainStore.token!);
client.initClient();

const data = ref<
  {
    username: string;
    amount: number;
    message: string;
    time: string;
  }[]
>([]);

const page = ref<{
  current: number;
  size: number;
  count: number;
}>({
  current: 1,
  size: 10,
  count: 1,
});

async function getComments() {
  const rs = await client.execute(
    new GetComments({
      user_id: mainStore.userId!,
      page: page.value.current,
      size: page.value.size,
    }),
  );
  if (rs.status === 200) {
    page.value.count = rs.data.pagination.count;
    data.value.length = 0;
    rs.data.list.forEach((it) => {
      data.value.push({
        username: it.username,
        amount: it.amount,
        message: it.message,
        time: it.time,
      });
    });
  } else message.error(rs.message);
}

onMounted(async () => {
  await getComments();
});
</script>
