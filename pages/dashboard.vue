<template>
  <page-content title="仪表盘">
    <n-grid :y-gap="8" :x-gap="12" :cols="3" item-responsive>
      <n-gi span="0:3 700:1">
        <n-space vertical>
          <n-card title="数据报表">
            <n-grid :y-gap="12" :x-gap="12" cols="2">
              <n-gi span="1">
                <n-statistic label="上行限速" tabular-nums>
                  <n-number-animation :from="0" :to="userStore.limit.inbound" />
                  <template #suffix>Mbit/s</template>
                </n-statistic>
              </n-gi>
              <n-gi span="1">
                <n-statistic label="下行限速" tabular-nums>
                  <n-number-animation :from="0" :to="userStore.limit.inbound" />
                  <template #suffix>Mbit/s</template>
                </n-statistic>
              </n-gi>
              <n-gi span="1">
                <n-statistic label="剩余流量" tabular-nums>
                  <n-number-animation :from="0" :to="userStore.traffic" />
                  <template #suffix>GiB</template>
                </n-statistic>
              </n-gi>
              <n-gi span="1">
                <n-statistic label="隧道数量限制" tabular-nums>
                  <n-text v-if="userStore.limit.tunnel === null">无限制</n-text>
                  <n-number-animation v-else :from="0" :to="userStore.limit.tunnel" />
                  <template #suffix>条</template>
                </n-statistic>
              </n-gi>
            </n-grid>
          </n-card>
          <n-card title="流量重置">
            <n-space vertical>
              <n-text>
                如果流量真的太多，想要恢复到默认，那么您可以点击这个按钮重置。
              </n-text>
              <n-popconfirm @positive-click="handleResetTraffic">
                <template #trigger>
                  <n-button
                    :loading="loading.resetTraffic"
                    :disabled="loading.resetTraffic"
                    >重置流量</n-button
                  >
                </template>
                此操作不可撤销，请确认。
              </n-popconfirm>
            </n-space>
          </n-card>
          <n-card title="快捷导航">
            <n-space vertical>
              <n-text>
                我们在这里放了一些导航，避免有的用户真的会找不到入口。
              </n-text>
              <n-text>
                如果你找不到入口，那你赢了。因为写这个的时候我还没找到几个入口比较难找的。
              </n-text>
            </n-space>
          </n-card>
        </n-space>
      </n-gi>
      <n-gi span="0:3 700:2">
        <n-space vertical>
          <n-spin :show="loading.announcement">
            <n-card title="公告板">
              <n-p v-if="data.announcement">
                <MDC :value="data.announcement" />
              </n-p>
              <n-empty v-else />
            </n-card>
          </n-spin>
          <n-card title="流量统计图">
            <highcharts :options="speedChartOptions" />
            <highcharts :options="trafficChartOptions" />
          </n-card>
        </n-space>
      </n-gi>
    </n-grid>
  </page-content>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";
import { useUserStore } from "@/store/user";

import { useOsTheme } from "naive-ui";

import { Client as ApiClient } from "@/api/src/client";
import { GetNotice, type GetNoticeResponse } from "@/api/src/api/site/notice.get";
import { PostTraffic as PostResetTraffic } from "@/api/src/api/user/traffic.post";

const naiveOsTheme = useOsTheme();
if (naiveOsTheme.value === "dark") await import("highcharts/themes/dark-unica");

definePageMeta({
  title: "仪表盘",
});

const mainStore = useMainStore();
const userStore = useUserStore();
const client = new ApiClient(mainStore.token!);
client.init();

const message = useMessage();
const dialog = useDialog();

const loading = ref<{
  announcement: boolean;
  resetTraffic: boolean;
}>({
  announcement: true,
  resetTraffic: false,
});

const data = ref<{
  announcement: string | null;
}>({
  announcement: null,
});

const speedChartOptions = ref({
  title: {
    text: "带宽速率",
  },
  yAxis: {
    title: {
      text: "Mbit/s",
    },
  },
  series: [
    {
      name: "上行",
      data: [0],
    },
    {
      name: "下行",
      data: [0],
    },
  ],
  credits: {
    enabled: false,
  },
});

const trafficChartOptions = ref({
  title: {
    text: "流量",
  },
  yAxis: {
    title: {
      text: "MiB",
    },
  },
  series: [
    {
      name: "流量",
      data: [0],
    },
  ],
  credits: {
    enabled: false,
  },
});

async function handleResetTraffic() {
  loading.value.resetTraffic = true;
  const rs = await client.execute(
    new PostResetTraffic({
      user_id: mainStore.userId!,
    }),
  );

  if (rs.status === 200)
    dialog.success({
      title: "重置成功",
      content: "已重置流量为当前用户组默认流量。",
    });
  else message.error(rs.message);
  loading.value.resetTraffic = false;
}

onMounted(async () => {
  const rs = await client.execute<GetNoticeResponse>(new GetNotice());
  data.value.announcement = rs.data.announcement;
  loading.value.announcement = false;
});
</script>
