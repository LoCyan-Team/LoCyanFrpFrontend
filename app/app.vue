<template>
  <nuxt-route-announcer />
  <nuxt-layout>
    <client-only>
      <nuxt-page class="content" />
      <template #fallback>
        <n-el class="content loading-container">
          <n-space vertical size="large">
            <div class="section">
              <n-skeleton
                height="40px"
                width="50%"
                :sharp="false"
                style="margin-bottom: 16px"
              />
              <n-space align="center">
                <n-skeleton circle size="small" />
                <n-skeleton text width="120px" />
              </n-space>
            </div>

            <div class="section">
              <n-skeleton text :repeat="3" />
              <n-skeleton text width="80%" />
            </div>

            <n-skeleton
              height="180px"
              width="100%"
              :sharp="false"
              style="border-radius: 8px"
            />

            <div class="section">
              <n-skeleton text width="90%" />
              <n-skeleton text :repeat="4" />
              <n-skeleton text width="60%" />
            </div>

            <div class="section">
              <n-skeleton text :repeat="2" />
              <n-skeleton text width="70%" />
            </div>
          </n-space>
        </n-el>
      </template>
    </client-only>
  </nuxt-layout>
</template>

<script setup lang="ts"></script>

<style scoped>
.content {
  min-height: calc(100dvh - 61px);
}

.loading-container {
  padding: 40px 24px;
  margin: 0 auto;
  box-sizing: border-box;
}
</style>
