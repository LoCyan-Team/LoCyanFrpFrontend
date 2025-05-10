<template>
  <page-content title="签到">
    <n-spin :show="loading">
      <n-grid :y-gap="8" :x-gap="12" :cols="3" item-responsive>
        <n-gi span="0:3 1000:2">
          <n-card title="签到">
            <n-el v-if="!data.signed">
              <n-space vertical>
                <n-text>通过签到，您可以获得更多流量</n-text>
                <n-button type="success" @click="handleSign">签到</n-button>
              </n-space>
            </n-el>
            <n-el v-else>
              <n-space vertical>
                <n-text>您今天已经签到过啦</n-text>
                <n-button disabled>已签到</n-button>
              </n-space>
            </n-el>
          </n-card>
        </n-gi>
        <n-gi span="0:3 1000:1">
          <n-card title="签到统计">
            <n-space vertical>
              <n-el>
                <br /><n-text v-if="data.lastSign">
                  上次签到在 {{ data.lastSign }}
                </n-text>
                <n-text v-else>您还没有签过到</n-text>
                <br /><n-text>
                  累计签到 {{ data.totalSign }} 次，获取流量
                  {{ data.totalGetTraffic }} GiB
                </n-text>
              </n-el>
              <n-image
                v-if="data.signed"
                lazy
                width="100%"
                src="https://api.imlazy.ink/img"
              />
            </n-space>
          </n-card>
        </n-gi>
      </n-grid>
    </n-spin>
  </page-content>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";

import { Client as ApiClient } from "@/api/src/client";
import { GetSign } from "@/api/src/api/sign.get";
import { PostSign } from "@/api/src/api/sign.post";

definePageMeta({
  title: "签到",
});

const dayjs = useDayjs();

const mainStore = useMainStore();
const client = new ApiClient(mainStore.token!);
client.initClient();

const message = useMessage();
const dialog = useDialog();

const loading = ref<boolean>(true);

const data = ref<{
  signed: boolean;
  lastSign: string | null;
  totalSign: number;
  totalGetTraffic: number;
}>({
  signed: false,
  lastSign: null,
  totalSign: 0,
  totalGetTraffic: 0,
});

async function handleSign() {
  const rs = await client.execute(
    new PostSign({
      user_id: mainStore.userId!,
    }),
  );
  if (rs.status === 200) {
    data.value.signed = true;
    data.value.totalGetTraffic += rs.data.get_traffic;
    data.value.totalSign++
    data.value.lastSign = dayjs().format("L LT");
    dialog.success({
      title: "签到成功",
      content: `本次签到获得 ${rs.data.get_traffic} GiB 流量${rs.data.first_sign ? "，这是您的首次签到。" : "。"}`,
    });
  } else message.error(rs.message);
}

onMounted(async () => {
  const rs = await client.execute(
    new GetSign({
      user_id: mainStore.userId!,
    }),
  );
  if (rs.status === 200) {
    data.value.signed = rs.data.status;
    data.value.totalSign = rs.data.total_sign;
    data.value.totalGetTraffic = rs.data.total_get_traffic;
    data.value.lastSign = dayjs(rs.data.last_sign).format("L LT");
  } else message.error(rs.message);

  loading.value = false;
});
</script>
