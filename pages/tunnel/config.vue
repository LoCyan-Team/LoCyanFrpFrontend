<template>
  <page-content title="配置文件">
    <n-space vertical>
      <n-alert type="info" title="使用须知">
        配置文件启动适用于纯净版客户端的手动配置。如您对此并不了解，我们更推荐您使用启动器或一键启动命令启动。
      </n-alert>
      <n-spin :show="loading">
        <n-card title="请选择">
          <n-form>
            <n-tabs type="line" animated>
              <n-tab-pane name="tunnel" tab="按隧道">
                <n-form-item label="选择隧道" path="tunnelConfig">
                  <n-select
                    v-model:value="tunnelSelected"
                    :options="tunnelOptions"
                    @update:value="handleTunnelSelect"
                  />
                </n-form-item>
              </n-tab-pane>
              <n-tab-pane name="node" tab="按节点">
                <n-form-item label="选择节点" path="tunnelConfig">
                  <n-select
                    v-model:value="nodeSelected"
                    :options="nodeOptions"
                    @update:value="handleNodeSelect"
                  />
                </n-form-item>
              </n-tab-pane>
            </n-tabs>
          </n-form>
        </n-card>
      </n-spin>

      <n-spin :show="loading">
        <n-card title="配置文件">
          <template #header-extra>
            <n-button
              type="success"
              secondary
              @click="$copyToClipboard(content)"
            >
              复制全部内容
            </n-button>
          </template>
          <n-scrollbar x-scrollable>
            <n-code :code="content" language="ini" show-line-numbers />
          </n-scrollbar>
        </n-card>
      </n-spin>
    </n-space>
  </page-content>
</template>

<script setup lang="ts">
import type { SelectOption } from "naive-ui";

definePageMeta({
  title: "配置文件",
});

const loading = ref(true);

const content = ref("什么也没有呀~");

const tunnelOptions = ref<Array<SelectOption>>([]),
  nodeOptions = ref<Array<SelectOption>>([]);

const tunnelSelected = ref<number>(0),
  nodeSelected = ref<number>(0);

function handleTunnelSelect(value: string, option: SelectOption) {
  // TODO
}
function handleNodeSelect(value: string, option: SelectOption) {
  // TODO
}

onMounted(() => (loading.value = false));
</script>
