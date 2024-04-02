<template>
  <FunctionalBox
    title="You've been swallowed"
    class="you-died"
    :is-close-visible="false"
  >
    <label class="label">Amount lost</label>
    <Tokens class="h1 mb-24" :tokens="roomSplTokenEntryFee" />
    <label class="label">Balance</label>
    <Tokens
      class="h1 mb-24"
      :tokens="balanceStore.depositedTokenBalance.uiAmount"
    />
    <Button @click="$emit('respawn')" class="width-100 mb-16">
      Re-enter for
      <Tokens :tokens="roomSplTokenEntryFee" />
    </Button>
    <Button
      @click="$emit('to-lobby')"
      title="Return to lobby"
      type="secondary"
      class="width-100"
    />
  </FunctionalBox>
</template>

<script setup lang="ts">
import FunctionalBox from "@/components/FunctionalBox.vue";
import Button from "@/components/Button.vue";
import { useGame } from "@/hooks/useGame";
import Tokens from "@/components/Tokens.vue";
import { useBalanceStore } from "@/stores/balanceStore";

const { roomSplTokenEntryFee } = useGame();
const balanceStore = useBalanceStore();

console.log(balanceStore.depositedTokenBalance);
</script>

<style lang="scss">
.you-died {
  background-color: rgba($color: #000000, $alpha: 0.4);
  padding: 1.6rem;
  position: absolute;
  right: 0;
  z-index: 10;
  max-width: 40rem;
}
</style>
