import { TOKEN_TO_WEI } from "@/constants";

export const formatWei = (wei: number, fixed = 18) => {
  return parseFloat((wei / TOKEN_TO_WEI).toFixed(fixed));
};
