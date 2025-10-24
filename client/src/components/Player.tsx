import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useBrainrotGame } from "../lib/stores/useBrainrotGame";

interface PlayerProps {
  playerNumber: 1 | 2;
  startPosition: [number, number, number];
}

// Physics constants
const MOVE_SPEED = 0.15;
const JUMP_FORCE = 0.3;
const GRAVITY = -0.02;
const MAX_FALL_SPEED = -0.5;
const AUTO_RUN_SPEED = 0.12;

export function Player({ playerNumber, startPosition }: PlayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Physics state
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const isGrounded = useRef(true);
  
  // Get touch controls and selected characters from store
  const touchControls = useBrainrotGame(state => state.touchControls[`player${playerNumber}`]);
  const selectedCharacter = useBrainrotGame(state => state.selectedCharacters[`player${playerNumber}`]);
  const setPlayerPosition = useBrainrotGame(state => state.setPlayerPosition);
  
  useFrame(() => {
    if (!groupRef.current) return;
    
    // Apply gravity
    velocity.current.y += GRAVITY;
    
    // Clamp fall speed
    velocity.current.y = Math.max(velocity.current.y, MAX_FALL_SPEED);
    
    // Apply horizontal movement based on touch controls
    velocity.current.x = 0;
    if (touchControls.left) {
      velocity.current.x = -MOVE_SPEED;
    }
    if (touchControls.right) {
      velocity.current.x = MOVE_SPEED;
    }
    
    // Auto-run forward (like Fall Guys)
    velocity.current.z = AUTO_RUN_SPEED;
    
    // Handle jump
    if (touchControls.jump && isGrounded.current) {
      velocity.current.y = JUMP_FORCE;
      isGrounded.current = false;
    }
    
    // Update position based on velocity
    groupRef.current.position.x += velocity.current.x;
    groupRef.current.position.y += velocity.current.y;
    groupRef.current.position.z += velocity.current.z;
    
    // Ground detection
    if (groupRef.current.position.y <= 0.5) {
      groupRef.current.position.y = 0.5;
      velocity.current.y = 0;
      isGrounded.current = true;
    }
    
    // Update store position
    setPlayerPosition(playerNumber, [
      groupRef.current.position.x,
      groupRef.current.position.y,
      groupRef.current.position.z
    ]);
  });
  
  // Player color based on player number
  const playerColor = playerNumber === 1 ? "#3b82f6" : "#ef4444"; // blue for P1, red for P2
  
  return (
    <group ref={groupRef} position={startPosition}>
      {/* Player box - 1x2x1 (width x height x depth) */}
      <mesh ref={meshRef} castShadow position={[0, 1, 0]}>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial 
          color={playerColor} 
          emissive={playerColor}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Character image above player */}
      {selectedCharacter && (
        <Html position={[0, 2.5, 0]} center>
          <img 
            src={selectedCharacter.image} 
            alt={selectedCharacter.name}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: `3px solid ${playerColor}`,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              objectFit: 'cover'
            }}
          />
        </Html>
      )}
      
      {/* Simple glow effect */}
      <pointLight 
        position={[0, 1, 0]} 
        color={playerColor} 
        intensity={0.5} 
        distance={3} 
      />
    </group>
  );
}
