export const useUserStore = defineStore(
  "user",
  {
    state: () => ({
      username: null,
      email: null,
      frpToken: null,
      inbound: 0,
      outbound: 0,
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
      setInbound(inbound: number) {
        this.inbound = inbound;
      },
      setOutbound(outbound: number) {
        this.outbound = outbound;
      },
    },
  },
  {
    perist: true,
  },
);
