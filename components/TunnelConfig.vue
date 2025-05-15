<template>
  <n-space vertical>
    <node-card :node="props.node">
      <template #header-extra>
        <slot name="node-header-extra" />
      </template>
      <template #footer>
        <slot name="node-footer" />
      </template>
      <template #action>
        <slot name="node-action" />
      </template>
    </node-card>
    <n-card title="隧道信息">
      <n-form>
        <n-grid :y-gap="8" :x-gap="12" :cols="2" item-responsive>
          <!-- 隧道名 -->
          <n-grid-item span="0:2 700:1">
            <n-form-item label="隧道名" path="name">
              <n-input v-model:value="form.name" placeholder="隧道名" />
            </n-form-item>
          </n-grid-item>

          <!-- 穿透协议 -->
          <n-grid-item span="0:2 700:1">
            <n-form-item label="穿透协议" path="type">
              <n-scrollbar x-scrollable>
                <n-radio-group v-model:value="form.type">
                  <n-radio-button value="tcp">TCP</n-radio-button>
                  <n-radio-button value="udp">UDP</n-radio-button>
                  <n-radio-button value="http">HTTP</n-radio-button>
                  <n-radio-button value="https">HTTPS</n-radio-button>
                  <n-radio-button value="xtcp">XTCP</n-radio-button>
                  <n-radio-button value="stcp">STCP</n-radio-button>
                </n-radio-group>
              </n-scrollbar>
            </n-form-item>
          </n-grid-item>

          <!-- 内网 IP -->
          <n-grid-item span="0:2 700:1">
            <n-form-item label="内网 IP" path="localIp">
              <n-input v-model:value="form.localIp" placeholder="内网IP" />
            </n-form-item>
          </n-grid-item>

          <!-- 端口 -->
          <n-grid-item span="0:2 700:1">
            <n-space>
              <!-- 内网端口 -->
              <n-form-item label="内网端口" path="localPort">
                <n-input-number
                  v-model:value="form.localPort"
                  placeholder="内网端口"
                />
              </n-form-item>
              <!-- 远程端口 -->
              <n-form-item
                v-if="hasOption.remotePort.includes(form.type)"
                label="远程端口"
                path="remotePort"
              >
                <n-space>
                  <n-input-number
                    v-model:value="form.remotePort"
                    :loading="loading.randomPort"
                    placeholder="远程端口"
                  />
                  <n-button
                    :loading="loading.randomPort"
                    :disabled="loading.randomPort"
                    @click="handleRandomRemotePort"
                  >
                    随机端口
                  </n-button>
                </n-space>
              </n-form-item>
            </n-space>
          </n-grid-item>

          <!-- 路径映射 -->
          <n-grid-item
            v-if="hasOption.locations.includes(form.type)"
            span="0:2 700:1"
          >
            <n-form-item label="路径映射" path="locations">
              <n-dynamic-input
                v-model:value="form.locations"
                placeholder="请输入"
                :min="1"
                :max="10"
              />
            </n-form-item>
          </n-grid-item>

          <!-- 自定义域名 -->
          <n-grid-item
            v-if="hasOption.domain.includes(form.type)"
            span="0:2 700:1"
          >
            <n-form-item label="自定义域名" path="domain">
              <n-input v-model:value="form.domain" placeholder="自定义域名" />
            </n-form-item>
          </n-grid-item>

          <!-- 访问密钥 -->
          <n-grid-item
            v-if="hasOption.secretKey.includes(form.type)"
            span="0:2 700:1"
          >
            <n-form-item label="访问密钥" path="secretKey">
              <n-input v-model:value="form.secretKey" placeholder="访问密钥" />
            </n-form-item>
          </n-grid-item>
        </n-grid>
        <n-divider>高级选项</n-divider>
        <n-grid :y-gap="8" :x-gap="12" :cols="4" item-responsive>
          <!-- 加密 -->
          <n-grid-item span="0:4 700:1">
            <n-form-item label="使用加密" path="useEncryption">
              <n-switch v-model:value="form.useEncryption" />
            </n-form-item>
          </n-grid-item>
          <!-- 压缩 -->
          <n-grid-item span="0:4 700:1">
            <n-form-item label="使用压缩" path="useCompression">
              <n-switch v-model:value="form.useCompression" />
            </n-form-item>
          </n-grid-item>
        </n-grid>
        <n-button type="success" @click="handleSubmit">提交</n-button>
      </n-form>
    </n-card>
  </n-space>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";

import { Client as ApiClient } from "@/api/src/client";
import { GetPort } from "@/api/src/api/node/port.get";

const mainStore = useMainStore();

const client = new ApiClient(mainStore.token!);
client.initClient();

const message = useMessage();

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
  default?: {
    name?: string;
    type?: string;
    localIp?: string;
    localPort?: number;
    remotePort?: number | null;
    useEncryption?: boolean;
    useCompression?: boolean;
    domain?: string | null;
    locations?: string[] | null;
    secretKey?: string | null;
  };
}>();

const emit = defineEmits<{
  (
    e: "submit",
    tunnel: {
      name: string;
      type: string;
      localIp: string;
      localPort: number;
      remotePort: number | null;
      useEncryption: boolean;
      useCompression: boolean;
      domain: string | null;
      locations: string[] | null;
      secretKey: string | null;
    },
  ): void;
}>();

const loading = ref<{
  randomPort: boolean;
}>({
  randomPort: false,
});

const form = ref<{
  name: string | null;
  type: string;
  localIp: string;
  localPort: number | null;
  remotePort: number | null;
  useEncryption: boolean;
  useCompression: boolean;
  domain: string | null;
  locations: string[] | null;
  secretKey: string | null;
}>({
  name: props.default?.name ?? null,
  type: props.default?.type ?? "tcp",
  localIp: props.default?.localIp ?? "127.0.0.1",
  localPort: props.default?.localPort ?? null,
  remotePort: props.default?.remotePort ?? null,
  useEncryption: props.default?.useEncryption ?? false,
  useCompression: props.default?.useEncryption ?? false,
  domain: props.default?.domain ?? null,
  locations: props.default?.locations ?? null,
  secretKey: props.default?.secretKey ?? null,
});

const hasOption = {
  remotePort: ["tcp", "udp"],
  domain: ["http", "https"],
  locations: ["http", "https"],
  secretKey: ["xtcp", "stcp"],
};

async function handleRandomRemotePort() {
  loading.value.randomPort = true;
  const rs = await client.execute(
    new GetPort({
      user_id: mainStore.userId!,
      node_id: props.node.id,
    }),
  );

  if (rs.status === 200) form.value.remotePort = rs.data.port;
  else message.error(rs.message);

  loading.value.randomPort = false;
}

function handleSubmit() {
  emit("submit", {
    name: form.value.name!,
    type: form.value.type,
    localIp: form.value.localIp,
    localPort: form.value.localPort!,
    remotePort: form.value.remotePort,
    useEncryption: form.value.useEncryption,
    useCompression: form.value.useCompression,
    domain: form.value.domain,
    locations: form.value.locations,
    secretKey: form.value.secretKey,
  });
}
</script>
