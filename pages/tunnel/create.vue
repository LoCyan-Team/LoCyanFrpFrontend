<template>
  <page-content title="创建隧道">
    <transition name="fade" mode="out-in">
      <n-el v-if="selectedNode !== null">
        <tunnel-config :node="selectedNode"></tunnel-config>
      </n-el>
      <n-el v-else>
        <n-empty v-if="nodes.length === 0" />
        <n-grid v-else :x-gap="8" :y-gap="12" :cols="3" item-responsive>
          <n-grid-item span="0:3 1000:1" v-for="node in nodes" :key="node.id">
            <node-card :node="node">
              <template #action>
                <n-button type="primary" @click="handleNodeSelect(node)">
                  选择
                </n-button>
              </template>
            </node-card>
          </n-grid-item>
        </n-grid>
      </n-el>
    </transition>
  </page-content>
</template>

<script setup lang="ts">
definePageMeta({
  title: "创建隧道",
});

interface Node {
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
}

const selectedNode = ref<Node | null>(null);

const nodes = ref<Node[]>([
  {
    id: 0,
    name: "一个好听的名字",
    description: "这里是介绍信息",
    host: "localhost",
    ip: "0.0.0.0",
    portRange: ["0:65535"],
    additional: {
      allowUdp: true,
      allowHttp: true,
      allowBigTraffic: true,
      needIcp: true,
    },
  },
]);

function handleNodeSelect(node: Node) {
  selectedNode.value = node;
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
