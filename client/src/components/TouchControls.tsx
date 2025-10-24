import { useBrainrotGame } from "../lib/stores/useBrainrotGame";

export default function TouchControls() {
  const gamePhase = useBrainrotGame((state) => state.gamePhase);
  const setTouchControl = useBrainrotGame((state) => state.setTouchControl);

  // Only show during racing phase
  if (gamePhase !== "racing") {
    return null;
  }

  const handleTouchStart = (
    player: 1 | 2,
    control: "left" | "right" | "jump",
    e: React.TouchEvent
  ) => {
    e.preventDefault();
    setTouchControl(player, control, true);
  };

  const handleTouchEnd = (
    player: 1 | 2,
    control: "left" | "right" | "jump",
    e: React.TouchEvent
  ) => {
    e.preventDefault();
    setTouchControl(player, control, false);
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 select-none"
      style={{ touchAction: "none" }}
    >
      {/* Player 1 Controls - Left Side */}
      <div className="absolute bottom-0 left-0 w-1/2 h-64 pointer-events-auto">
        <div className="relative w-full h-full bg-black/20 backdrop-blur-sm">
          {/* Player 1 Label */}
          <div className="absolute top-2 left-4 text-blue-400 font-bold text-sm">
            P1
          </div>

          {/* LEFT Button */}
          <button
            onTouchStart={(e) => handleTouchStart(1, "left", e)}
            onTouchEnd={(e) => handleTouchEnd(1, "left", e)}
            className="absolute bottom-4 left-4 w-24 h-24 bg-blue-500/80 hover:bg-blue-600/80 active:bg-blue-700/90 active:scale-95 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg transition-all touch-none border-2 border-blue-400/50"
            aria-label="Player 1 Left"
          >
            ←
          </button>

          {/* RIGHT Button */}
          <button
            onTouchStart={(e) => handleTouchStart(1, "right", e)}
            onTouchEnd={(e) => handleTouchEnd(1, "right", e)}
            className="absolute bottom-4 left-32 w-24 h-24 bg-blue-500/80 hover:bg-blue-600/80 active:bg-blue-700/90 active:scale-95 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg transition-all touch-none border-2 border-blue-400/50"
            aria-label="Player 1 Right"
          >
            →
          </button>

          {/* JUMP Button */}
          <button
            onTouchStart={(e) => handleTouchStart(1, "jump", e)}
            onTouchEnd={(e) => handleTouchEnd(1, "jump", e)}
            className="absolute bottom-32 left-20 w-28 h-28 bg-blue-600/80 hover:bg-blue-700/80 active:bg-blue-800/90 active:scale-95 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg transition-all touch-none border-2 border-blue-400/50"
            aria-label="Player 1 Jump"
          >
            <div className="flex flex-col items-center">
              <span className="text-3xl">⬆</span>
              <span className="text-xs mt-1">JUMP</span>
            </div>
          </button>
        </div>
      </div>

      {/* Player 2 Controls - Right Side */}
      <div className="absolute bottom-0 right-0 w-1/2 h-64 pointer-events-auto">
        <div className="relative w-full h-full bg-black/20 backdrop-blur-sm">
          {/* Player 2 Label */}
          <div className="absolute top-2 right-4 text-red-400 font-bold text-sm">
            P2
          </div>

          {/* JUMP Button */}
          <button
            onTouchStart={(e) => handleTouchStart(2, "jump", e)}
            onTouchEnd={(e) => handleTouchEnd(2, "jump", e)}
            className="absolute bottom-32 right-20 w-28 h-28 bg-red-600/80 hover:bg-red-700/80 active:bg-red-800/90 active:scale-95 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg transition-all touch-none border-2 border-red-400/50"
            aria-label="Player 2 Jump"
          >
            <div className="flex flex-col items-center">
              <span className="text-3xl">⬆</span>
              <span className="text-xs mt-1">JUMP</span>
            </div>
          </button>

          {/* LEFT Button */}
          <button
            onTouchStart={(e) => handleTouchStart(2, "left", e)}
            onTouchEnd={(e) => handleTouchEnd(2, "left", e)}
            className="absolute bottom-4 right-32 w-24 h-24 bg-red-500/80 hover:bg-red-600/80 active:bg-red-700/90 active:scale-95 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg transition-all touch-none border-2 border-red-400/50"
            aria-label="Player 2 Left"
          >
            ←
          </button>

          {/* RIGHT Button */}
          <button
            onTouchStart={(e) => handleTouchStart(2, "right", e)}
            onTouchEnd={(e) => handleTouchEnd(2, "right", e)}
            className="absolute bottom-4 right-4 w-24 h-24 bg-red-500/80 hover:bg-red-600/80 active:bg-red-700/90 active:scale-95 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg transition-all touch-none border-2 border-red-400/50"
            aria-label="Player 2 Right"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
