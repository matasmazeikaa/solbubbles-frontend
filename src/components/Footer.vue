<template>
  <nav class="footer">
    <template v-if="walletStore.isLoggedIn">
      <div class="footer__balance-container mr-32 small">
        <SolanaLogo class="footer__logo" />
        Wallet balance
        <Tokens
          :lamports="balanceStore.tokenBalance.amount"
          class="footer__balance-amount small small--bold"
        />
      </div>
      <div class="footer__balance-container mr-24 small">
        <SolanaLogo class="footer__logo" />
        Wallet address:
        <span class="footer__balance-amount small small--bold"
          >{{ walletStore.publicKey }}
        </span>
      </div>
    </template>
  </nav>
</template>

<script setup lang="ts">
import SolanaLogo from "@/assets/solana-logo.svg?component";
import { useBalanceStore } from "@/stores/balanceStore";
import { useWalletStore } from "@/stores/walletStore";
import Tokens from "./Tokens.vue";

const balanceStore = useBalanceStore();
const walletStore = useWalletStore();
</script>

<style lang="scss">
.footer {
  z-index: 10;
  top: 0;
  background-color: #161521;
  padding: 2rem 4rem;
  display: flex;

  @media (max-width: 500px) {
    display: grid;
  }

  &__balance-container {
    display: flex;
    align-items: center;
  }

  &__balance-amount {
    margin-left: 0.4rem;
  }

  &__logo {
    margin-right: 1.2rem;
  }

  &--in-game {
    position: absolute;
  }
}
</style>
