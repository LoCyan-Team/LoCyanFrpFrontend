<template>
  <!-- Turnstile -->

  <!-- <n-modal :show="showTurnstileInstance" :mask-closable="false">
    <n-card title="请完成人机验证" style="min-width: 300px; width: min-content">
      <vue-turnstile
        v-model="turnstileToken"
        :site-key="env.turnstileSiteKey"
        @error="error"
        @unsupported="unsupported"
      />
    </n-card>
  </n-modal> -->

  <!-- VAPTCHA -->

  <!-- <n-modal :show="showVaptchaInstance" :mask-closable="false">
    <n-card title="请完成人机验证" style="min-width: 300px; width: min-content">
      <vaptcha-button
        v-model="vaptchaToken"
        v-model:server="vaptchaServer"
        v-model:scene="props.vaptchaScene"
        :vid="env.vaptchaVid"
      />
    </n-card>
  </n-modal> -->

  <!-- CAPJS -->


  <cap-widget v-if="mountCaptcha" id="cap" data-cap-api-endpoint="https://captcha.locyan.cn/21adf2dbb2/"
    @solve="callback">
  </cap-widget>

</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const mountCaptcha = ref(false)

if (import.meta.client) {
  import('@cap.js/widget').then((module) => {
    const Cap = module
    mountCaptcha.value = true
  })
}

const runtimeConfig = useRuntimeConfig();

const env = {
  // turnstileSiteKey: runtimeConfig.public.turnstileSitekey,
  // vaptchaVid: runtimeConfig.public.vaptchaVid,
  capJsId: runtimeConfig.public.capJsSitekey,
};

const emit = defineEmits<{
  (e: "unsupported"): void;
  (e: "callback", token: string): void;
}>();

// let turnstileToken = ref("");
// let vaptchaToken = ref(""),
//   vaptchaServer = ref("");

// watch(turnstileToken, (token, _) => {
//   callback(token, undefined);
// });
// watch(vaptchaToken, (token, _) => {
//   callback(token, vaptchaServer.value);
// });

function callback(event) {
  const token = event.detail.token;
  emit("callback", token);
}

function unsupported() {
  emit("unsupported");
}

// function error(err: unknown) {
//   showTurnstileInstance.value = false;
//   showVaptchaInstance.value = false;
//   emit("error", err);
// }
</script>
