import type { Application } from "@/game/Application";
import { useBalanceStore } from "@/stores/balanceStore";
import { useGameStore } from "@/stores/game";
import { ref } from "vue";

const game = ref<Application>();
const lastActionTick = ref(0);
const roomSplTokenEntryFee = ref(0);
const isReconnected = ref(false);

export const useGame = () => {
  const setGame = (app: Application) => {
    game.value = app;
  };

  const goToLobby = () => {
    game.value?.cleanUp();
    game.value?.room?.leave();
    game.value = undefined;
    useGameStore().gameSettings.isGameStart = false;
    useGameStore().gameSettings.isCashedOut = false;
    useGameStore().gameSettings.isDead = false;
    document.getElementsByTagName("canvas")[0].remove();
    useBalanceStore().updateAllBalances();
  };

  return {
    game,
    roomSplTokenEntryFee,
    lastActionTick,
    isReconnected,
    goToLobby,
    setGame,
  };
};
