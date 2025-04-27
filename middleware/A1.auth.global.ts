import { useMainStore } from "@/store/main";
import { usePageStore } from "@/store/page";

export default defineNuxtRouteMiddleware((to, _) => {
  const mainStore = useMainStore();
  const { token } = mainStore;

  const pageStore = usePageStore();

  if (to.meta.needLogin === false) {
    if (to.meta.redirectLogined === true && token !== null) {
      pageStore.setSidebarMode("logined");
      return navigateTo({
        path: "/dashboard",
      });
    }
    return;
  }

  if (token === null) {
    const router = useRouter();
    const routeExists = router.hasRoute(to.name);

    if (routeExists) {
      pageStore.setSidebarMode("guest");
      return navigateTo({
        path: "/auth/login",
        query: {
          redirect: to.fullPath,
        },
      });
    }
  } else pageStore.setSidebarMode("logined");
});
