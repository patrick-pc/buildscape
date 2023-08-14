import { Adventurer } from "./Adventurer";
import { Environment, OrbitControls, useCursor, Grid } from "@react-three/drei";
import { charactersAtom } from "./SocketManager";
import { socket } from "./SocketManager";
import { useAtom } from "jotai";
import { useState } from "react";
import * as THREE from "three";
import { Torii } from "./Torii";

export const Experience = () => {
  const [characters] = useAtom(charactersAtom);
  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.5} />
      <OrbitControls />

      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.001}
        onClick={(e) => socket.emit("move", [e.point.x, 0, e.point.z])}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="lightgray" />
      </mesh>
      <Grid
        args={[100, 100]}
        sectionColor={"lightgray"}
        cellColor={"gray"}
        position={[0, 0.01, 0]}
      />

      {characters.map((character) => (
        <Adventurer
          key={character.id}
          id={character.id}
          position={
            new THREE.Vector3(
              character.position[0],
              character.position[1],
              character.position[2]
            )
          }
          hairColor={character.hairColor}
          topColor={character.topColor}
          bottomColor={character.bottomColor}
        />
      ))}

      <Torii
        scale={[15, 15, 15]}
        position={[0, 3.5, -22]}
        rotation-y={1.25 * Math.PI}
      />
      <Torii
        scale={[10, 10, 10]}
        position={[-8, 2.5, -20]}
        rotation-y={1.4 * Math.PI}
      />
      <Torii
        scale={[10, 10, 10]}
        position={[8, 2.5, -20]}
        rotation-y={Math.PI}
      />
    </>
  );
};
