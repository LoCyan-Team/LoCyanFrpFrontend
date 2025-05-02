<template>
  <n-space vertical>
    <node-card :node="props.node" />
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
                label="远程端口"
                path="remotePort"
                v-if="hasOption.remotePort.includes(form.type)"
              >
                <n-space>
                  <n-input-number
                    v-model:value="form.remotePort"
                    placeholder="远程端口"
                  />
                  <n-button @click="handleRandomRemotePort">随机端口</n-button>
                </n-space>
              </n-form-item>
            </n-space>
          </n-grid-item>

          <!-- 路径映射 -->
          <n-grid-item
            span="0:2 700:1"
            v-if="hasOption.locations.includes(form.type)"
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
            span="0:2 700:1"
            v-if="hasOption.domain.includes(form.type)"
          >
            <n-form-item label="自定义域名" path="domain">
              <n-input v-model:value="form.domain" placeholder="自定义域名" />
            </n-form-item>
          </n-grid-item>

          <!-- 访问密钥 -->
          <n-grid-item
            span="0:2 700:1"
            v-if="hasOption.secretKey.includes(form.type)"
          >
            <n-form-item label="访问密钥" path="secretKey">
              <n-input v-model:value="form.secretKey" placeholder="访问密钥" />
            </n-form-item>
          </n-grid-item>
        </n-grid>
        <n-button @click="handleSubmit" type="success">提交</n-button>
      </n-form>
    </n-card>
  </n-space>
</template>

<script setup lang="ts">
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
  default:
    | {
        name: string | undefined;
        type: string | undefined;
        localIp: string | undefined;
        localPort: number | undefined;
        remotePort: number | undefined;
        domain: string | undefined;
        locations: string[] | undefined;
        secretKey: string | undefined;
      }
    | undefined;
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
      domain: string | null;
      locations: string[] | null;
      secretKey: string | null;
    },
  ): void;
}>();

const form = ref<{
  name: string | null;
  type: string;
  localIp: string;
  localPort: number | null;
  remotePort: number | null;
  domain: string | null;
  locations: string[] | null;
  secretKey: string | null;
}>({
  name: props.default?.name ?? null,
  type: props.default?.type ?? "tcp",
  localIp: props.default?.localIp ?? "127.0.0.1",
  localPort: props.default?.localPort ?? null,
  remotePort: props.default?.remotePort ?? null,
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

function handleRandomRemotePort() {
  // TODO
}

function handleSubmit() {
  emit("submit", {
    name: form.value.name,
    type: form.value.type,
    localIp: form.value.localIp,
    localPort: form.value.localPort,
    remotePort: form.value.remotePort,
    domain: form.value.domain,
    locations: form.value.locations,
    secretKey: form.value.secretKey,
  });
}
</script>
