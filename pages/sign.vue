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
                <n-text>今日 {{ data.ranking.total }} 人已签到</n-text>
                <br /><n-text>上次签到在 {{ data.lastSign }}</n-text>
                <br v-if="data.signed" /><n-text v-if="data.signed">
                  您是今天第 {{ data.ranking.me }} 位签到的用户
                </n-text>
                <br /><n-text>
                  累计签到获取流量 {{ data.ranking.me }} GiB
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
definePageMeta({
  title: "签到",
});

const loading = ref<boolean>(true);

const data = ref<{
  signed: boolean;
  lastSign: string | null;
  ranking: {
    total: number;
    me: number;
  };
}>({
  signed: false,
  lastSign: null,
  ranking: {
    total: 0,
    me: 0,
  },
});

function handleSign() {
  // TODO
}

onMounted(() => (loading.value = false));
</script>
