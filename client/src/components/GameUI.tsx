import { useBrainrotGame } from "@/lib/stores/useBrainrotGame";
import { CharacterSelect } from "./CharacterSelect";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useEffect, useState } from "react";

export function GameUI() {
  const {
    gamePhase,
    currentCourse,
    totalCourses,
    player1,
    player2,
    raceWinner,
    setPhase,
    resetToMenu
  } = useBrainrotGame();
  
  const [countdown, setCountdown] = useState(3);
  
  useEffect(() => {
    if (gamePhase === "countdown") {
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gamePhase]);
  
  if (gamePhase === "menu") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 z-10">
        <Card className="w-full max-w-2xl mx-4 bg-black/80 border-4 border-yellow-400">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 animate-pulse">
                🏁 BRAINROT RACER 🏁
              </h1>
              
              <p className="text-2xl text-white font-semibold">
                Ultimate Meme Racing Championship
              </p>
              
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-lg border-2 border-blue-400">
                <h2 className="text-xl font-bold text-white mb-4">🎮 HOW TO PLAY</h2>
                <div className="text-white text-left space-y-2">
                  <p>🏎️ Choose your brainrot character</p>
                  <p>🏃 Race to the finish line!</p>
                  <p>⚡ Use WASD or Arrow Keys to move</p>
                  <p>🏆 First to finish wins the race!</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-600 p-4 rounded-lg border-2 border-blue-300">
                  <h3 className="font-bold text-white text-lg">PLAYER 1 🔵</h3>
                  <p className="text-white mt-2">WASD to move</p>
                </div>
                <div className="bg-red-600 p-4 rounded-lg border-2 border-red-300">
                  <h3 className="font-bold text-white text-lg">PLAYER 2 🔴</h3>
                  <p className="text-white mt-2">Arrow Keys to move</p>
                </div>
              </div>
              
              <Button 
                onClick={() => setPhase('characterSelect')}
                className="text-2xl px-12 py-8 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold border-4 border-green-300 shadow-lg transform hover:scale-105 transition-transform"
              >
                🎮 START GAME 🎮
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (gamePhase === "characterSelect") {
    return <CharacterSelect />;
  }
  
  if (gamePhase === "countdown") {
    return (
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.9)] animate-pulse">
            {countdown > 0 ? countdown : 'GO!'}
          </h1>
          <p className="text-3xl text-white font-bold mt-4 drop-shadow-lg">
            Race {currentCourse} of {totalCourses}
          </p>
        </div>
      </div>
    );
  }
  
  if (gamePhase === "racing") {
    return (
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-8">
          <Card className="bg-black/80 border-2 border-blue-400 pointer-events-auto">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-lg font-bold text-blue-400">PLAYER 1 🔵</h3>
                <p className="text-3xl font-bold text-white mt-2">{player1.score}</p>
                <p className="text-sm text-blue-300 mt-1">Wins</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/90 border-4 border-yellow-400 pointer-events-auto">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-lg font-bold text-yellow-400">
                  RACE {currentCourse}/{totalCourses}
                </h3>
                <p className="text-2xl font-bold text-white mt-2">
                  🏁 RACING 🏁
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/80 border-2 border-red-400 pointer-events-auto">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-lg font-bold text-red-400">PLAYER 2 🔴</h3>
                <p className="text-3xl font-bold text-white mt-2">{player2.score}</p>
                <p className="text-sm text-red-300 mt-1">Wins</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (gamePhase === "results") {
    const isFinalResults = currentCourse >= totalCourses;
    const winner = player1.score > player2.score ? "Player 1" : 
                   player2.score > player1.score ? "Player 2" : "TIE";
    const winnerColor = player1.score > player2.score ? "blue" : 
                        player2.score > player1.score ? "red" : "purple";
    
    if (isFinalResults) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 z-10">
          <Card className="w-full max-w-2xl mx-4 bg-black/80 border-4 border-yellow-400">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                <h1 className="text-5xl font-bold text-white mb-4">
                  🎉 CHAMPIONSHIP COMPLETE 🎉
                </h1>
                
                {winner !== "TIE" ? (
                  <h2 className={`text-6xl font-bold text-${winnerColor}-500 animate-pulse`}>
                    {winner} WINS! 🏆
                  </h2>
                ) : (
                  <h2 className="text-6xl font-bold text-purple-500 animate-pulse">
                    IT'S A TIE! 🤝
                  </h2>
                )}
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-blue-600/80 p-6 rounded-lg border-4 border-blue-300">
                    <h3 className="text-2xl font-bold text-white">PLAYER 1 🔵</h3>
                    <p className="text-5xl font-bold text-white mt-4">{player1.score}</p>
                    <p className="text-white mt-2">Races Won</p>
                  </div>
                  <div className="bg-red-600/80 p-6 rounded-lg border-4 border-red-300">
                    <h3 className="text-2xl font-bold text-white">PLAYER 2 🔴</h3>
                    <p className="text-5xl font-bold text-white mt-4">{player2.score}</p>
                    <p className="text-white mt-2">Races Won</p>
                  </div>
                </div>
                
                <Button 
                  onClick={resetToMenu}
                  className="text-2xl px-12 py-8 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold border-4 border-green-300 shadow-lg transform hover:scale-105 transition-transform mt-8"
                >
                  🔄 PLAY AGAIN 🔄
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    return (
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
        <Card className="bg-black/90 border-4 border-yellow-400 pointer-events-auto">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold text-white">
                🏁 RACE COMPLETE 🏁
              </h1>
              {raceWinner && (
                <div>
                  <p className="text-3xl font-bold text-white mt-4">
                    Player {raceWinner} Wins This Race!
                  </p>
                  <p className={`text-6xl mt-4 ${raceWinner === 1 ? 'text-blue-400' : 'text-red-400'}`}>
                    {raceWinner === 1 ? '🔵' : '🔴'}
                  </p>
                </div>
              )}
              <div className="flex justify-center gap-8 mt-6">
                <div className="text-center">
                  <p className="text-blue-400 font-bold text-lg">P1</p>
                  <p className="text-white text-4xl font-bold">{player1.score}</p>
                </div>
                <div className="text-white text-2xl font-bold self-center">-</div>
                <div className="text-center">
                  <p className="text-red-400 font-bold text-lg">P2</p>
                  <p className="text-white text-4xl font-bold">{player2.score}</p>
                </div>
              </div>
              <p className="text-gray-300 text-lg mt-4">
                Next race starting soon...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return null;
}
