import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useBrainrotGame } from "@/lib/stores/useBrainrotGame";
import { Player } from "./Player";
import { ObstacleCourse, getObstacleCourseBounds } from "./ObstacleCourse";
import TouchControls from "./TouchControls";
import { createBox, resolveAABBCollision, getBoxFromBounds } from "@/lib/collision";
import * as THREE from "three";

function GameScene() {
  const gamePhase = useBrainrotGame((state) => state.gamePhase);
  const player1 = useBrainrotGame((state) => state.player1);
  const player2 = useBrainrotGame((state) => state.player2);
  const setPlayerPosition = useBrainrotGame((state) => state.setPlayerPosition);
  const finishRace = useBrainrotGame((state) => state.finishRace);
  
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  // Get obstacle bounds for collision detection
  const obstacleBounds = useRef(getObstacleCourseBounds());
  
  useFrame(() => {
    if (gamePhase !== "racing") return;
    
    // Get player positions
    const p1Pos = new THREE.Vector3(...player1.position);
    const p2Pos = new THREE.Vector3(...player2.position);
    
    // Player box dimensions (matching Player component)
    const playerSize: [number, number, number] = [1, 2, 1];
    
    // Helper function to convert obstacle bounds to collision box
    const getObstacleCollisionBox = (obstacle: any) => {
      // Handle obstacles with size property (RotatingPlatform, MovingBarrier)
      if ('size' in obstacle) {
        return getBoxFromBounds({ position: obstacle.position, size: obstacle.size });
      }
      
      // For GapJump, create boxes for the two platforms
      if (obstacle.type === 'gap-jump') {
        const { position, width, depth, platformLength } = obstacle;
        // Return both platform boxes (we'll check both)
        const platform1Pos: [number, number, number] = [
          position[0] - (width / 2 + platformLength / 2),
          position[1],
          position[2]
        ];
        const platform2Pos: [number, number, number] = [
          position[0] + (width / 2 + platformLength / 2),
          position[1],
          position[2]
        ];
        const platformSize: [number, number, number] = [platformLength, 0.5, depth];
        return [
          createBox(platform1Pos, platformSize),
          createBox(platform2Pos, platformSize)
        ];
      }
      
      // For SpinnerHammer, approximate as a box covering rotation area
      if (obstacle.type === 'spinner-hammer') {
        const { position, armLength } = obstacle;
        const size: [number, number, number] = [armLength * 2, 2, armLength * 2];
        return createBox(position, size);
      }
      
      return null;
    };
    
    // Player 1 collision detection
    const p1Box = createBox([p1Pos.x, p1Pos.y, p1Pos.z], playerSize);
    obstacleBounds.current.forEach((obstacle) => {
      const obstacleBoxes = getObstacleCollisionBox(obstacle);
      if (!obstacleBoxes) return;
      
      // Handle single box or array of boxes
      const boxArray = Array.isArray(obstacleBoxes) ? obstacleBoxes : [obstacleBoxes];
      
      boxArray.forEach((obstacleBox) => {
        const collision = resolveAABBCollision(p1Box, obstacleBox);
        
        if (collision.collided && collision.normal && collision.penetration) {
          // Push player out of obstacle
          p1Pos.x += collision.normal[0] * collision.penetration;
          p1Pos.y += collision.normal[1] * collision.penetration;
          p1Pos.z += collision.normal[2] * collision.penetration;
          
          // Update position in store
          setPlayerPosition(1, [p1Pos.x, p1Pos.y, p1Pos.z]);
        }
      });
    });
    
    // Player 2 collision detection
    const p2Box = createBox([p2Pos.x, p2Pos.y, p2Pos.z], playerSize);
    obstacleBounds.current.forEach((obstacle) => {
      const obstacleBoxes = getObstacleCollisionBox(obstacle);
      if (!obstacleBoxes) return;
      
      // Handle single box or array of boxes
      const boxArray = Array.isArray(obstacleBoxes) ? obstacleBoxes : [obstacleBoxes];
      
      boxArray.forEach((obstacleBox) => {
        const collision = resolveAABBCollision(p2Box, obstacleBox);
        
        if (collision.collided && collision.normal && collision.penetration) {
          // Push player out of obstacle
          p2Pos.x += collision.normal[0] * collision.penetration;
          p2Pos.y += collision.normal[1] * collision.penetration;
          p2Pos.z += collision.normal[2] * collision.penetration;
          
          // Update position in store
          setPlayerPosition(2, [p2Pos.x, p2Pos.y, p2Pos.z]);
        }
      });
    });
    
    // Check if players crossed finish line (Z >= 50)
    if (p1Pos.z >= 50) {
      finishRace(1);
    }
    if (p2Pos.z >= 50) {
      finishRace(2);
    }
    
    // Update camera to follow the action
    if (cameraRef.current) {
      // Calculate average position of both players
      const avgX = (p1Pos.x + p2Pos.x) / 2;
      const avgZ = (p1Pos.z + p2Pos.z) / 2;
      
      // Position camera to follow players while maintaining good view
      const targetCameraX = avgX;
      const targetCameraY = 15;
      const targetCameraZ = avgZ - 10;
      
      // Smooth camera follow
      cameraRef.current.position.lerp(
        new THREE.Vector3(targetCameraX, targetCameraY, targetCameraZ),
        0.05
      );
      
      // Look at point ahead of average player position
      const lookAtTarget = new THREE.Vector3(avgX, 0, avgZ + 10);
      const currentLookAt = new THREE.Vector3();
      cameraRef.current.getWorldDirection(currentLookAt);
      currentLookAt.multiplyScalar(10).add(cameraRef.current.position);
      currentLookAt.lerp(lookAtTarget, 0.05);
      cameraRef.current.lookAt(currentLookAt);
    }
  });
  
  // Only render game elements when racing
  if (gamePhase !== "racing") return null;
  
  return (
    <>
      {/* Camera */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 15, -10]}
        fov={75}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight 
        position={[-10, 15, -5]} 
        intensity={0.5}
      />
      
      {/* Obstacle Course */}
      <ObstacleCourse />
      
      {/* Players */}
      <Player 
        playerNumber={1}
        startPosition={[-3, 1, 0]}
      />
      <Player 
        playerNumber={2}
        startPosition={[3, 1, 0]}
      />
    </>
  );
}

export function Game() {
  return (
    <>
      <GameScene />
      <TouchControls />
    </>
  );
}
