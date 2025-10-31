<template>
  <n-el class="container">
    <n-card title="软件下载" class="full-width-card">
      <n-space vertical size="large">
        <n-form-item label="选择软件">
          <n-select
            v-model:value="selectedSoftware"
            :options="softwareOptions"
            placeholder="请选择要下载的软件"
          />
        </n-form-item>

        <n-el v-if="currentSoftware && currentSoftware.versions">
          <n-form-item label="选择版本">
            <n-select
              v-model:value="selectedVersion"
              :options="versionOptions"
              placeholder="请选择版本"
            />
          </n-form-item>

          <n-form-item label="选择系统">
            <n-select
              v-model:value="selectedSystem"
              :options="systemOptions"
              placeholder="请选择系统"
            />
          </n-form-item>

          <n-form-item label="选择架构">
            <n-select
              v-model:value="selectedArch"
              :options="filteredArchOptions"
              placeholder="请选择架构"
            />
          </n-form-item>
        </n-el>
      </n-space>
    </n-card>

    <n-card
      v-if="selectedSoftware"
      title="软件介绍"
      class="full-width-card info-card"
    >
      <n-space vertical size="medium">
        <n-el v-if="currentSoftware">
          <n-el tag="h3">{{ currentSoftware.label }}</n-el>
          <n-el tag="p">{{ currentSoftware.description }}</n-el>
          <n-space>
            <n-tag
              v-for="tag in currentSoftware.tags"
              :key="tag.text"
              :type="tag.type"
            >
              {{ tag.text }}
            </n-tag>
          </n-space>
          <n-divider />
          <n-el tag="h4">下载方式</n-el>
          <n-button
            type="primary"
            :disabled="!canDownload"
            @click="handleDownload"
          >
            下载
          </n-button>
        </n-el>
      </n-space>
    </n-card>
  </n-el>
</template>

<script setup>
const selectedSoftware = ref("frpc");
const selectedVersion = ref("");
const selectedSystem = ref("");
const selectedArch = ref("");

// 软件配置数据，后期可从 API 获取
const softwareConfig = {
  frpc: {
    label: "纯净版客户端 (FRPC)",
    description:
      "官方原版 FRP 客户端，体积小巧，功能完整。适合有一定技术基础的用户使用。",
    tags: [
      { type: "info", text: "开源" },
      { type: "success", text: "免费" },
    ],
    versions: [
      { label: "v0.52.3", value: "v0.52.3" },
      { label: "v0.52.2", value: "v0.52.2" },
      { label: "v0.52.1", value: "v0.52.1" },
      { label: "v0.52.0", value: "v0.52.0" },
    ],
    systems: [
      { label: "Windows", value: "windows" },
      { label: "Linux", value: "linux" },
      { label: "macOS", value: "darwin" },
    ],
    architectures: {
      windows: [
        { label: "x64", value: "windows_amd64" },
        { label: "x86", value: "windows_386" },
      ],
      linux: [
        { label: "x64", value: "linux_amd64" },
        { label: "ARM64", value: "linux_arm64" },
      ],
      darwin: [
        { label: "x64", value: "darwin_amd64" },
        { label: "ARM64", value: "darwin_arm64" },
      ],
    },
    downloadUrl: (version, arch) =>
      `https://github.com/fatedier/frp/releases/download/${version}/frp_${version.substring(1)}_${arch}.tar.gz`,
  },
  "full-client": {
    label: "完整版客户端",
    description:
      "集成图形界面的 FRP 客户端，操作简单，适合新手用户。包含隧道管理、日志查看等功能。",
    tags: [
      { type: "primary", text: "图形界面" },
      { type: "success", text: "易用" },
    ],
    downloadUrl: () => "#",
  },
  server: {
    label: "服务端",
    description: "FRP 服务端程序，用于部署在具有公网 IP 的服务器上。",
    tags: [{ type: "warning", text: "需要服务器" }],
    downloadUrl: () => "#",
  },
};

const softwareOptions = computed(() => {
  return Object.keys(softwareConfig).map((key) => ({
    label: softwareConfig[key].label,
    value: key,
  }));
});

const currentSoftware = computed(() => {
  return selectedSoftware.value ? softwareConfig[selectedSoftware.value] : null;
});

const versionOptions = computed(() => {
  return currentSoftware.value?.versions || [];
});

const systemOptions = computed(() => {
  return currentSoftware.value?.systems || [];
});

const filteredArchOptions = computed(() => {
  if (!currentSoftware.value?.architectures || !selectedSystem.value) return [];
  return currentSoftware.value.architectures[selectedSystem.value] || [];
});

const canDownload = computed(() => {
  if (!selectedSoftware.value) return false;
  if (selectedSoftware.value === "frpc") {
    return selectedVersion.value && selectedSystem.value && selectedArch.value;
  }
  return true;
});

// 初始化默认值
const initDefaults = () => {
  if (currentSoftware.value) {
    if (currentSoftware.value.versions?.length > 0) {
      selectedVersion.value = currentSoftware.value.versions[0].value;
    }
    if (currentSoftware.value.systems?.length > 0) {
      selectedSystem.value = currentSoftware.value.systems[0].value;
    }
  }
};

watch(selectedSoftware, () => {
  selectedVersion.value = "";
  selectedSystem.value = "";
  selectedArch.value = "";
  nextTick(() => {
    initDefaults();
  });
});

watch(selectedSystem, (newSystem) => {
  if (currentSoftware.value?.architectures?.[newSystem]) {
    const options = currentSoftware.value.architectures[newSystem];
    selectedArch.value = options.length > 0 ? options[0].value : "";
  } else {
    selectedArch.value = "";
  }
});

onMounted(() => {
  initDefaults();
});

const handleDownload = () => {
  const software = currentSoftware.value;
  if (!software) return;

  let downloadUrl = "";
  if (selectedSoftware.value === "frpc") {
    downloadUrl = software.downloadUrl(
      selectedVersion.value,
      selectedArch.value,
    );
  } else {
    downloadUrl = software.downloadUrl();
  }

  if (downloadUrl && downloadUrl !== "#") {
    window.open(downloadUrl, "_blank");
  } else {
    console.log("下载:", selectedSoftware.value);
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
}

.full-width-card {
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-card {
  margin-top: 20px;
}

.info-card h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.info-card h4 {
  margin: 8px 0;
  color: #333;
}

.info-card p {
  margin: 0 0 8px 0;
  color: #666;
  line-height: 1.5;
}
</style>
