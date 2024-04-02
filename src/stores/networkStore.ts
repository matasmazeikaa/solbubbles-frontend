import { defineStore } from "pinia";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { computed, ref, watch } from "vue";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

const RPC_ENDPOINT =
  "https://autumn-divine-firefly.solana-devnet.quiknode.pro/d5ed5a541b906e97d294509e6ff3b4057368d758/";

export const useNetworkStore = defineStore("network", () => {
  const endpoint = ref(RPC_ENDPOINT);

  const connection = computed(() => {
    return new Connection(endpoint.value);
  });

  return {
    connection,
  };
});
