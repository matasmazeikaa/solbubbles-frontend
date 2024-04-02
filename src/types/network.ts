import type { WalletProvider } from "@elrondnetwork/erdjs-web-wallet-provider";
import type { WalletConnectProvider } from "@elrondnetwork/erdjs-wallet-connect-provider";
import type { ExtensionProvider } from "@elrondnetwork/erdjs-extension-provider";
import type { ApiNetworkProvider } from "@elrondnetwork/erdjs-network-providers";
import type { ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers";

export interface BaseNetworkType {
  id: string;
  shortId: string;
  name: string;
  egldLabel: string;
  egldDenomination: string;
  decimals: string;
  gasPerDataByte: string;
  walletConnectDeepLink: string;
  walletAddress: string;
  API_ADDRESS: string;
  explorerAddress: string;
  API_TIMEOUT: string;
}

export interface NetworkType extends BaseNetworkType {
  walletConnectBridgeAddresses: string[];
}

export type DappProvider =
  | ExtensionProvider
  | WalletConnectProvider
  | WalletProvider;
export type NetworkProvider = ApiNetworkProvider | ProxyNetworkProvider;
