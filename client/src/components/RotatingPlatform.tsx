import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RotatingPlatformProps {
  position: [number, number, number];
  size?: [number, number, number];
  rotationSpeed?: number;
  color?: string;
}

export function RotatingPlatform({
  position,
  size = [4, 0.5, 4],
  rotationSpeed = 1,
  color = "#FF6B9D"
}: RotatingPlatformProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const collisionBounds = useMemo(() => ({
    position,
    size,
    type: "rotating-platform" as const
  }), [position, size]);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export function getRotatingPlatformBounds(props: RotatingPlatformProps) {
  const size = props.size || [4, 0.5, 4];
  return {
    position: props.position,
    size,
    type: "rotating-platform" as const
  };
}
