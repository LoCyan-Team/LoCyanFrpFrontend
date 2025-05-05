export const useMainStore = defineStore(
  "main",
  {
    state: () => ({
      token: null,
      userId: null,
    }),
    getters: {},
    actions: {
      setToken(token: string) {
        this.token = token;
      },
      setUserId(userId: number) {
        this.userId = userId;
      },
    },
  },
  {
    perist: true,
  },
);
