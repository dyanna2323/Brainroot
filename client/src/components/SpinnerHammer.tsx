import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SpinnerHammerProps {
  position: [number, number, number];
  armLength?: number;
  rotationSpeed?: number;
  color?: string;
  armThickness?: number;
}

export function SpinnerHammer({
  position,
  armLength = 5,
  rotationSpeed = 1,
  color = "#FFD93D",
  armThickness = 0.3
}: SpinnerHammerProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const collisionBounds = useMemo(() => ({
    position,
    armLength,
    armThickness,
    type: "spinner-hammer" as const
  }), [position, armLength, armThickness]);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed;
    }
  });
  
  const armPosition: [number, number, number] = useMemo(() => [
    armLength / 2,
    0,
    0
  ], [armLength]);
  
  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[armThickness * 1.5, armThickness * 1.5, 2, 16]} />
        <meshStandardMaterial color="#E63946" />
      </mesh>
      
      <mesh position={armPosition} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[armThickness, armThickness, armLength, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      <mesh position={[armLength, 0, 0]} castShadow>
        <cylinderGeometry args={[armThickness * 2, armThickness * 2, armThickness * 3, 16]} />
        <meshStandardMaterial color="#E63946" />
      </mesh>
    </group>
  );
}

export function getSpinnerHammerBounds(props: SpinnerHammerProps) {
  const armLength = props.armLength || 5;
  const armThickness = props.armThickness || 0.3;
  return {
    position: props.position,
    armLength,
    armThickness,
    type: "spinner-hammer" as const
  };
}
