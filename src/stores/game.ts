import type { TopPlayerState } from "@/game/StateTypes/TopPlayerState";
import { defineStore } from "pinia";
import type { Application } from "pixi.js";
import { ref } from "vue";

const GAME_DEFAULT_STATE = {
  isDead: false,
  isDeadLoading: false,
  isCashedOut: false,
  isCashOutLoading: false,
  isGameStart: false,
  splTokens: 0,
};

const PLAYER_DEFAULT_STATE = {
  splTokens: 0,
  balanceSplTokens: 0,
  lastActionTick: 0,
};

export const useGameStore = defineStore("game", () => {
  const gameSettings = ref(GAME_DEFAULT_STATE);
  const player = ref(PLAYER_DEFAULT_STATE);
  const leaderboard = ref<{ [x: string]: TopPlayerState }>({});
  const application = ref<Application>();
  const lastActionTick = ref(0);
  const splTokenEntryFee = ref(0);

  const setGame = (app: Application) => {
    application.value = app;
  };

  return {
    gameSettings,
    player,
    leaderboard,
    lastActionTick,
    splTokenEntryFee,
    setGame,
  };
});
