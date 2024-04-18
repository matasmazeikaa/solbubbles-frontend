<template>
  <FunctionalBox
    title="You've been swallowed"
    class="you-died"
    :is-close-visible="false"
  >
    <label class="label">Amount lost</label>
    <div class="h1 mb-16">
      <Loader v-if="gameStore.gameSettings.isDeadLoading" />
      <Tokens v-else :tokens="gameStore.player.splTokens" class="h1 mb-16" />
    </div>
    <label class="label">Balance</label>
    <div class="h1 mb-16">
      <Loader v-if="gameStore.gameSettings.isDeadLoading" />
      <Tokens
        v-else
        :tokens="balanceStore.depositedTokenBalance.uiAmount"
        class="h1 mb-16"
      />
    </div>
    <Button
      @click="$emit('respawn')"
      class="width-100 mb-16"
      is-lobby
      :is-disabled="gameStore.gameSettings.isDeadLoading"
    >
      Re-enter for{{ " " }}
      <Tokens :tokens="roomSplTokenEntryFee" />
    </Button>
    <Button
      @click="$emit('to-lobby')"
      :is-disabled="gameStore.gameSettings.isDeadLoading"
      is-lobby
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
import { useGameStore } from "@/stores/game";
import Loader from "./Loader.vue";

const gameStore = useGameStore();
const { roomSplTokenEntryFee } = useGame();
const balanceStore = useBalanceStore();
</script>

<style lang="scss">
.you-died {
  background-color: #161521f5 !important;
  padding: 1.6rem;
  position: absolute;
  right: 0;
  z-index: 10;
  max-width: 40rem;
}
</style>
