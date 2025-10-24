import { useEffect } from "react";
import { useBrainrotGame } from "@/lib/stores/useBrainrotGame";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export function GameUI() {
  const {
    phase,
    currentRound,
    totalRounds,
    timeRemaining,
    player1,
    player2,
    quizRound,
    startGame,
    restartGame,
    tick
  } = useBrainrotGame();
  
  useEffect(() => {
    if (phase === "playing") {
      const interval = setInterval(() => {
        tick();
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [phase, tick]);
  
  if (phase === "menu") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 z-10">
        <Card className="w-full max-w-2xl mx-4 bg-black/80 border-4 border-yellow-400">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 animate-pulse">
                🧠 BRAINROT QUIZ 🧠
              </h1>
              
              <p className="text-2xl text-white font-semibold">
                Italian Meme Edition
              </p>
              
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-lg border-2 border-blue-400">
                <h2 className="text-xl font-bold text-white mb-4">🎮 HOW TO PLAY</h2>
                <div className="text-white text-left space-y-2">
                  <p>🔊 Listen to the audio clue</p>
                  <p>🏃 Run to the correct character zone</p>
                  <p>⏱️ Answer before time runs out!</p>
                  <p>🏆 Most points after 5 rounds wins!</p>
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
                onClick={startGame}
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
  
  if (phase === "gameEnd") {
    const winner = player1.score > player2.score ? "Player 1" : 
                   player2.score > player1.score ? "Player 2" : "TIE";
    const winnerColor = player1.score > player2.score ? "blue" : 
                        player2.score > player1.score ? "red" : "purple";
    
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 z-10">
        <Card className="w-full max-w-2xl mx-4 bg-black/80 border-4 border-yellow-400">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              <h1 className="text-5xl font-bold text-white mb-4">
                🎉 GAME OVER 🎉
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
                  <p className="text-white mt-2">Correct: {player1.correctAnswers}/{totalRounds}</p>
                </div>
                <div className="bg-red-600/80 p-6 rounded-lg border-4 border-red-300">
                  <h3 className="text-2xl font-bold text-white">PLAYER 2 🔴</h3>
                  <p className="text-5xl font-bold text-white mt-4">{player2.score}</p>
                  <p className="text-white mt-2">Correct: {player2.correctAnswers}/{totalRounds}</p>
                </div>
              </div>
              
              <Button 
                onClick={restartGame}
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
  
  const showAnswer = phase === "roundEnd";
  
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-8">
        <Card className="bg-black/80 border-2 border-blue-400 pointer-events-auto">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-blue-400">PLAYER 1 🔵</h3>
              <p className="text-3xl font-bold text-white mt-2">{player1.score}</p>
              {player1.currentVote !== null && (
                <p className="text-sm text-blue-300 mt-1">
                  Voting: Zone {player1.currentVote + 1}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/90 border-4 border-yellow-400 pointer-events-auto">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-yellow-400">
                ROUND {currentRound}/{totalRounds}
              </h3>
              <p className="text-5xl font-bold text-white mt-2">
                {timeRemaining}
              </p>
              <p className="text-sm text-gray-300 mt-1">seconds</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/80 border-2 border-red-400 pointer-events-auto">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-red-400">PLAYER 2 🔴</h3>
              <p className="text-3xl font-bold text-white mt-2">{player2.score}</p>
              {player2.currentVote !== null && (
                <p className="text-sm text-red-300 mt-1">
                  Voting: Zone {player2.currentVote + 1}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {showAnswer && quizRound && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Card className="bg-green-600/95 border-4 border-green-300 pointer-events-auto">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-4">
                  ✅ CORRECT ANSWER ✅
                </h2>
                <p className="text-6xl mb-2">{quizRound.correctCharacter.emoji}</p>
                <p className="text-3xl font-bold text-white">
                  {quizRound.correctCharacter.name}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <Card className="bg-purple-900/80 border-2 border-purple-400 pointer-events-auto">
          <CardContent className="p-4">
            <p className="text-white text-center">
              🔊 Click the red button in the center to hear the sound! 🔊
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
