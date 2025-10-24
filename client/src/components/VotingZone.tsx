import { Text, Html } from "@react-three/drei";
import { BrainrotCharacter } from "@/lib/gameData";

interface VotingZoneProps {
  character: BrainrotCharacter;
  position: [number, number, number];
  index: number;
  isCorrect?: boolean;
  showAnswer?: boolean;
}

export function VotingZone({ character, position, index, isCorrect, showAnswer }: VotingZoneProps) {
  const zoneColor = showAnswer 
    ? (isCorrect ? "#10B981" : "#EF4444")
    : character.color;
  
  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[3, 0.1, 3]} />
        <meshStandardMaterial 
          color={zoneColor}
          emissive={zoneColor}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      <Html
        position={[0, 2.5, 0]}
        center
        distanceFactor={8}
        transform
        occlude
      >
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '8px',
          border: '3px solid #000',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}>
          <img 
            src={character.image} 
            alt={character.name}
            style={{
              width: '120px',
              height: '120px',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </div>
      </Html>
      
      <Text
        position={[0, 1, 0]}
        fontSize={0.35}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
        maxWidth={2.5}
        textAlign="center"
      >
        {character.name}
      </Text>
      
      <Text
        position={[0, 0.3, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        Zone {index + 1}
      </Text>
    </group>
  );
}
