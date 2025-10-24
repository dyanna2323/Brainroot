import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface MovingBarrierProps {
  position: [number, number, number];
  size?: [number, number, number];
  moveRange?: number;
  moveSpeed?: number;
  color?: string;
}

export function MovingBarrier({
  position,
  size = [0.5, 2, 4],
  moveRange = 5,
  moveSpeed = 1,
  color = "#4ECDC4"
}: MovingBarrierProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  
  const collisionBounds = useMemo(() => ({
    position,
    size,
    moveRange,
    type: "moving-barrier" as const
  }), [position, size, moveRange]);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      timeRef.current += delta * moveSpeed;
      const offset = Math.sin(timeRef.current) * moveRange;
      meshRef.current.position.x = position[0] + offset;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export function getMovingBarrierBounds(props: MovingBarrierProps) {
  const size = props.size || [0.5, 2, 4];
  const moveRange = props.moveRange || 5;
  return {
    position: props.position,
    size,
    moveRange,
    type: "moving-barrier" as const
  };
}
