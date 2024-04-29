import { defineStore } from "pinia";
import { computed, ref } from "vue";

const SERVER = {
  "EU-FRANCE": {
    api: "https://api.solbubbles.com",
    ws: "wss://app.solbubbles.com/api",
  },
  "US-BOSTON": {
    api: "https://api-us.solbubbles.com",
    ws: "wss://app-us.solbubbles.com/api",
  },
} as const;

type Server = keyof typeof SERVER;

export const useServersStore = defineStore(
  "serversStore",
  () => {
    const currentServer = ref<Server>("US-BOSTON");

    const currentServerConfig = computed(() => {
      return SERVER[currentServer.value];
    });

    const serverConfigs = computed(() => {
      return SERVER;
    });

    const changeServer = (event: InputEvent) => {
      const server = (event.target as HTMLInputElement).value as Server;

      currentServer.value = server;

      window.location.reload();
    };

    return {
      currentServerConfig,
      serverConfigs,
      currentServer,
      changeServer,
    };
  },
  {
    persist: true,
  }
);
