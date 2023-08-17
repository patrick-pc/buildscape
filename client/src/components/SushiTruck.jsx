/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.10 public/models/SushiTruck.glb -o src/components/SushiTruck.jsx -r public 
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function SushiTruck(props) {
  const { nodes, materials } = useGLTF("/models/SushiTruck.glb");
  return (
    <group {...props} dispose={null}>
      <group scale={50}>
        <mesh geometry={nodes.Truck_1.geometry} material={materials.Atlas} />
        <mesh geometry={nodes.Truck_2.geometry} material={materials.Lights} />
        <mesh geometry={nodes.Truck_3.geometry} material={materials.Glass} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/SushiTruck.glb");
