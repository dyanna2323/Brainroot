import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { KeyboardControls, useKeyboardControls } from "@react-three/drei";
import { useBrainrotGame } from "@/lib/stores/useBrainrotGame";
import { Player } from "./Player";
import { VotingZone } from "./VotingZone";
import { SoundButton } from "./SoundButton";
import { GameArena } from "./GameArena";
import * as THREE from "three";

enum Controls {
  p1Forward = "p1Forward",
  p1Back = "p1Back",
  p1Left = "p1Left",
  p1Right = "p1Right",
  p2Forward = "p2Forward",
  p2Back = "p2Back",
  p2Left = "p2Left",
  p2Right = "p2Right"
}

const keyMap = [
  { name: Controls.p1Forward, keys: ["KeyW"] },
  { name: Controls.p1Back, keys: ["KeyS"] },
  { name: Controls.p1Left, keys: ["KeyA"] },
  { name: Controls.p1Right, keys: ["KeyD"] },
  { name: Controls.p2Forward, keys: ["ArrowUp"] },
  { name: Controls.p2Back, keys: ["ArrowDown"] },
  { name: Controls.p2Left, keys: ["ArrowLeft"] },
  { name: Controls.p2Right, keys: ["ArrowRight"] }
];

function GameScene() {
  const { 
    quizRound, 
    player1, 
    player2, 
    setPlayerPosition, 
    setPlayerVote,
    phase
  } = useBrainrotGame();
  
  const [subscribe, getControls] = useKeyboardControls<Controls>();
  const currentSoundRef = useRef<HTMLAudioElement | null>(null);
  
  const playSound = () => {
    if (!quizRound || phase !== "playing") return;
    
    if (currentSoundRef.current) {
      currentSoundRef.current.pause();
      currentSoundRef.current.currentTime = 0;
    }
    
    const audio = new Audio(quizRound.correctCharacter.sound);
    audio.volume = 0.5;
    audio.play();
    currentSoundRef.current = audio;
    
    console.log("Playing sound for:", quizRound.correctCharacter.name);
  };
  
  useEffect(() => {
    console.log("Game phase:", phase);
    console.log("Player 1 controls: WASD");
    console.log("Player 2 controls: Arrow Keys");
    
    const unsubscribe = subscribe(
      (state) => state,
      (state) => {
        console.log("Controls state:", state);
      }
    );
    
    return () => {
      unsubscribe();
      if (currentSoundRef.current) {
        currentSoundRef.current.pause();
      }
    };
  }, [subscribe, phase]);
  
  useFrame((state, delta) => {
    if (phase !== "playing") return;
    
    const controls = getControls();
    const speed = 5 * delta;
    
    const p1Pos = new THREE.Vector3(...player1.position);
    const p2Pos = new THREE.Vector3(...player2.position);
    
    if (controls.p1Forward) p1Pos.z -= speed;
    if (controls.p1Back) p1Pos.z += speed;
    if (controls.p1Left) p1Pos.x -= speed;
    if (controls.p1Right) p1Pos.x += speed;
    
    if (controls.p2Forward) p2Pos.z -= speed;
    if (controls.p2Back) p2Pos.z += speed;
    if (controls.p2Left) p2Pos.x -= speed;
    if (controls.p2Right) p2Pos.x += speed;
    
    p1Pos.x = THREE.MathUtils.clamp(p1Pos.x, -20, 20);
    p1Pos.z = THREE.MathUtils.clamp(p1Pos.z, -20, 20);
    p2Pos.x = THREE.MathUtils.clamp(p2Pos.x, -20, 20);
    p2Pos.z = THREE.MathUtils.clamp(p2Pos.z, -20, 20);
    
    setPlayerPosition(1, [p1Pos.x, p1Pos.y, p1Pos.z]);
    setPlayerPosition(2, [p2Pos.x, p2Pos.y, p2Pos.z]);
    
    if (quizRound) {
      const votingPositions = [
        new THREE.Vector3(-6, 0, -8),
        new THREE.Vector3(0, 0, -8),
        new THREE.Vector3(6, 0, -8)
      ];
      
      let p1Vote: number | null = null;
      let p2Vote: number | null = null;
      
      votingPositions.forEach((votePos, index) => {
        const distP1 = p1Pos.distanceTo(votePos);
        const distP2 = p2Pos.distanceTo(votePos);
        
        if (distP1 < 2) p1Vote = index;
        if (distP2 < 2) p2Vote = index;
      });
      
      if (p1Vote !== player1.currentVote) {
        setPlayerVote(1, p1Vote);
        if (p1Vote !== null) {
          console.log("Player 1 voting for zone:", p1Vote + 1);
        }
      }
      
      if (p2Vote !== player2.currentVote) {
        setPlayerVote(2, p2Vote);
        if (p2Vote !== null) {
          console.log("Player 2 voting for zone:", p2Vote + 1);
        }
      }
    }
  });
  
  if (!quizRound) return null;
  
  const showAnswer = phase === "roundEnd" || phase === "gameEnd";
  const correctIndex = quizRound.options.findIndex(
    opt => opt.id === quizRound.correctCharacter.id
  );
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#A855F7" />
      
      <GameArena />
      
      <VotingZone 
        character={quizRound.options[0]}
        position={[-6, 0, -8]}
        index={0}
        isCorrect={correctIndex === 0}
        showAnswer={showAnswer}
      />
      <VotingZone 
        character={quizRound.options[1]}
        position={[0, 0, -8]}
        index={1}
        isCorrect={correctIndex === 1}
        showAnswer={showAnswer}
      />
      <VotingZone 
        character={quizRound.options[2]}
        position={[6, 0, -8]}
        index={2}
        isCorrect={correctIndex === 2}
        showAnswer={showAnswer}
      />
      
      <SoundButton position={[0, 0.5, 0]} onPlay={playSound} />
      
      <Player 
        position={player1.position}
        color="#3B82F6"
        label="P1"
      />
      <Player 
        position={player2.position}
        color="#EF4444"
        label="P2"
      />
    </>
  );
}

export function Game() {
  return (
    <KeyboardControls map={keyMap}>
      <GameScene />
    </KeyboardControls>
  );
}
