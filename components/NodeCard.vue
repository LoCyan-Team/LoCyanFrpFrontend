<template>
  <n-card :title="props.node.name">
    <template #header-extra>
      <slot name="header-extra" />
    </template>
    <n-space vertical>
      <n-space>
        <n-tag
          :type="renderNodeTagColor(props.node.additional.allowBigTraffic)"
        >
          <span>大流量</span>
          <template #icon>
            <n-icon
              v-if="props.node.additional.allowBigTraffic"
              :component="CheckmarkCircle"
            />
            <n-icon v-else :component="CloseCircle" />
          </template>
        </n-tag>
        <n-tag :type="renderNodeTagColor(props.node.additional.allowUdp)">
          <span>UDP</span>
          <template #icon>
            <n-icon
              v-if="props.node.additional.allowUdp"
              :component="CheckmarkCircle"
            />
            <n-icon v-else :component="CloseCircle" />
          </template>
        </n-tag>
        <n-tag :type="renderNodeTagColor(props.node.additional.allowHttp)">
          <span>HTTP(s) 虚拟映射</span>
          <template #icon>
            <n-icon
              v-if="props.node.additional.allowHttp"
              :component="CheckmarkCircle"
            />
            <n-icon v-else :component="CloseCircle" />
          </template>
        </n-tag>
      </n-space>

      <n-p>
        <n-text>节点地址: {{ props.node.host }}</n-text>
        <n-el>
          <n-text>ICP 备案: </n-text>
          <n-tag type="info">
            <span
              >{{ props.node.additional.needIcp ? "需要" : "无需" }} ICP
              备案</span
            >
          </n-tag>
        </n-el>
        <n-el>
          <n-text>可用端口范围: </n-text>
          <n-tag v-for="port in props.node.portRange" :key="port">
            {{ port.replace(":", "-") }}
          </n-tag>
        </n-el>
      </n-p>
    </n-space>
    <n-p>{{ props.node.description ?? "无介绍" }}</n-p>
    <template #footer>
      <slot name="footer" />
    </template>
    <template #action>
      <slot name="action" />
    </template>
  </n-card>
</template>

<script setup lang="ts">
import CheckmarkCircle from "@vicons/ionicons5/CheckmarkCircle";
import CloseCircle from "@vicons/ionicons5/CloseCircle";

const props = defineProps<{
  node: {
    id: number;
    name: string;
    description: string | null;
    host: string;
    ip: string | null;
    portRange: string[];
    additional: {
      allowUdp: boolean;
      allowHttp: boolean;
      allowBigTraffic: boolean;
      needIcp: boolean;
    };
  };
}>();

function renderNodeTagColor(b: boolean) {
  return b ? "success" : "error";
}
</script>
