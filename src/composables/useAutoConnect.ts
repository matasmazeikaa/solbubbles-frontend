import type { Wallet } from "@/types";
import type { SolanaMobileWalletAdapter } from "@solana-mobile/wallet-adapter-mobile";
import type { Ref } from "vue";
import { ref, watch, watchEffect } from "vue";

/**
 * Handles the auto-connect logic of the wallet.
 */
export function useAutoConnect(
  initialAutoConnect: boolean | Ref<boolean>,
  wallet: Ref<Wallet | null>,
  isUsingMwaAdapterOnMobile: Ref<boolean>,
  connecting: Ref<boolean>,
  connected: Ref<boolean>,
  ready: Ref<boolean>,
  deselect: () => void
) {
  const autoConnect = ref(initialAutoConnect);
  const hasAttemptedToAutoConnect = ref(false);

  // When the adapter changes, clear the `autoConnect` tracking flag.
  watch(wallet, () => {
    hasAttemptedToAutoConnect.value = false;
  });

  // If autoConnect is enabled, try to connect when the wallet adapter changes and is ready.
  watchEffect(() => {
    console.log("auto conenct");

    console.log(wallet.value);
    console.log(ready.value);
    console.log(connected.value);
    console.log(connecting.value);

    if (
      hasAttemptedToAutoConnect.value ||
      !wallet.value ||
      !ready.value ||
      connected.value ||
      connecting.value
    ) {
      return;
    }

    console.log("passed");

    (async () => {
      if (!wallet.value) return;

      connecting.value = true;
      hasAttemptedToAutoConnect.value = true;

      try {
        if (isUsingMwaAdapterOnMobile.value) {
          await (
            wallet.value.adapter as SolanaMobileWalletAdapter
          ).autoConnect();
        } else {
          await wallet.value.adapter.connect();
        }
      } catch (error: any) {
        deselect();
        // Don't throw error, but handleError will still be called.
      } finally {
        connecting.value = false;
      }
    })();
  });

  return autoConnect;
}
