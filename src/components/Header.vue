<template>
  <nav class="header">
    <template v-if="walletStore.isLoggedIn">
      <div class="header__balance-container mr-24">
        <SolanaLogo class="header__logo" />
        Game balance
        <Tokens
          :lamports="balanceStore.depositedTokenBalance.amount"
          class="header__balance-amount small small--bold"
        />
      </div>
      <Button
        class="mr-16"
        type="header"
        title="Withdraw"
        :to="{
          name: 'withdraw',
        }"
      />
      <Button
        class="mr-16"
        type="header"
        title="Deposit"
        :to="{
          name: 'deposit',
        }"
      />
      <Button
        type="header"
        title="Request (BETA) Tokens"
        :to="{
          name: 'beta-tokens',
        }"
      />
    </template>
    <div class="header__wallet-button">
      <WalletMultiButton />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useBalanceStore } from "@/stores/balanceStore";
import WalletMultiButton from "./WalletMultiButton.vue";

import SolanaLogo from "@/assets/solana-logo.svg?component";
import Button from "@/components/Button.vue";
import Tokens from "./Tokens.vue";
import { useWalletStore } from "@/stores/walletStore";

const balanceStore = useBalanceStore();
const walletStore = useWalletStore();
</script>

<style lang="scss">
.header {
  z-index: 10;
  top: 0;
  background-color: #161521;
  padding: 2rem 4rem;
  display: flex;

  @media (max-width: 500px) {
    display: grid;
    grid-gap: 1.6rem;
    grid-row: 1 / span 2;
    height: fit-content;
  }

  &__wallet-button {
    margin-left: auto;
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

  &__ping-container {
    display: flex;
    align-items: center;
    margin-left: auto;
  }

  &__ping-circle {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;

    &--good {
      background: #00ff00;
    }

    &--average {
      background: orange;
    }

    &--bad {
      background: red;
    }
  }
}
</style>
