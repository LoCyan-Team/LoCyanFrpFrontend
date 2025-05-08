<template>
  <n-card :title="node.name">
    <template #header-extra>
      <slot name="header-extra" />
    </template>
    <n-space vertical>
      <!-- 标签 -->
      <n-space>
        <n-tag :type="renderNodeTagColor(node.additional.allowBigTraffic)">
          <span>大流量</span>
          <template #icon>
            <n-icon
              v-if="node.additional.allowBigTraffic"
              :component="CheckmarkCircle"
            />
            <n-icon v-else :component="CloseCircle" />
          </template>
        </n-tag>
        <n-tag :type="renderNodeTagColor(node.additional.allowUdp)">
          <span>UDP</span>
          <template #icon>
            <n-icon
              v-if="node.additional.allowUdp"
              :component="CheckmarkCircle"
            />
            <n-icon v-else :component="CloseCircle" />
          </template>
        </n-tag>
        <n-tag :type="renderNodeTagColor(node.additional.allowHttp)">
          <span>HTTP(s) 虚拟映射</span>
          <template #icon>
            <n-icon
              v-if="node.additional.allowHttp"
              :component="CheckmarkCircle"
            />
            <n-icon v-else :component="CloseCircle" />
          </template>
        </n-tag>
      </n-space>

      <!-- 介绍 -->
      <n-p>
        <n-text>节点地址: {{ node.host }}</n-text>
        <n-el>
          <n-text>ICP 备案: </n-text>
          <n-tag type="info">
            <span
              >{{ node.additional.needIcp ? "需要" : "无需" }} ICP 备案</span
            >
          </n-tag>
        </n-el>
        <n-el>
          <n-text>可用端口范围: </n-text>
          <n-tag v-for="port in node.portRange" :key="port">
            {{ port.replace(":", "-") }}
          </n-tag>
        </n-el>
      </n-p>
    </n-space>
    <n-p>{{ node.description ?? "无" }}</n-p>
    <template #footer>
      <slot name="footer" />
    </template>
    <template #action>
      <slot name="action" />
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { CheckmarkCircle, CloseCircle } from "@vicons/ionicons5";

const props = defineProps<{
  node: {
    id: number;
    name: string;
    description: string | null;
    host: string;
    ip: string;
    portRange: string[];
    additional: {
      allowUdp: boolean;
      allowHttp: boolean;
      allowBigTraffic: boolean;
      needIcp: boolean;
    };
  };
}>();

const { node } = props;

function renderNodeTagColor(b: boolean) {
  return b ? "success" : "error";
}
</script>
