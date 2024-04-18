import { getJWT } from "@/utils/tokens";
import axios from "axios";
import { useWalletStore } from "@/stores/walletStore";
import { useToast } from "vue-toast-notification";

const STATUS_UNAUTHORIZED = 401;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authoorization: `Bearer ${getJWT()}`,
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => ({
  ...config,
  headers: { ...config.headers, Authorization: `Bearer ${getJWT()}` },
}));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const walletStore = useWalletStore();
    const toast = useToast();

    if (error.response.status === STATUS_UNAUTHORIZED) {
      await walletStore.disconnect();

      toast.error("Unauthorized request");
    }

    return Promise.reject(error);
  }
);
