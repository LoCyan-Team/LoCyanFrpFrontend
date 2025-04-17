export const usePageStore = defineStore(
  "page",
  {
    state: () => ({
      sidebar: true,
      sidebarMode: "guest",
    }),
    actions: {
      setSidebar(show: boolean) {
        this.sidebar = show;
      },
      setSidebarMode(mode: string) {
        this.sidebarMode = mode;
      },
    },
  },
  {
    perist: false,
  },
);
