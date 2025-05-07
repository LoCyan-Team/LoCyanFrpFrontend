interface MainState {
  token: string | null;
  userId: number | null;
  site: {
    broadcast: string | null;
    announcement: string | null;
  };
}

export const useMainStore = defineStore(
  "main",
  () => {
    const state = reactive<MainState>({
      token: null,
      userId: null,
      site: {
        broadcast: null,
        announcement: null,
      },
    });

    return { ...toRefs(state) };
  },
  {
    persist: true,
  },
);
