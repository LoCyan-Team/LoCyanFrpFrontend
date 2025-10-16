import { usePageStore } from "@/store/page";

export default defineNuxtRouteMiddleware((to) => {
  const pageStore = usePageStore();
  // Sidebar
  if (to.meta.sidebar === false) pageStore.setSidebar(false);
  else pageStore.setSidebar(true);
});
