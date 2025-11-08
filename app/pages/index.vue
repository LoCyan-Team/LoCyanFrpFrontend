<template>
  <n-el />
</template>

<script setup lang="ts">
definePageMeta({
  needLogin: false,
});

if (import.meta.client) {
  if (useLoggedIn()) {
    navigateTo("/dashboard");
  } else {
    navigateTo("/auth/login");
  }
}
</script>
