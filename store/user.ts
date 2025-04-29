export const useUserStore = defineStore(
  "user",
  {
    state: () => ({
      username: null,
      email: null,
      frpToken: null,
      limit: {
        tunnels: 0,
        inbound: 0,
        outbound: 0,
      },
      group: {
        id: 0,
        name: "未知权限组",
      },
      traffic: null,
      avatar: "https://weavatar.com/avatar/",
    }),
    getters: {},
    actions: {
      setUsername(username: string) {
        this.username = username;
      },
      setEmail(email: string) {
        this.email = email;
      },
      setFrpToken(frpToken: string) {
        this.frpToken = frpToken;
      },
      setLimitTunnels(tunnels: number) {
        this.limit.tunnels = tunnels;
      },
      setLimitInbound(inbound: number) {
        this.limit.inbound = inbound;
      },
      setLimitOutbound(outbound: number) {
        this.limit.outbound = outbound;
      },
    },
  },
  {
    perist: true,
  },
);
