import { defineStore } from "pinia";
import type { Adapter, WalletName } from "@solana/wallet-adapter-base";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import type { Cluster } from "@solana/web3.js";
import type { Ref } from "vue";
import { computed, ref, shallowRef } from "vue";
import {
  useAdapterListeners,
  useEnvironment,
  useErrorHandler,
  useMobileWalletAdapters,
  useReadyStateListeners,
  useStandardWalletAdapters,
  useTransactionMethods,
  useUnloadingWindow,
  useWalletState,
  useWrapAdaptersInWallets,
} from "@/composables";
import { WalletNotSelectedError } from "@/errors";
import type { Wallet, WalletStoreProps } from "@/types";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { cleanPiniaStores, getJWT, removeJWT, setJWT } from "@/utils/tokens";
import bs58 from "bs58";
import nacl from "tweetnacl";
import { getNonceApi, loginUserApi } from "@/api/UserApi";
import { SolanaMobileWalletAdapterWalletName } from "@solana-mobile/wallet-adapter-mobile";
import { useLocalStorage } from "@vueuse/core";
import { useBalanceStore } from "./balanceStore";

const WALLET_CONFIG: WalletStoreProps = {
  wallets: [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
  ],
  autoConnect: true,
  cluster: "devnet",
  onError: () => {},
  localStorageKey: "walletName",
};

export class SigninMessage {
  domain: any;
  publicKey: any;
  nonce: any;
  statement: any;

  constructor({ domain, publicKey, nonce, statement }: SignMessage) {
    this.domain = domain;
    this.publicKey = publicKey;
    this.nonce = nonce;
    this.statement = statement;
  }

  prepare() {
    return `${this.statement}${this.nonce}`;
  }

  async validate(signature: string) {
    const msg = this.prepare();
    const signatureUint8 = bs58.decode(signature);
    const msgUint8 = new TextEncoder().encode(msg);
    const pubKeyUint8 = bs58.decode(this.publicKey);

    return nacl.sign.detached.verify(msgUint8, signatureUint8, pubKeyUint8);
  }
}

export const useWalletStore = defineStore("wallet", () => {
  // Initial variables and loading states.
  const cluster: Ref<Cluster> = ref(WALLET_CONFIG.cluster);
  const connecting = ref<boolean>(false);
  const disconnecting = ref<boolean>(false);
  const balanceStore = useBalanceStore();

  // From raw adapters to computed list of wallets.
  const rawAdapters: Ref<Adapter[]> = shallowRef(WALLET_CONFIG.wallets);
  const rawAdaptersWithSwa = useStandardWalletAdapters(rawAdapters);
  const { isMobile, uriForAppIdentity } = useEnvironment(rawAdaptersWithSwa);
  const adapters = useMobileWalletAdapters(
    rawAdaptersWithSwa,
    isMobile,
    uriForAppIdentity,
    cluster
  );
  const wallet = shallowRef<Wallet | null>(null);

  const name: Ref<WalletName | null> = useLocalStorage<WalletName | null>(
    "walletName",
    isMobile.value ? SolanaMobileWalletAdapterWalletName : null
  );

  const isUsingMwaAdapter = computed<boolean>(
    () => name.value === SolanaMobileWalletAdapterWalletName
  );

  const isUsingMwaAdapterOnMobile = computed<boolean>(
    () => isUsingMwaAdapter.value && isMobile.value
  );

  const select = (walletName: WalletName) => {
    if (name.value !== walletName) {
      name.value = walletName;
    }

    wallet.value =
      wallets.value.find(({ adapter }) => adapter.name === name.value) ?? null;
  };

  const deselect = (force = true): void => {
    if (force || isUsingMwaAdapter.value) {
      name.value = null;
    }
  };

  const wallets = useWrapAdaptersInWallets(adapters);

  const { publicKey, connected, readyState, ready, refreshWalletState } =
    useWalletState(wallets, name);

  // Window listeners and error handling.
  const unloadingWindow = useUnloadingWindow(isUsingMwaAdapterOnMobile);
  const handleError = useErrorHandler(unloadingWindow, WALLET_CONFIG.onError);

  // Wallet listeners.
  useReadyStateListeners(wallets);
  useAdapterListeners(
    wallet,
    unloadingWindow,
    isUsingMwaAdapterOnMobile,
    deselect,
    refreshWalletState,
    handleError
  );

  // useAutoConnect(
  //   true,
  //   wallet,
  //   isUsingMwaAdapterOnMobile,
  //   connecting,
  //   connected,
  //   ready,
  //   deselect
  // );

  // Transaction methods.
  const { sendTransaction, signTransaction, signAllTransactions, signMessage } =
    useTransactionMethods(wallet, handleError);

  const anchorWallet = computed(() => {
    return publicKey.value && signTransaction.value && signAllTransactions.value
      ? {
          publicKey: publicKey.value,
          signTransaction: signTransaction.value,
          signAllTransactions: signAllTransactions.value,
        }
      : undefined;
  });

  const isLoggedIn = computed(() => connected.value && publicKey.value);

  // Connect the wallet.
  const connect = async (): Promise<void> => {
    if (name.value) {
      select(name.value);
    }

    if (
      (connected.value || connecting.value || disconnecting.value) &&
      getJWT()
    ) {
      return;
    }

    if (!wallet.value) throw handleError(new WalletNotSelectedError());

    const adapter = wallet.value.adapter;

    try {
      await adapter.connect();

      if (getJWT()) {
        return;
      }

      connecting.value = true;

      const publicKey = adapter.publicKey?.toBase58();

      if (!publicKey) throw new Error("Public key not found");

      const { data: nonceData } = await getNonceApi(publicKey);

      const message = new SigninMessage({
        domain: window.location.host,
        publicKey,
        statement: "Sign this message to sign in to the app.",
        nonce: nonceData.nonce,
      });
      const encodedMessage = new TextEncoder().encode(message.prepare());

      if (!("signMessage" in adapter))
        throw new Error("Adapter does not support signMessage");

      const signature = await adapter.signMessage(encodedMessage);
      const serializedSignature = bs58.encode(signature);

      const { data } = await loginUserApi({
        signature: serializedSignature,
        nonce: nonceData.nonce,
        publicKey,
      });

      setJWT(data.jwt);

      await balanceStore.updateAllBalances();
    } catch (error: any) {
      deselect();
      // handleError will also be called.
      throw error;
    } finally {
      connecting.value = false;
    }
  };

  // Disconnect the wallet adapter.
  const disconnect = async (): Promise<void> => {
    if (disconnecting.value || !wallet.value) return;
    try {
      disconnecting.value = true;
      await wallet.value.adapter.disconnect();
      balanceStore.$reset();
      cleanPiniaStores();
      removeJWT();
    } finally {
      disconnecting.value = false;
    }
  };

  // Return the created store.
  return {
    // Props.
    wallets,
    cluster,

    // Data.
    wallet,
    anchorWallet,
    publicKey,
    readyState,
    ready,
    connected,
    connecting,
    disconnecting,
    isLoggedIn,

    // Methods.
    select,
    connect,
    disconnect,
    sendTransaction,
    signTransaction,
    signAllTransactions,
    signMessage,
  };
});
