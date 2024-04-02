<template>
  <Leaderboard v-if="gameSettings.isGameStart" class="leaderboard" />
  <HowToPlayPopup :is-reconnected="isReconnected" />
  <YouDiedModal
    @respawn="handleRespawn"
    @to-lobby="goToLobby"
    class="modal"
    v-if="gameSettings.isDead"
  />
  <CashOutModal
    @respawn="handleRespawn"
    @to-lobby="goToLobby"
    class="modal"
    v-if="gameSettings.isCashedOut"
  />
  <CashOutButton
    v-if="!gameSettings.isCashedOut"
    class="cashout-button"
    @cash-out="handleCashout"
    :last-action-tick="player.lastActionTick"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import CashOutButton from "@/components/CashOutButton.vue";
import CashOutModal from "@/components/CashOutModal.vue";
import Leaderboard from "@/components/Leaderboard.vue";
import YouDiedModal from "@/components/YouDiedModal.vue";
import { useGameStore } from "@/stores/game";
import { useGame } from "@/hooks/useGame";
import HowToPlayPopup from "@/components/HowToPlayPopup.vue";

const gameStore = useGameStore();
const { gameSettings, player } = storeToRefs(gameStore);
const { game, isReconnected } = useGame();

const goToLobby = () => {
  game.value?.cleanUp();
  game.value?.room.leave();
  game.value = undefined;
  gameSettings.value.isGameStart = false;
  gameSettings.value.isCashedOut = false;
  gameSettings.value.isDead = false;
  document.getElementsByTagName("canvas")[0].remove();
};

const handleCashout = () => {
  game.value?.cashOut();
};

const handleRespawn = () => {
  game.value?.rejoin();
};
</script>

<style lang="scss" scoped>
.modal {
  position: absolute;
  z-index: 10;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 50%;
}

.cashout-button {
  position: absolute;
  z-index: 10;
  right: 4rem;
  bottom: 4rem;
}
</style>
