import type { User } from "@/types";
import { api } from "./api";

const TRANSACTION_API = "/transaction";
const PROCESS_TRANSACTION_API = `${TRANSACTION_API}/process-transaction`;
const GET_TRANSACTION_API = `${TRANSACTION_API}`;
const USER_WITHDRAW_ROUTE = `${TRANSACTION_API}/sign-withdraw-transaction`;

export const processTransactionApi = (transactionHash: string) =>
  api.post<{ user: User }>(PROCESS_TRANSACTION_API, { transactionHash });

export const getTransactionApi = async (transactionSignature: string) =>
  api.get(`${GET_TRANSACTION_API}/${transactionSignature}`);

export const signWithdrawTransactionUserApi = ({
  rawTransaction,
  splLamportsWithdrawAmount,
}: {
  rawTransaction: string;
  splLamportsWithdrawAmount: number;
}) =>
  api.post<{ transactionBuffer: string }>(USER_WITHDRAW_ROUTE, {
    rawTransaction,
    splLamportsWithdrawAmount,
  });
