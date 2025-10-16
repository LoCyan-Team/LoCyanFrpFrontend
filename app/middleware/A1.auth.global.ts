import { usePageStore } from "~/store/page";

export default defineNuxtRouteMiddleware((to) => {
  const pageStore = usePageStore();

  if (to.meta.needLogin === false) {
    if (to.meta.redirectLogined === true && useLoggedIn()) {
      pageStore.setSidebarMode("logined");
      return navigateTo({
        path: "/dashboard",
      });
    }
    pageStore.setSidebarMode("guest");
    return;
  }

  if (!useLoggedIn()) {
    const router = useRouter();
    const routeExists = router.hasRoute(to.name!);

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
