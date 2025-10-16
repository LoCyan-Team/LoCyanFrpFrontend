interface MainState {
  token: string | null;
  userId: number | null;
  site: {
    broadcast: string | null;
    announcement: string | null;
  };
}

const defaultState = {
  token: null,
  userId: null,
  site: {
    broadcast: null,
    announcement: null,
  },
};

export const useMainStore = defineStore(
  "main",
  () => {
    const state = reactive<MainState>({ ...defaultState });

    function $reset() {
      Object.assign(state, defaultState);
    }

    return { ...toRefs(state), $reset };
  },
  {
    persist: true,
  },
);
