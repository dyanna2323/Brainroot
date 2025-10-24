import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import "@fontsource/inter";
import { Game } from "./components/Game";
import { GameUI } from "./components/GameUI";
import { useBrainrotGame } from "./lib/stores/useBrainrotGame";

function App() {
  const { gamePhase } = useBrainrotGame();
  
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <GameUI />
      
      {(gamePhase === "countdown" || gamePhase === "racing" || gamePhase === "results") && (
        <Canvas
          shadows
          camera={{
            position: [0, 15, -10],
            fov: 75,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            powerPreference: "default"
          }}
        >
          <color attach="background" args={["#87CEEB"]} />
          
          <Suspense fallback={null}>
            <Game />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}

export default App;
