import { useMainStore } from "~/store/main";

export const useLoggedIn = () => {
  const mainStore = useMainStore();
  return mainStore.token !== null;
};
