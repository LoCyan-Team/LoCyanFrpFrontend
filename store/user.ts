export const useUserStore = defineStore(
  "user",
  {
    state: () => ({
      username: null,
      email: null,
      frpToken: null,
      group: {
        id: 0,
        name: "未知权限组",
      },
      limit: {
        tunnel: 0,
        inbound: 0,
        outbound: 0,
      },
      traffic: null,
      avatar: "https://weavatar.com/avatar/",
      registerTime: null,
    }),
    getters: {},
    actions: {},
  },
  {
    perist: true,
  },
);
