import { usePageStore } from "~/store/page";

export default defineNuxtRouteMiddleware((to) => {
  const pageStore = usePageStore();

  // 在SSG期间跳过登录检查
  if (import.meta.server) {
    return;
  }

  if (to.meta.needLogin === false) {
    if (to.meta.redirectLoggedIn === true && useLoggedIn()) {
      pageStore.setSidebarMode("loggedIn");
      // 如果有 redirect 参数，则重定向到指定页面，否则默认跳转到 /dashboard
      const redirect = (to.query.redirect as string) || "/dashboard";
      return navigateTo(redirect);
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
  } else pageStore.setSidebarMode("loggedIn");
});
