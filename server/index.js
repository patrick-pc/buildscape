import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("yo");
});

const generateRandomPosition = () => {
  return [Math.random() * 3, 0, Math.random() * 3];
};

const generateRandomHexColor = () => {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
};

const players = {};

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("join", (data) => {
    const newPlayer = {
      id: socket.id,
      name: data.name,
      guild: data.guild,
      class: data.class,
      position: generateRandomPosition(),
      hairColor: generateRandomHexColor(),
      topColor: generateRandomHexColor(),
      bottomColor: generateRandomHexColor(),
    };

    players[socket.id] = newPlayer;

    // Send the list of all players to the newly connected client
    socket.emit("joined", { id: socket.id, players });

    // Broadcast the new player to all other clients
    socket.broadcast.emit("newPlayer", newPlayer);
  });

  socket.on("move", (position) => {
    const player = players[socket.id];
    if (player) {
      player.position = position;
      io.emit("updatePlayer", player);
    }
  });
  socket.on("sendChatMessage", (message) => {
    const player = players[socket.id];
    if (player) {
      io.emit("receiveChatMessage", { sender: player.name, message }); // Ensure this line gets called only once per event.
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    delete players[socket.id];

    socket.broadcast.emit("playerDisconnected", { id: socket.id });
  });
});

server.listen(process.env.PORT || 3001, () =>
  console.log(`Server is running on port ${process.env.PORT || 3001}`)
);
