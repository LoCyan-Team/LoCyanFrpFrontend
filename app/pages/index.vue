<template>
  <n-el />
</template>

<script setup lang="ts">
definePageMeta({
  needLogin: false,
});

if (useLoggedIn()) {
  navigateTo("/dashboard");
} else {
  navigateTo("/auth/login");
}
</script>
