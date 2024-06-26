<template>
  <div class="height-100 container">
    <div id="game" />
    <Game :is-reconnected="isReconnected" v-if="gameSettings.isGameStart" />

    <div class="lobby" v-else>
      <LobbyBackground />
      <Header />
      <TransactionStatus />

      <div class="start-menu">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <Component :is="Component" v-if="$route.name !== 'lobby'" />

            <Rooms
              @start-game="joinRoom"
              @reconnect="reconnect"
              :is-loading-room-connect="isLoadingRoomConnect"
              v-else
            />
          </Transition>
        </RouterView>
      </div>

      <Footer />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Rooms from "./Rooms.vue";

import Header from "@/components/Header.vue";

import Game from "./Game.vue";
import LobbyBackground from "@/components/LobbyBackground.vue";
import { Application } from "@/game/Application";
import Footer from "@/components/Footer.vue";
import TransactionStatus from "@/components/transaction-status/TransactionStatus.vue";
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game";
import { onBeforeMount, ref } from "vue";
import { useWebsocketClient } from "@/hooks/useWebsocketClient";
import { useGame } from "@/hooks/useGame";
import { useBalanceStore } from "@/stores/balanceStore";

const gameStore = useGameStore();

const { gameSettings } = storeToRefs(gameStore);
const { initClient } = useWebsocketClient();
const balanceStore = useBalanceStore();

const { setGame, isReconnected } = useGame();
const isLoadingRoomConnect = ref(false);

const joinRoom = async (room: Room) => {
  const game = new Application();

  setGame(game);

  isLoadingRoomConnect.value = true;

  try {
    await game.connect({ roomName: room.id });
    balanceStore.updateAllBalances();

    gameSettings.value.isGameStart = true;

    document.getElementById("game")?.appendChild(game.view as unknown as Node);
  } catch (error) {
    console.log(error);
  } finally {
    isLoadingRoomConnect.value = false;
  }
};

const reconnect = async (reconnectionToken: string) => {
  const game = new Application();

  setGame(game);

  isLoadingRoomConnect.value = true;

  try {
    await game.connect({ sessionId: reconnectionToken });
    gameSettings.value.isGameStart = true;
    isReconnected.value = true;

    document.getElementById("game")?.appendChild(game.view as unknown as Node);
  } catch (error) {
    console.log(error);
  } finally {
    isLoadingRoomConnect.value = false;
  }
};

onBeforeMount(() => {
  isReconnected.value = false;
  initClient();
});
</script>

<style lang="scss" scoped>
.lobby {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

.start-menu {
  z-index: 5;
  padding: 2.4rem;

  &__room {
    border: 1px solid #fff;
    background: none;
    cursor: pointer;

    &:hover {
      opacity: 0.75;
    }
  }

  &__rooms {
    max-width: 65.6rem;
    margin: 0 auto;
  }
}

.container {
  overflow: hidden;
}
</style>
