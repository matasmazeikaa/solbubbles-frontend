import { ref } from "vue";

export const useLoading = () => {
  const isLoading = ref(false);

  const setIsLoading = (value: boolean) => {
    isLoading.value = value;
  };

  return {
    isLoading,
    setIsLoading,
  };
};
