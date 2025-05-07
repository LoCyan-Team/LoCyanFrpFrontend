interface Group {
  id: number;
  name: string;
}

interface Limit {
  tunnel: number;
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

export const useUserStore = defineStore(
  "user",
  () => {
    const state = reactive<UserState>({
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
      traffic: 0,
      avatar: "https://weavatar.com/avatar/",
      registerTime: null,
    });

    return { ...toRefs(state) };
  },
  {
    persist: true,
  },
);
