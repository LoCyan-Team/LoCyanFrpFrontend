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
                  <n-number-animation :from="0" :to="userStore.limit.tunnels" />
                  <template #suffix>条</template>
                </n-statistic>
              </n-gi>
            </n-grid>
          </n-card>
          <n-card title="流量重置">
            <n-space vertical>
              <n-text
                >如果流量真的太多，想要恢复到默认，那么您可以点击这个按钮重置。</n-text
              >
              <n-button @click="handleResetTraffic">重置流量</n-button>
            </n-space>
          </n-card>
          <n-card title="快捷导航">
            <n-space vertical>
              <n-text
                >我们在这里放了一些导航，避免有的用户真的会找不到入口。</n-text
              >
            </n-space>
          </n-card>
        </n-space>
      </n-gi>
      <n-gi span="0:3 700:2">
        <n-space vertical>
          <n-card title="公告板">
            <n-p v-if="data.annnouncement"></n-p>
            <n-empty v-else></n-empty>
          </n-card>
          <n-card title="流量统计图">
            <highcharts :options="speedChartOptions"></highcharts>
            <highcharts :options="trafficChartOptions"></highcharts>
          </n-card>
        </n-space>
      </n-gi>
    </n-grid>
  </page-content>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user";

definePageMeta({
  title: "仪表盘",
});

const userStore = useUserStore();

const data = ref<object>({
  announcement: null,
});

const speedChartOptions = ref({
  title: {
    text: null,
  },
  yAxis: {
    title: {
      text: "Mbit/s",
    },
  },
  series: [
    {
      name: "上行",
      data: [10, 15.6, 21.3],
    },
    {
      name: "下行",
      data: [11, 16, 25],
    },
  ],
});

const trafficChartOptions = ref({
  title: {
    text: null,
  },
  yAxis: {
    title: {
      text: "MiB",
    },
  },
  series: [
    {
      name: "流量",
      data: [5, 3, 4],
    },
  ],
});

function handleResetTraffic() {
  // TODO
}
</script>
