<template>
  <FunctionalBox
    title="Cashed out!"
    class="cashed-out"
    :is-close-visible="false"
  >
    <label class="label">Amount won</label>
    <Tokens :tokens="player.splTokens" class="h1 mb-16" />
    <label class="label">Balance</label>
    <Tokens
      :tokens="balanceStore.depositedTokenBalance.uiAmount"
      class="h1 mb-16"
    />
    <Button @click="$emit('respawn')" class="width-100 mb-16">
      Re-enter for{{ " " }}
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
import { useGameStore } from "@/stores/game";
import { storeToRefs } from "pinia";
import FunctionalBox from "@/components/FunctionalBox.vue";
import Button from "@/components/Button.vue";
import { useGame } from "@/hooks/useGame";
import { useBalanceStore } from "@/stores/balanceStore";
import Tokens from "@/components/Tokens.vue";

const gameStore = useGameStore();
const { roomSplTokenEntryFee } = useGame();

const balanceStore = useBalanceStore();

const { player } = storeToRefs(gameStore);
</script>

<style lang="scss">
.cashed-out {
  max-width: 40rem;
}
</style>
