import { atom, useAtom } from "jotai";
import { io } from "socket.io-client";
import { useEffect } from "react";

export const socket = io(
  import.meta.env.VITE_SERVER_URL || "http://localhost:3001"
);
export const userAtom = atom(null);
export const playersAtom = atom([]);

export const SocketManager = () => {
  const [, setPlayers] = useAtom(playersAtom);
  const [, setUser] = useAtom(userAtom);

  useEffect(() => {
    function onConnect() {
      console.log("connected");
    }

    function onDisconnect() {
      console.log("disconnected");
    }

    function onJoined(data) {
      // const currentUser = data.players[data.id];
      // if (currentUser) {
      //   setUser({
      //     id: currentUser.id,
      //     name: currentUser.name,
      //     guild: currentUser.guild,
      //     class: currentUser.class,
      //   });
      // }

      setUser({
        id: data.id,
      });
      setPlayers(Object.values(data.players));
    }

    function onNewPlayer(newPlayer) {
      setPlayers((prevPlayers) => {
        if (!prevPlayers.some((player) => player.id === newPlayer.id)) {
          return [...prevPlayers, newPlayer];
        }
        return prevPlayers;
      });
    }

    function onUpdatePlayer(updatedPlayer) {
      setPlayers((prevPlayers) => {
        return prevPlayers.map((player) => {
          if (player.id === updatedPlayer.id) {
            return updatedPlayer;
          } else {
            return player;
          }
        });
      });
    }

    function onPlayerDisconnected(data) {
      setPlayers((prevPlayers) => prevPlayers.filter((c) => c.id !== data.id));
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("joined", onJoined);
    socket.on("newPlayer", onNewPlayer);
    socket.on("updatePlayer", onUpdatePlayer);
    socket.on("playerDisconnected", onPlayerDisconnected);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("joined", onJoined);
      socket.off("newPlayer", onNewPlayer);
      socket.off("updatePlayer", onUpdatePlayer);
      socket.off("playerDisconnected", onPlayerDisconnected);
    };
  }, []);
};
