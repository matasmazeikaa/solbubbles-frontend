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
import { computed, ref } from "vue";
import Box from "@/components/Box.vue";
import Button from "@/components/Button.vue";
import { MAX_USERS_IN_ROOM } from "@/constants";
import LockedIcon from "@/components/LockedIcon.vue";
import { useWebsocketClient } from "@/hooks/useWebsocketClient";
import { useBalanceStore } from "@/stores/balanceStore";
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
  gameRoom3: {
    id: "game-room-3",
    roomSplTokenEntryFee: 500,
  },
} as const;

defineProps({
  isLoadingRoomConnect: Boolean,
});

const { allRooms } = useWebsocketClient();
const walletStore = useWalletStore();
const balanceStore = useBalanceStore();

const reconnectionToken = ref("");

const emits = defineEmits(["start-game", "reconnect"]);

const checkIfConnectedInRoom = async () => {
  try {
    reconnectionToken.value = localStorage.getItem("reconnectionToken") || "";
  } catch (error) {
    console.error(error);
  }
};

const isConnectedInRoom = computed(() => {
  return reconnectionToken.value;
});

const handleReconnect = () => {
  emits("reconnect", reconnectionToken.value);

  localStorage.removeItem("reconnectionToken");
  reconnectionToken.value = "";
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
      (balanceStore.depositedTokenBalance.uiAmount || 0) <
        room.roomSplTokenEntryFee;

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
  max-width: 123rem;
  margin: 0 auto;
}

.rooms {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(35rem, 1fr));
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
}
</style>
