interface Group {
  id: number;
  name: string;
}

interface Limit {
  tunnel: number | null;
  inbound: number;
  outbound: number;
}

interface UserState {
  username: string | null;
  email: string | null;
  frpToken: string | null;
  group: Group;
  limit: Limit;
  traffic: number;
  avatar: string;
  registerTime: string | null;
}

const defaultState = {
  username: null,
  email: null,
  frpToken: null,
  group: {
    id: 0,
    name: "未知权限组",
  },
  limit: {
    tunnel: null,
    inbound: 0,
    outbound: 0,
  },
  traffic: 0,
  avatar: "https://weavatar.com/avatar/",
  registerTime: null,
};

export const useUserStore = defineStore(
  "user",
  () => {
    const state = reactive<UserState>({ ...defaultState });

    function $reset() {
      Object.assign(state, defaultState);
    }

    return { ...toRefs(state), $reset };
  },
  {
    persist: true,
  },
);
