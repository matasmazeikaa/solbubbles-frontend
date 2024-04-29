import { useServersStore } from "@/stores/serversStore";
import { Client, type RoomAvailable } from "colyseus.js";
import { ref } from "vue";

interface Room extends RoomAvailable {
  name: string;
}

const client = ref<Client>();
const allRooms = ref<Room[]>([]);

export const useWebsocketClient = () => {
  const initClient = async () => {
    client.value = new Client(useServersStore().currentServerConfig.ws);
    const lobby = await client.value.joinOrCreate("lobby");

    lobby.onMessage("rooms", (rooms) => {
      allRooms.value = rooms;
    });

    lobby.onMessage("+", ([roomId, room]) => {
      const roomIndex = allRooms.value.findIndex(
        (room) => room.roomId === roomId
      );
      if (roomIndex !== -1) {
        allRooms.value[roomIndex] = room;
      } else {
        allRooms.value.push(room);
      }
    });

    lobby.onMessage("-", (roomId) => {
      allRooms.value = allRooms.value.filter((room) => room.roomId !== roomId);
    });
  };

  return {
    client,
    allRooms,
    initClient,
  };
};
