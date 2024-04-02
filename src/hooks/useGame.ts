import type { Application } from "@/game/Application";
import { ref } from "vue";

const game = ref<Application>();
const lastActionTick = ref(0);
const roomSplTokenEntryFee = ref(0);
const isReconnected = ref(false);

export const useGame = () => {
  const setGame = (app: Application) => {
    game.value = app;
  };

  return {
    game,
    roomSplTokenEntryFee,
    lastActionTick,
    isReconnected,
    setGame,
  };
};
