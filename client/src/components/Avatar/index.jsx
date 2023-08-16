import React, { useRef, useState, useEffect, useMemo } from "react";
import { FemaleCasual } from "./FemaleCasual";
import { FemaleEngineer } from "./FemaleEngineer";
import { FemaleSoldier } from "./FemaleSoldier";
import { MaleAdventurer } from "./MaleAdventurer";
import { MaleCasual } from "./MaleCasual";
import { MaleHoodie } from "./MaleHoodie";
import { MalePunk } from "./MalePunk";
import { MaleSuit } from "./MaleSuit";
import { SkeletonUtils } from "three-stdlib";
import { useAtom } from "jotai";
import { useFrame, useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations, Text } from "@react-three/drei";
import { userAtom } from "../SocketManager";

const MOVE_SPEED = 0.032;

export const avatarConfigurations = {
  founder: {
    modelPath: "/models/MaleAdventurer.glb",
    renderRootScene: MaleAdventurer,
  },
  engineer: {
    modelPath: "/models/FemaleEngineer.glb",
    renderRootScene: FemaleEngineer,
  },
  creator: {
    modelPath: "/models/FemaleCasual.glb",
    renderRootScene: FemaleCasual,
  },
  musician: {
    modelPath: "/models/MalePunk.glb",
    renderRootScene: MalePunk,
  },
  designer: {
    modelPath: "/models/FemaleSoldier.glb",
    renderRootScene: FemaleSoldier,
  },
  investor: {
    modelPath: "/models/MaleSuit.glb",
    renderRootScene: MaleSuit,
  },
  techbro: {
    modelPath: "/models/MaleHoodie.glb",
    renderRootScene: MaleHoodie,
  },
};

export function Avatar({
  avatarType = "founder",
  topColor = "black",
  bottomColor = "black",
  // hairColor = "black",
  id,
  ...props
}) {
  const config =
    avatarConfigurations[avatarType] || avatarConfigurations.founder;
  const modelPath = config.modelPath;
  const position = useMemo(() => props.position, []);

  const avatarRef = useRef();
  const textRef = useRef();
  const { scene, materials, animations } = useGLTF(modelPath);

  // Skinned meshes cannot be re-used in threejs without cloning them
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // useGraph creates two flat object collections for nodes and materials
  const { nodes } = useGraph(clone);

  const { actions } = useAnimations(animations, avatarRef);
  const [animation, setAnimation] = useState("CharacterArmature|Idle");

  useEffect(() => {
    useGLTF.preload(modelPath);
  }, [modelPath]);

  useEffect(() => {
    actions[animation].reset().fadeIn(0.32).play();
    return () => actions[animation]?.fadeOut(0.32);
  }, [animation]);

  const [user] = useAtom(userAtom);

  const guildColors = {
    erevald: "green",
    alterok: "blue",
    gaudmire: "yellow",
    spectreseek: "red",
  };

  const hairColor = guildColors[props.guild] || "black";

  useFrame((state) => {
    if (avatarRef.current.position.distanceTo(props.position) > 0.1) {
      const direction = avatarRef.current.position
        .clone()
        .sub(props.position)
        .normalize()
        .multiplyScalar(MOVE_SPEED);
      avatarRef.current.position.sub(direction);
      avatarRef.current.lookAt(props.position);
      setAnimation("CharacterArmature|Run");
    } else {
      setAnimation("CharacterArmature|Idle");
    }

    if (id === user.id) {
      state.camera.position.x = avatarRef.current.position.x + 8;
      state.camera.position.y = avatarRef.current.position.y + 8;
      state.camera.position.z = avatarRef.current.position.z + 8;
      state.camera.lookAt(avatarRef.current.position);
    }

    if (textRef.current) {
      textRef.current.lookAt(state.camera.position);
    }
  });

  return (
    <group ref={avatarRef} {...props} position={position} dispose={null}>
      <Text
        ref={textRef}
        position-y={2.2}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {props.name}
      </Text>
      {config.renderRootScene && typeof config.renderRootScene === "function"
        ? config.renderRootScene(
            nodes,
            materials,
            hairColor,
            topColor,
            bottomColor
          )
        : null}
    </group>
  );
}
