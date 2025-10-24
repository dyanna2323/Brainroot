import { useRef, useState } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SoundButtonProps {
  position: [number, number, number];
  onPlay: () => void;
}

export function SoundButton({ position, onPlay }: SoundButtonProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });
  
  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onPlay}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[1, 1, 0.5, 32]} />
        <meshStandardMaterial 
          color={hovered ? "#F59E0B" : "#EF4444"}
          emissive="#EF4444"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      <Text
        position={[0, 1, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        🔊 PLAY SOUND
      </Text>
    </group>
  );
}
