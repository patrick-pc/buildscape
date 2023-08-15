import { atom, useAtom } from "jotai";
import { io } from "socket.io-client";
import { useEffect } from "react";

export const socket = io(
  import.meta.env.VITE_API_KEY || "http://localhost:3001"
);
export const charactersAtom = atom([]);
export const userAtom = atom(null);

export const SocketManager = () => {
  const [_characters, setCharacters] = useAtom(charactersAtom);
  const [_user, setUser] = useAtom(userAtom);

  useEffect(() => {
    function onConnect() {
      console.log("connected");
    }

    function onDisconnect() {
      console.log("disconnected");
    }

    function onJoin(value) {
      setUser(value.id);
      setCharacters(value);
    }

    function onCharacters(value) {
      setCharacters(value);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("join", onJoin);
    socket.on("characters", onCharacters);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("join", onJoin);
      socket.off("characters", onCharacters);
    };
  }, []);
};
