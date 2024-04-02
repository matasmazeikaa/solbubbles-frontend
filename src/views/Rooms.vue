<template>
  <Box class="container">
    <div v-if="isConnectedInRoom">
      <h2 class="h2 h2--center mb-32">You left a game!</h2>
      <p class="small text-center mb-32">
        You have 30s to reconnect the game that you left! If someone didn't
        already eat you...
      </p>
      <Button
        class="rooms__button"
        is-lobby
        title="Reconnect"
        :is-loading="isLoadingRoomConnect"
        @click="handleReconnect"
      />
    </div>
    <div v-else>
      <h2 class="h2 h2--center mb-32">Rooms</h2>
      <p class="small text-center mb-32">
        {{ roomText }}
      </p>
      <div class="rooms">
        <div v-for="room in computedRooms" :key="room.id" class="rooms__room">
          <LockedIcon v-if="room.isLocked" class="rooms__lock" />
          <label class="rooms__label small">Entry balance</label>
          <Tokens :tokens="room.roomSplTokenEntryFee" class="h1 mb-16" />
          <label class="rooms__label">Players</label>
          <h1 class="h1 mb-24">{{ room.labelUsers }}</h1>
          <Button
            class="rooms__button"
            :is-disabled="room.isLocked"
            is-lobby
            :is-loading="isLoadingRoomConnect"
            :title="room.buttonText"
            @click="room.handleClick"
          />
        </div>
      </div>
    </div>
  </Box>
</template>

<script lang="ts" setup>
import type { Room } from "@/types";
import { computed, ref } from "vue";
import Box from "@/components/Box.vue";
import Button from "@/components/Button.vue";
import { MAX_USERS_IN_ROOM } from "@/constants";
import LockedIcon from "@/components/LockedIcon.vue";
import { useWebsocketClient } from "@/hooks/useWebsocketClient";
import { formatFiat } from "@/utils/currency";
import { LAMPORTS_PER_TOKEN, useBalanceStore } from "@/stores/balanceStore";
import Tokens from "@/components/Tokens.vue";
import { useWalletStore } from "@/stores/walletStore";

const ROOM = {
  gameRoom1: {
    id: "game-room-1",
    roomSplTokenEntryFee: 25,
  },
  gameRoom2: {
    id: "game-room-2",
    roomSplTokenEntryFee: 100,
  },
} as const;

defineProps({
  isLoadingRoomConnect: Boolean,
});

const { allRooms } = useWebsocketClient();
const walletStore = useWalletStore();
const balanceStore = useBalanceStore();

const reconnectionData = ref({
  roomId: "",
  sessionId: "",
});

const emits = defineEmits(["start-game", "reconnect"]);

const checkIfConnectedInRoom = async () => {
  try {
    reconnectionData.value.roomId = localStorage.getItem("roomId") || "";
    reconnectionData.value.sessionId = localStorage.getItem("sessionId") || "";
  } catch (error) {
    console.error(error);
  }
};

const isConnectedInRoom = computed(() => {
  return reconnectionData.value.roomId && reconnectionData.value.sessionId;
});

const handleReconnect = () => {
  emits("reconnect", {
    roomId: reconnectionData.value.roomId,
    sessionId: reconnectionData.value.sessionId,
  });

  localStorage.removeItem("roomId");
  localStorage.removeItem("sessionId");
  reconnectionData.value = {
    roomId: "",
    sessionId: "",
  };
};

const roomText = computed(() => {
  if (walletStore.isLoggedIn) {
    return "Select a room to join. Entry balance is an amount you’ll start the game with.";
  }

  return "Please connect a wallet to join a room.";
});

const computedRooms = computed(() =>
  Object.values(ROOM).map((room) => {
    const isLocked =
      !walletStore.isLoggedIn ||
      (balanceStore.depositedTokenBalance.uiAmount || 0) < room.roomSplTokenEntryFee;

    const activeRoom = allRooms.value.find(
      (activeRoom) => activeRoom.name === room.id
    );

    const buttonText = isLocked ? "Locked" : "Join";

    return {
      ...room,
      isLocked,
      labelAmount: room.roomSplTokenEntryFee,
      labelUsers: `${activeRoom?.clients ?? 0} / ${MAX_USERS_IN_ROOM}`,
      buttonText,
      handleClick: () =>
        emits("start-game", {
          id: room.id,
          gameTokenLamports: room.roomSplTokenEntryFee,
        }),
    };
  })
);

checkIfConnectedInRoom();
</script>

<style lang="scss" scoped>
.container {
  max-width: 65.6rem;
  width: 100%;
  margin: 0 auto;

  @media screen and (max-width: 768px) {
    background-color: transparent;
    padding: 0;
  }
}

.rooms {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1.6rem;

  margin-right: -1.6rem;

  &__lock {
    right: 1.6rem;
    top: 1.6rem;
    position: absolute;
  }

  &__room {
    border: 1px solid $background-secondary-color;
    border-radius: 2.4rem;
    padding: 4rem;
    margin-right: 1.6rem;
    width: 100%;
  }

  &__label {
    color: $secondary-text;
  }

  &__button {
    width: 100%;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    margin: 0;

    &__room {
      background-color: $background-color;
      margin: 0;
    }
  }
}
</style>
