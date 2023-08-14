import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Physics } from "@react-three/rapier";
import { KeyboardControls } from "@react-three/drei";
import { useMemo, Suspense } from "react";
import { SocketManager } from "./components/SocketManager";

export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  jump: "jump",
};

function App() {
  const map = useMemo(() => [
    { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
    { name: Controls.backward, keys: ["ArrowDown", "KeyS"] },
    { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
    { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
    { name: Controls.jump, keys: ["Space"] },
  ]);

  return (
    <>
      <SocketManager />
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 50 }}>
        <color attach="background" args={["#ececec"]} />
        <Suspense>
          <Physics>
            <Experience />
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
}

export default App;
