<script setup lang="ts">
import { useMainStore } from "@/store/main";

definePageMeta({
  needLogin: false,
});

const mainStore = useMainStore();

const { token } = mainStore;

if (token !== null) {
  navigateTo("/dashboard");
} else {
  navigateTo("/auth/login");
}
</script>
