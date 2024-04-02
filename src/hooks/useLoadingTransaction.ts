import { ref } from "vue";

export const TRANSACTION_STATUS = {
  PROCCESSING: "processing",
  COMPLETED: "completed",
};

export const useLoadingTransaction = () => {
  const status = ref<string | null>(null);

  const setLoadingStatus = (value: string | null) => {
    status.value = value;
  };

  return {
    status,
    setLoadingStatus,
  };
};
