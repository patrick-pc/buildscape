import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Physics } from "@react-three/rapier";
import { Suspense, useState } from "react";
import { socket, SocketManager } from "./components/SocketManager";

function App() {
  const [player, setPlayer] = useState({
    name: "",
    guild: "erevald",
    class: "founder",
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
        <div className="w-full flex flex-col items-center justify-center gap-4 mt-80">
          <div className="w-full flex items-center justify-center gap-2">
            <p className="w-12">name:</p>
            <input
              value={player.name}
              onChange={(e) => setPlayer({ ...player, name: e.target.value })}
              className="w-full max-w-xs border px-2 py-1 focus:outline-none"
            />
          </div>

          <div className="w-full flex items-center justify-center gap-2">
            <p className="w-12">guild:</p>
            <select
              value={player.guild}
              onChange={(e) => setPlayer({ ...player, guild: e.target.value })}
              className="w-full max-w-xs border px-2 py-1 focus:outline-none"
            >
              <option value="erevald">erevald</option>
              <option value="gaudmire">gaudmire</option>
              <option value="alterok">alterok</option>
              <option value="spectreseek">spectreseek</option>
            </select>
          </div>

          <div className="w-full flex items-center justify-center gap-2">
            <p className="w-12">class:</p>
            <select
              value={player.class}
              onChange={(e) => setPlayer({ ...player, class: e.target.value })}
              className="w-full max-w-xs border px-2 py-1 focus:outline-none"
            >
              <option value="founder">founder</option>
              <option value="engineer">engineer</option>
              <option value="creator">creator</option>
              <option value="musician">musician</option>
              <option value="designer">designer</option>
              <option value="investor">investor</option>
              <option value="techbro">tech bro</option>
            </select>
          </div>

          <button
            onClick={joinGame}
            className="w-96 border bg-black text-white px-2 py-1"
          >
            enter buildscape
          </button>
        </div>
      )}
    </>
  );
}

export default App;
