<template>
  <n-float-button
    v-if="document?.enable"
    :bottom="40"
    :right="40"
    :width="45"
    :height="45"
    @click="handleButtonClick"
  >
    <n-icon>
      <component :is="showPanel ? CloseOutline : Document" />
    </n-icon>
  </n-float-button>

  <client-only>
    <transition name="slide-up">
      <n-card
        v-if="showPanel"
        class="doc-panel"
        closable
        title="帮助文档"
        :content-style="{ padding: 0, flex: 1 }"
        @close="showPanel = false"
      >
        <n-spin
          :show="loading"
          style="flex: 1; height: 100%"
          :content-style="{ height: '100%' }"
        >
          <n-el style="height: 100%">
            <iframe :src="docUrl" class="doc-iframe" @load="loading = false" />
          </n-el>
        </n-spin>

        <template #header-extra>
          <n-tooltip>
            <template #trigger>
              <n-button text @click="openInNewTab()">
                <template #icon>
                  <n-icon>
                    <InsertLinkOutlined />
                  </n-icon>
                </template>
              </n-button>
            </template>
            在新标签页打开
          </n-tooltip>
        </template>
      </n-card>
    </transition>
  </client-only>
</template>

<script setup lang="ts">
import Document from "@vicons/ionicons5/Document";
import CloseOutline from "@vicons/ionicons5/CloseOutline";
import InsertLinkOutlined from "@vicons/material/InsertLinkOutlined";

interface DocumentMeta {
  enable: boolean;
  path: string;
}

const route = useRoute();
const runtimeConfig = useRuntimeConfig();

const document = computed(
  () => route.meta.document as DocumentMeta | undefined,
);

watch(
  () => document.value,
  (val) => {
    if (val?.enable) loading.value = true;
  },
);

const baseUrl = runtimeConfig.public.docUrl;
const docUrl = computed(() => baseUrl + (document.value?.path ?? ""));

const showPanel = ref(false);
const loading = ref(true);
const isMobile = ref(false);

let mediaQuery: MediaQueryList | null = null;

const updateMobileStatus = (e: MediaQueryListEvent | MediaQueryList) => {
  isMobile.value = e.matches;
  // 如果窗口突然缩小到移动端，自动关闭已经打开的面板，防止遮挡
  if (isMobile.value) showPanel.value = false;
};

onMounted(() => {
  mediaQuery = window.matchMedia("(max-width: 768px and max-height: 740px)");

  isMobile.value = mediaQuery.matches;

  mediaQuery.addEventListener("change", updateMobileStatus);
});

onUnmounted(() => {
  // 清理监听器
  mediaQuery?.removeEventListener("change", updateMobileStatus);
});

async function openInNewTab() {
  navigateTo(docUrl.value, {
    open: {
      target: "_blank",
    },
  });
}

async function handleButtonClick() {
  if (isMobile.value) {
    await openInNewTab();
  } else {
    showPanel.value = !showPanel.value;
    if (showPanel.value) loading.value = true;
  }
}
</script>

<style scoped>
.doc-panel {
  position: fixed;
  right: 40px;
  bottom: 95px;
  width: 400px;
  height: 650px;
  z-index: 1000;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
}

.doc-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  border-radius: 0 0 12px 12px;
}

/* 简单的滑入动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px) scale(0.95);
  opacity: 0;
}
</style>
