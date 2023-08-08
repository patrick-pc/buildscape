import { Adventurer } from "./Adventurer";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";

export const Experience = () => {
  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.3} />
      <ContactShadows blur={2} />
      <OrbitControls />

      <Adventurer />
      <Adventurer position-x={1} hairColor="red" topColor="green" />
    </>
  );
};
