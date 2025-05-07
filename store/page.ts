interface PageState {
  sidebar: boolean;
  sidebarMode: string;
}

export const usePageStore = defineStore(
  "page",
  () => {
    const state = reactive<PageState>({
      sidebar: true,
      sidebarMode: "guest",
    });
    const actions = {
      setSidebar(show: boolean) {
        state.sidebar = show;
      },
      setSidebarMode(mode: string) {
        state.sidebarMode = mode;
      },
    };

    return { ...toRefs(state), ...actions };
  },
  {
    persist: false,
  },
);
