import { computed, ref } from "vue";
import { useNetworkStore } from "./networkStore";
import { useWalletStore } from "./walletStore";
import { defineStore } from "pinia";
import {
  GetProgramAccountsFilter,
  LAMPORTS_PER_SOL,
  PublicKey,
  TokenAmount,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getAccount,
  getMint,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { PINIA_PERSIST_STORE, TOKEN_CONFIG } from "@/constants";
import { getUserDataApi } from "@/api/UserApi";

export const LAMPORTS_PER_TOKEN = 1000000000;
export const TOKEN_ADDRESS = new PublicKey(
  "E4tg4HjByxHfZNLmh5ZHR7aJs5XCXJVADV4Nd8HB73sL"
);

export const useBalanceStore = defineStore(
  "balance",
  () => {
    const solLamports = ref(0);
    const tokenBalance = ref<TokenAmount>({
      amount: "0",
      decimals: 0,
      uiAmount: 0,
      uiAmountString: "0",
    });
    const depositedTokenBalance = ref<TokenAmount>({
      amount: "0",
      decimals: 0,
      uiAmount: 0,
      uiAmountString: "0",
    });

    const walletStore = useWalletStore();
    const networStore = useNetworkStore();

    const solBalance = computed(() => {
      return (solLamports.value / LAMPORTS_PER_SOL).toFixed(2);
    });

    const userATA = computed(() => {
      if (!walletStore.wallet?.adapter.publicKey) {
        return undefined;
      }

      return getAssociatedTokenAddressSync(
        TOKEN_CONFIG.MINT_PUBLIC_KEY,
        walletStore.wallet?.adapter.publicKey
      );
    });

    const updateSolBalance = async () => {
      console.log(walletStore.wallet?.adapter.publicKey, "public key");

      if (!walletStore.wallet?.adapter.publicKey) {
        return;
      }

      const lamports = await networStore.connection.getBalance(
        walletStore.wallet.adapter.publicKey
      );

      solLamports.value = lamports;

      console.log("Balance updated", lamports);
    };

    async function getTokenBalanceSpl(connection, tokenAccount) {
      const info = await getAccount(connection, tokenAccount);
      const amount = Number(info.amount);
      const mint = await getMint(connection, info.mint);
      const balance = amount / 10 ** mint.decimals;
      console.log("Balance (using Solana-Web3.js): ", balance);
      return balance;
    }

    const updateTokenBalance = async () => {
      if (!userATA.value) {
        return;
      }

      console.log("Using SPL-Token: ", userATA.value.toBase58());

      // await getTokenBalanceSpl(networStore.connection, address);

      try {
        const info = await networStore.connection.getTokenAccountBalance(
          userATA.value
        );

        tokenBalance.value = {
          amount: info.value.amount,
          decimals: info.value.decimals,
          uiAmount: info.value.uiAmount,
          uiAmountString: info.value.uiAmountString,
        };
        console.log(info);
      } catch (error: any) {
        console.error(error);
      }
    };

    const updateDepositedUserTokens = async () => {
      try {
        const { data } = await getUserDataApi();

        depositedTokenBalance.value = data.depositedTokens;
      } catch (error: any) {
        console.error(error);
      }
    };

    const updateAllBalances = async () => {
      Promise.all([
        await updateSolBalance(),
        await updateTokenBalance(),
        await updateDepositedUserTokens(),
      ]);
    };

    const $reset = () => {
      solLamports.value = 0;
      tokenBalance.value = {
        amount: "0",
        decimals: 0,
        uiAmount: 0,
        uiAmountString: "0",
      };
      depositedTokenBalance.value = {
        amount: "0",
        decimals: 0,
        uiAmount: 0,
        uiAmountString: "0",
      };
    };

    return {
      solBalance,
      solLamports,
      tokenBalance,
      depositedTokenBalance,
      userATA,
      $reset,
      updateAllBalances,
      updateSolBalance,
      getTokenBalanceSpl,
      updateTokenBalance,
      updateDepositedUserTokens,
    };
  },
  {
    persist: {
      key: PINIA_PERSIST_STORE.BALANCE,
    },
  }
);
