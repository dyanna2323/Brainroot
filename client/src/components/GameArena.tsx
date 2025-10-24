import { useRef } from "react";
import * as THREE from "three";

export function GameArena() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>
      
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[50, 0.2, 50]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      
      <gridHelper args={[50, 50, "#374151", "#1F2937"]} position={[0, 0.01, 0]} />
    </>
  );
}
