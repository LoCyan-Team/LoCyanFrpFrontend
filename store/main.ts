export const useMainStore = defineStore(
  "main",
  {
    state: () => ({
      token: null,
      userId: null,
      site: {
        broadcast: null,
        announcement: null,
      },
    }),
    getters: {},
    actions: {},
  },
  {
    perist: true,
  },
);
