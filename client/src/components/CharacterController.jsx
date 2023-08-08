import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import Character from "./Character";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "../App";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const MOVEMENT_SPEED = 0.1;
const MAX_VEL = 3;
const JUMP_FORCE = 0.5;

export const CharacterController = () => {
  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward]
  );
  const backPressed = useKeyboardControls((state) => state[Controls.backward]);
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);

  const rigidBody = useRef();
  const character = useRef();
  const isOnFloor = useRef(true);

  useFrame(() => {
    const impulse = { x: 0, y: 0, z: 0 };
    const linvel = rigidBody.current.linvel();
    let changeRotation = false;

    if (forwardPressed && linvel.z > -MAX_VEL) {
      impulse.z -= MOVEMENT_SPEED;
      changeRotation = true;
    }
    if (backPressed && linvel.z < MAX_VEL) {
      impulse.z += MOVEMENT_SPEED;
      changeRotation = true;
    }
    if (leftPressed && linvel.x > -MAX_VEL) {
      impulse.x -= MOVEMENT_SPEED;
      changeRotation = true;
    }
    if (rightPressed && linvel.x < MAX_VEL) {
      impulse.x += MOVEMENT_SPEED;
      changeRotation = true;
    }
    if (jumpPressed && isOnFloor.current) {
      impulse.y += JUMP_FORCE;
      isOnFloor.current = false;
    }

    rigidBody.current.applyImpulse(impulse, true);
    if (changeRotation) {
      const angle = Math.atan2(linvel.x, linvel.z);
      character.current.rotation.y = angle;
    }
  });

  return (
    <group>
      <RigidBody
        ref={rigidBody}
        position-y={3}
        colliders={false}
        scale={[0.5, 0.5, 0.5]}
        enabledRotations={[false, false, false]}
        onCollisionEnter={() => {
          isOnFloor.current = true;
        }}
      >
        <CapsuleCollider args={[0.8, 0.4]} position={[0, 1.2, 0]} />
        <group ref={character}>
          <Character />
        </group>
      </RigidBody>
    </group>
  );
};
