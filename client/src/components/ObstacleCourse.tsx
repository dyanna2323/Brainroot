import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { RotatingPlatform, getRotatingPlatformBounds } from "./RotatingPlatform";
import { MovingBarrier, getMovingBarrierBounds } from "./MovingBarrier";
import { GapJump, getGapJumpBounds } from "./GapJump";
import { SpinnerHammer, getSpinnerHammerBounds } from "./SpinnerHammer";

interface ObstacleCourseProps {
  courseNumber?: number;
}

export function ObstacleCourse({ courseNumber = 1 }: ObstacleCourseProps) {
  // Load texture for the floor
  const floorTexture = useTexture("/textures/asphalt.png");
  
  // Configure texture repeat for a nice pattern
  useMemo(() => {
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(8, 11); // Scale texture for visual appeal
  }, [floorTexture]);

  return (
    <group>
      {/* Main Floor/Ground - Large flat plane from Z=0 to Z=55, X=-8 to 8 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 27.5]} receiveShadow>
        <planeGeometry args={[16, 55]} />
        <meshStandardMaterial map={floorTexture} />
      </mesh>

      {/* Start Line - Green platform at Z=0, spanning X=-6 to 6 */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[12, 0.3, 1]} />
        <meshStandardMaterial 
          color="#00FF00" 
          emissive="#00FF00" 
          emissiveIntensity={0.4} 
        />
      </mesh>

      {/* Finish Line - Gold/Yellow platform at Z=50, spanning X=-6 to 6 */}
      <mesh position={[0, 0, 50]} castShadow receiveShadow>
        <boxGeometry args={[12, 0.3, 1]} />
        <meshStandardMaterial 
          color="#FFD700" 
          emissive="#FFD700" 
          emissiveIntensity={0.5} 
        />
      </mesh>

      {/* Side Barriers - Walls at X=-8 and X=8, height 3 units */}
      {/* Left wall */}
      <mesh position={[-8, 1.5, 27.5]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 3, 55]} />
        <meshStandardMaterial color="#FF6B9D" opacity={0.6} transparent />
      </mesh>

      {/* Right wall */}
      <mesh position={[8, 1.5, 27.5]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 3, 55]} />
        <meshStandardMaterial color="#FF6B9D" opacity={0.6} transparent />
      </mesh>

      {/* Lane Markers - Visual guides for P1 (X=-3) and P2 (X=3) lanes */}
      <mesh position={[-3, -0.48, 25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 50]} />
        <meshStandardMaterial color="#FFFFFF" opacity={0.3} transparent />
      </mesh>
      <mesh position={[3, -0.48, 25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 50]} />
        <meshStandardMaterial color="#FFFFFF" opacity={0.3} transparent />
      </mesh>

      {/* Obstacles - Spread evenly from Z=10 to Z=45 */}
      
      {/* First set of obstacles */}
      <RotatingPlatform 
        position={[0, 0.25, 12]} 
        size={[6, 0.5, 4]} 
        rotationSpeed={1} 
        color="#FF6B9D"
      />
      
      <MovingBarrier 
        position={[0, 1, 17]} 
        size={[0.5, 2, 3]} 
        moveRange={4} 
        moveSpeed={1.5}
        color="#4ECDC4"
      />
      
      <GapJump 
        position={[0, 0, 22]} 
        width={3} 
        depth={4} 
        platformLength={3}
        color="#95E1D3"
      />
      
      <SpinnerHammer 
        position={[0, 1.5, 27]} 
        armLength={4} 
        rotationSpeed={1.2}
        color="#FFD93D"
      />

      {/* Second set of obstacles */}
      <RotatingPlatform 
        position={[0, 0.25, 32]} 
        size={[6, 0.5, 4]} 
        rotationSpeed={-1.2}
        color="#FF6B9D"
      />
      
      <MovingBarrier 
        position={[0, 1, 37]} 
        size={[0.5, 2, 3]} 
        moveRange={4} 
        moveSpeed={1.8}
        color="#4ECDC4"
      />
      
      <GapJump 
        position={[0, 0, 42]} 
        width={3.5} 
        depth={4} 
        platformLength={3}
        color="#95E1D3"
      />
      
      <SpinnerHammer 
        position={[0, 1.5, 44]} 
        armLength={4.5} 
        rotationSpeed={-1.5}
        color="#FFD93D"
      />

      {/* Grid helper for visual reference */}
      <gridHelper 
        args={[16, 32, "#374151", "#1F2937"]} 
        position={[0, -0.45, 27.5]} 
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

/**
 * Export collision bounds for all obstacles in the course
 * Returns an array of obstacle bounds for collision detection
 */
export function getObstacleCourseBounds() {
  return [
    // First set of obstacles
    getRotatingPlatformBounds({ 
      position: [0, 0.25, 12], 
      size: [6, 0.5, 4] 
    }),
    getMovingBarrierBounds({ 
      position: [0, 1, 17], 
      size: [0.5, 2, 3], 
      moveRange: 4 
    }),
    getGapJumpBounds({ 
      position: [0, 0, 22], 
      width: 3, 
      depth: 4, 
      platformLength: 3 
    }),
    getSpinnerHammerBounds({ 
      position: [0, 1.5, 27], 
      armLength: 4 
    }),
    
    // Second set of obstacles
    getRotatingPlatformBounds({ 
      position: [0, 0.25, 32], 
      size: [6, 0.5, 4] 
    }),
    getMovingBarrierBounds({ 
      position: [0, 1, 37], 
      size: [0.5, 2, 3], 
      moveRange: 4 
    }),
    getGapJumpBounds({ 
      position: [0, 0, 42], 
      width: 3.5, 
      depth: 4, 
      platformLength: 3 
    }),
    getSpinnerHammerBounds({ 
      position: [0, 1.5, 44], 
      armLength: 4.5 
    }),
  ];
}
