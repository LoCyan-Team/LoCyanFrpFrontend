<template>
  <n-space class="footer-outbox" justify="space-between">
    <n-el>
      <n-thing>
        <n-text
          >© 2022-{{ currentYear }}
          <n-a href="https://www.locyan.cn" target="_blank">
            杭州樱芸网络科技有限公司
          </n-a>
          。版权所有。
        </n-text>
        <br />
        <n-text>
          <n-a href="https://www.locyan.cn" target="_blank">
            Hangzhou Yingyun Network Technology Co., Ltd
          </n-a>
          . All right reserved.
        </n-text>
      </n-thing>
      <n-thing>
        <n-text>
          使用本站服务即代表您同意
          <n-a target="_blank" href="https://terms.locyan.cn/terms-of-service">
            服务条款
          </n-a>
          |
          <n-a target="_blank" href="https://terms.locyan.cn/privacy-policy">
            隐私政策
          </n-a>
        </n-text>
        <br />
        <n-text>
          <n-a target="_blank" href="https://内网穿透.中国/">
            China Frp Union 识别码: JRXHB5D4
          </n-a>
        </n-text>
      </n-thing>
    </n-el>
    <n-thing style="margin-right: 0.5rem">
      <n-space align="center">
        <n-a
          target="_blank"
          href="https://github.com/LoCyan-Team/LoCyanFrpFrontend"
        >
          <client-only>
            <n-icon
              :size="20"
              :component="GitAlt"
              style="transform: translateY(5px)"
            />
          </client-only>
          {{ env.git.branch }} - {{ env.git.commitHash }}
        </n-a>
      </n-space>
      <n-text>基于 GPL-3.0 协议分发</n-text>
    </n-thing>
  </n-space>
</template>

<script setup lang="ts">
import GitAlt from "@vicons/fa/GitAlt";

const currentYear = new Date().getFullYear();

const runtimeConfig = useRuntimeConfig();

const env = { git: runtimeConfig.public.git };
</script>

<style scoped>
.footer-outbox {
  padding: 1rem;
}

.footer-outbox .n-thing {
  margin-block: 0.5rem;
}
</style>
