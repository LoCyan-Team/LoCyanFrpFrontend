import { usePageStore } from "@/store/page";

export default defineNuxtRouteMiddleware((to) => {
  const pageStore = usePageStore();
  // Title
  useHead({
    title: to.meta.title
      ? `LoCyanFrp | ${to.meta.title}`
      : "LoCyanFrp 乐青映射",
  });
  // Sidebar
  if (to.meta.sidebar === false) pageStore.setSidebar(false);
  else pageStore.setSidebar(true);
});
