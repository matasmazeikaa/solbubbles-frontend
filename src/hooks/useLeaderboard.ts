import type { TopPlayerState } from "@/game/StateTypes/TopPlayerState";
import { ref } from "vue";

const leaderboard = ref<TopPlayerState[]>([]);

export const useLeaderboard = () => {
  return {
    leaderboard,
  };
};
