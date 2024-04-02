<template>
  <div class="leaderboard">
    <div class="leaderboard__title-container">
      <h5 class="leaderboard__title">Leaderboard</h5>
      <Ping />
    </div>
    <p
      class="leaderboard__player"
      :class="{
        'leaderboard__player--current': game?.room.sessionId === player.id,
      }"
      v-for="(player, index) in leaderboard"
      :key="player.id"
    >
      {{ index + 1 }}. {{ formatAddress(player.publicKey) }}:
      {{ Math.ceil(player.massTotal) }}
      {{ player.splTokens }}
      {{ TOKEN_CONFIG.LABEL }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { formatAddress } from "@/utils/format";
import { useGame } from "@/hooks/useGame";
import Ping from "./Ping.vue";
import { computed } from "vue";
import { TOKEN_CONFIG } from "@/constants";

const { game } = useGame();

const leaderboard = computed(() => {
  console.log(game.value?.leaderboard);
  return game.value?.leaderboard as any;
});
</script>

<style lang="scss">
.leaderboard {
  background-color: #161521cc;
  padding: 1.6rem;
  position: absolute;
  top: 4rem;
  right: 4rem;
  z-index: 10;
  border-radius: 1.6rem;
  min-width: 320px;

  &__title-container {
    display: flex;
    align-items: center;
    margin-bottom: 1.6rem;
  }

  &__title {
    font-weight: bold;
    font-size: 17px;
  }

  &--left {
    left: 4rem;
    right: 0;
  }

  &__player {
    &--current {
      font-weight: bold;
    }
  }
}
</style>
