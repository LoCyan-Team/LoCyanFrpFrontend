import { usePageStore } from "@/store/page";

export default defineNuxtRouteMiddleware((to) => {
  const pageStore = usePageStore();
  // Title
  useHead({
    title: `LoCyanFrp | ${to.meta.title || "未知界面"}`,
  });
  // Sidebar
  if (to.meta.sidebar === false) pageStore.setSidebar(false);
  else pageStore.setSidebar(true);
});
