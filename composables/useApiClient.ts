import { Client } from "@/api/src/client";
import { useMainStore } from "~/store/main";

export function useApiClient(
  options: {
    auth: boolean;
  } = {
    auth: true,
  },
): Client {
  const mainStore = useMainStore();
  let api;
  if (options.auth) api = new Client(mainStore.token!);
  else api = new Client();
  api.init();
  return api;
}
