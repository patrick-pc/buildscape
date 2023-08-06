import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { Experience } from "./components/Experience";

function App() {
  return (
    <Canvas shadows camera={{ position: [0, 5, 5], fov: 100 }}>
      <color attach="background" args={["#e3daf7"]} />
      <fog attach="fog" args={["#dbecfb", 30, 40]} />
      <Suspense>
        <Physics debug>
          <Experience />
        </Physics>
      </Suspense>
    </Canvas>
  );
}

export default App;
