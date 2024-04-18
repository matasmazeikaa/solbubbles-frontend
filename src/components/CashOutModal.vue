<template>
  <FunctionalBox
    title="Cashed out!"
    class="cashed-out"
    :is-close-visible="false"
  >
    <label class="label">Amount won</label>
    <div class="h1 mb-16">
      <Loader v-if="gameStore.gameSettings.isCashOutLoading" />
      <Tokens v-else :tokens="player.splTokens" class="h1 mb-16" />
    </div>
    <label class="label">Balance</label>
    <div class="h1 mb-16">
      <Loader v-if="gameStore.gameSettings.isCashOutLoading" />
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
      :is-disabled="gameStore.gameSettings.isCashOutLoading"
    >
      Re-enter for{{ " " }}
      <Tokens :tokens="roomSplTokenEntryFee" />
    </Button>
    <Button
      @click="$emit('to-lobby')"
      :is-disabled="gameStore.gameSettings.isCashOutLoading"
      is-lobby
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
import Loader from "./Loader.vue";

const gameStore = useGameStore();
const { roomSplTokenEntryFee } = useGame();

const balanceStore = useBalanceStore();

const { player } = storeToRefs(gameStore);
</script>

<style lang="scss">
.cashed-out {
  max-width: 40rem;
  background-color: #161521f5;
}
</style>
