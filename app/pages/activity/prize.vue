<template>
  <page-content title="跨年抽奖">
    <n-spin :show="loading">
      <n-grid :y-gap="8" :x-gap="12" :cols="3" item-responsive>
        <n-grid-item v-for="i in prizeList" :key="i.id" span="0:3 1000:1">
          <n-card
            :title="i.prizeName"
            :segmented="{
              content: true,
              footer: 'soft',
            }"
          >
            <n-scrollbar style="height: 125px">
              <MDC :value="i.description" />
            </n-scrollbar>
            <template #footer>
              <n-p>参与人员: {{ countJoinedUsers(i.joinedUserId) }} 人</n-p>
              <n-p>奖品总数: {{ i.count }} 个</n-p>
              <n-p>创建时间: {{ i.createdTime }}</n-p>
              <n-p>开奖时间: {{ i.openTime }}</n-p>
            </template>
            <template #action>
              <n-space justify="space-between">
                <n-space>
                  <n-text>
                    中奖用户:
                    <n-tag v-if="i.prizedUserId" type="primary">{{
                      i.prizedUserId
                    }}</n-tag>
                    <n-tag v-else type="warning">未开奖</n-tag>
                  </n-text>
                </n-space>
                <n-button
                  v-umami="'click-button-activity-join-prize'"
                  type="primary"
                  @click="handleJoinPrize(i.id)"
                >
                  参与抽奖
                </n-button>
              </n-space>
            </template>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-spin>
  </page-content>
</template>
<script setup lang="ts">
import { useMainStore } from "@/store/main";

import {
  GetPrize,
  type GetPrizeResponse,
} from "@locyanfrp-dashboard-frontend/api/src/prize.get";

import { PostPrize } from "@locyanfrp-dashboard-frontend/api/src/prize.post";

const dayjs = useDayjs();

const mainStore = useMainStore();
const client = useApiClient();

const message = useMessage();

const loading = ref(true);

const prizeList = ref<
  {
    createdTime: string;
    description: string;
    id: number;
    joinedUserId: string;
    openTime: string;
    prizeName: string;
    prizedUserId: string;
    count: number;
  }[]
>([]);

useHead({
  title: "抽奖",
});

async function getPrizeList() {
  const rs = await client.execute<GetPrizeResponse>(
    new GetPrize({
      user_id: mainStore.userId!,
    }),
  );
  if (rs.status === 200) {
    rs.data.list.forEach((item) => {
      item.createdTime = dayjs(item.createdTime).format("L LT");
      item.openTime = dayjs(item.openTime).format("L LT");
    });
    prizeList.value = rs.data.list;
    loading.value = false;
  } else {
    message.error(rs.message);
  }
}

async function handleJoinPrize(prizeId: number) {
  const rs = await client.execute(
    new PostPrize({
      prize_id: prizeId,
      user_id: mainStore.userId!,
    }),
  );
  if (rs.status === 200) {
    message.success("参与成功");
    getPrizeList();
  } else {
    message.error(rs.message);
  }
}

function countJoinedUsers(joinedUserId: string) {
  if (!joinedUserId) return 0;
  return joinedUserId.split(",").length;
}

getPrizeList();
</script>
