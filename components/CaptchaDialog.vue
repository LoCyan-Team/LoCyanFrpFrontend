<template>
  <!-- Turnstile -->
  <n-modal
    v-model:show="showTurnstileInstance"
    :mask-closable="false"
    preset="card"
    title="请完成人机验证"
    style="min-width: 300px; width: min-content"
  >
    <vue-turnstile
      v-model="turnstileToken"
      :site-key="env.turnstileSiteKey"
      @error="error"
      @unsupported="unsupported"
    />
  </n-modal>
  <!-- VAPTCHA -->
  <n-modal
    v-model:show="showVaptchaInstance"
    :mask-closable="false"
    preset="card"
    title="请完成人机验证"
    style="min-width: 300px; width: min-content"
  >
    <vaptcha-button
      v-model="vaptchaToken"
      v-model:server="vaptchaServer"
      v-model:scene="props.vaptchaScene"
      :vid="env.vaptchaVid"
    />
  </n-modal>
</template>

<script setup lang="ts">
import VueTurnstile from "vue-turnstile";
import "@chongying-star/vue-vaptcha/style.css";
import { VaptchaButton } from "@chongying-star/vue-vaptcha";
import { ref, watch } from "vue";

const { public: publicConfig } = useRuntimeConfig();

const env = {
  turnstileSiteKey: publicConfig.TURNSTILE_SITEKEY,
  vaptchaVid: publicConfig.VAPTCHA_VID,
};

const props = defineProps<{
  show: boolean;
  type: string | null;
  vaptchaScene?: number;
}>();

const emit = defineEmits<{
  (e: "error", error: string): void;
  (e: "unsupported"): void;
  (e: "callback", token: string, server: string | undefined): void;
}>();

let showTurnstileInstance = ref(false),
  showVaptchaInstance = ref(false);

watch(
  () => props.show,
  (value, _) => {
    if (value && props.type === "turnstile") showTurnstileInstance.value = true;
    if (value && props.type === "vaptcha") showVaptchaInstance.value = true;
    if (!value) {
      showTurnstileInstance.value = false;
      showVaptchaInstance.value = false;
    }
  },
);

let turnstileToken = ref("");
let vaptchaToken = ref(""),
  vaptchaServer = ref("");

watch(turnstileToken, (token, _) => {
  callback(token, undefined);
});
watch(vaptchaToken, (token, _) => {
  callback(token, vaptchaServer.value);
});

function callback(token: string, server: string | undefined) {
  emit("callback", token, server);
}

function unsupported() {
  emit("unsupported");
}

function error(err: unknown) {
  showTurnstileInstance.value = false;
  showVaptchaInstance.value = false;
  emit("error", err);
}
</script>
