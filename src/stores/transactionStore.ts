import { getTransactionApi } from "@/api/TransactionApi";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useBalanceStore } from "./balanceStore";
import { PINIA_PERSIST_STORE } from "@/constants";
import { useToast } from "vue-toast-notification";

export const useTransactionStore = defineStore(
  "transactionStore",
  () => {
    const balanceStore = useBalanceStore();
    const toast = useToast();

    const transaction = ref(null);
    const transactions = ref<
      {
        signature: string;
        status: "completed" | "processing";
      }[]
    >([]);

    const latestTransaction = computed(
      (): {
        signature: string;
        status: "completed" | "processing";
      } | null => {
        return transactions.value[transactions.value.length - 1];
      }
    );

    const addProcessingTransaction = (transactionSignature: string) => {
      transactions.value.push({
        signature: transactionSignature,
        status: "processing",
      });

      pollTransactionUntillFound(transactionSignature);
    };

    const setStatusCompleted = (transactionSignature: string) => {
      transactions.value = transactions.value.map((transaction) => {
        if (transaction.signature === transactionSignature) {
          return {
            ...transaction,
            status: "completed",
          };
        }
        return transaction;
      });
    };

    const removeProcessingTransaction = (transactionSignature: string) => {
      transactions.value = transactions.value.filter(
        (transaction) => transaction.signature !== transactionSignature
      );
    };

    const pollTransactionUntillFound = async (transactionSignature: string) => {
      try {
        await getTransactionApi(transactionSignature);
        await balanceStore.updateAllBalances();

        setStatusCompleted(transactionSignature);

        // Timeout for animation
        await new Promise((resolve) => setTimeout(resolve, 2000));

        removeProcessingTransaction(transactionSignature);
      } catch (error) {
        if (
          (error.response as any)?.data?.errorMessage ===
          "Transaction not found"
        ) {
          // Transaction not found, poll again
          setTimeout(() => {
            pollTransactionUntillFound(transactionSignature);
          }, 5000);

          return;
        }

        toast.error(
          "Transaction has received an unexpeceted error while being processed. And has not funded your account. Please try contacting support, this was unexpected."
        );

        removeProcessingTransaction(transactionSignature);

        console.log(error);
        console.error(error);
      }
    };

    return {
      transaction,
      transactions,
      latestTransaction,
      pollTransactionUntillFound,
      addProcessingTransaction,
    };
  },
  {
    persist: {
      key: PINIA_PERSIST_STORE.TRANSACTION,
    },
  }
);
