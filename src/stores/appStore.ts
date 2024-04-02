import { defineStore } from "pinia";
import { useBalanceStore } from "./balanceStore";
import { useWalletStore } from "./walletStore";

export const useAppStore = defineStore("app", () => {
  const balanceStore = useBalanceStore();
  const walletStore = useWalletStore();

  const initApp = async () => {
    try {
      // await login();
      await walletStore.connect();

      Promise.all([await balanceStore.updateAllBalances()]);
    } catch (error: any) {
      console.error(error);
    }
  };

  return {
    initApp,
  };
});
