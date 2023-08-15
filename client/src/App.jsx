import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Physics } from "@react-three/rapier";
import { Suspense, useState } from "react";
import { socket, SocketManager } from "./components/SocketManager";

function App() {
  const [player, setPlayer] = useState({
    name: "",
    guild: "",
    class: "",
  });
  const [isGameStarted, setIsGameStarted] = useState(false);
  const playerComplete = player.name && player.guild && player.class;

  const joinGame = () => {
    if (!playerComplete) {
      alert("please fill out all fields");
      return;
    }

    socket.emit("join", player);
    setIsGameStarted(true);
  };

  return (
    <>
      <SocketManager />

      {isGameStarted ? (
        <>
          <Canvas shadows camera={{ position: [8, 8, 8], fov: 50 }}>
            <color attach="background" args={["#ececec"]} />
            <Suspense>
              <Physics>
                <Experience />
              </Physics>
            </Suspense>
          </Canvas>
        </>
      ) : (
        <div>
          name:
          <input
            value={player.name}
            onChange={(e) => setPlayer({ ...player, name: e.target.value })}
          />
          <br />
          guild:
          <input
            value={player.guild}
            onChange={(e) => setPlayer({ ...player, guild: e.target.value })}
          />
          <br />
          class:
          <input
            value={player.class}
            onChange={(e) => setPlayer({ ...player, class: e.target.value })}
          />
          <br />
          <button onClick={joinGame}>enter buildscape</button>
        </div>
      )}
    </>
  );
}

export default App;
