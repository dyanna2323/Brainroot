import { useMemo } from "react";
import * as THREE from "three";

interface GapJumpProps {
  position: [number, number, number];
  width?: number;
  depth?: number;
  platformLength?: number;
  color?: string;
}

export function GapJump({
  position,
  width = 3,
  depth = 5,
  platformLength = 4,
  color = "#95E1D3"
}: GapJumpProps) {
  const collisionBounds = useMemo(() => ({
    position,
    width,
    depth,
    platformLength,
    type: "gap-jump" as const
  }), [position, width, depth, platformLength]);
  
  const platform1Position: [number, number, number] = useMemo(() => [
    position[0] - (width / 2 + platformLength / 2),
    position[1],
    position[2]
  ], [position, width, platformLength]);
  
  const platform2Position: [number, number, number] = useMemo(() => [
    position[0] + (width / 2 + platformLength / 2),
    position[1],
    position[2]
  ], [position, width, platformLength]);
  
  const platformSize: [number, number, number] = useMemo(() => [
    platformLength,
    0.5,
    depth
  ], [platformLength, depth]);
  
  return (
    <group>
      <mesh position={platform1Position} castShadow receiveShadow>
        <boxGeometry args={platformSize} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      <mesh position={platform2Position} castShadow receiveShadow>
        <boxGeometry args={platformSize} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

export function getGapJumpBounds(props: GapJumpProps) {
  const width = props.width || 3;
  const depth = props.depth || 5;
  const platformLength = props.platformLength || 4;
  return {
    position: props.position,
    width,
    depth,
    platformLength,
    type: "gap-jump" as const
  };
}
