import { api } from "./api";

interface UserLogin {
  publicKey: string;
  signature: string;
  nonce: number;
}

interface Transaction {
  nonce: number;
  sender: string;
  receiver: string;
  gasLimit: number;
  chainID: string;
  data?: string;
  signature: string;
}

const USER_ROUTE = `/user`;
const USER_LOGIN_ROUTE = `${USER_ROUTE}/login`;
const USER_WITHDRAW_ROUTE = `${USER_ROUTE}/sign-withdraw`;
const USER_GET_NONCE = `${USER_ROUTE}/nonce`;

export const loginUserApi = (user: UserLogin) =>
  api.post<{
    user: any;
    jwt: string;
  }>(USER_LOGIN_ROUTE, user);

export const getUserDataApi = () =>
  api.get<{
    publicKey: string;
    depositedTokens: {
      amount: string;
      decimals: number;
      uiAmount: number;
      uiAmountString: string;
    };
  }>(USER_ROUTE);

export const signWithdrawTransactionUserApi = (egldFromAmount: number) =>
  api.post<Transaction>(USER_WITHDRAW_ROUTE, { egldFromAmount });

export const getNonceApi = (publicKey: string) =>
  api.post<{ nonce: number }>(USER_GET_NONCE, {
    publicKey,
  });
