<script lang="ts" setup>
import { computed } from "vue";
import WalletIcon from "./WalletIcon.vue";
import { useWalletStore } from "@/stores/walletStore";

interface Props {
  disabled: boolean;
}

defineProps<Props>();
const emit = defineEmits(["click"]);

const walletStore = useWalletStore();

const content = computed(() => {
  if (walletStore.connecting) return "Connecting ...";
  if (walletStore.connected) return "Connected";
  if (walletStore.wallet) return "Connect";
  return "Connect Wallet";
});

const onClick = (event: MouseEvent) => {
  emit("click", event);
  ("connecting store?");
  if (event.defaultPrevented) return;

  ("connecting store?");

  walletStore.connect().catch(() => {});
};
</script>

<template>
  <slot>
    <button
      class="swv-button swv-button-trigger"
      :disabled="
        disabled ||
        !walletStore.wallet ||
        walletStore.connecting ||
        walletStore.connected
      "
      @click="onClick"
    >
      <wallet-icon
        v-if="walletStore.wallet"
        :wallet="walletStore.wallet"
      ></wallet-icon>
      <p v-text="content"></p>
    </button>
  </slot>
</template>
