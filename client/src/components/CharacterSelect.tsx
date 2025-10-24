import { useState } from "react";
import { brainrotCharacters } from "@/lib/gameData";
import { useBrainrotGame } from "@/lib/stores/useBrainrotGame";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CharacterSelect() {
  const { selectedCharacters, selectCharacter, startCountdown } = useBrainrotGame();
  const [selectingFor, setSelectingFor] = useState<1 | 2>(1);

  const handleCharacterClick = (character: typeof brainrotCharacters[0]) => {
    selectCharacter(selectingFor, character);
    // Auto-switch to the other player after selection
    if (selectingFor === 1 && !selectedCharacters.player2) {
      setSelectingFor(2);
    } else if (selectingFor === 2 && !selectedCharacters.player1) {
      setSelectingFor(1);
    }
  };

  const bothPlayersSelected = selectedCharacters.player1 && selectedCharacters.player2;

  const getCharacterBorder = (characterId: string) => {
    const isPlayer1 = selectedCharacters.player1?.id === characterId;
    const isPlayer2 = selectedCharacters.player2?.id === characterId;
    
    if (isPlayer1 && isPlayer2) {
      return "border-4 border-purple-500 ring-4 ring-purple-300";
    } else if (isPlayer1) {
      return "border-4 border-blue-500 ring-4 ring-blue-300";
    } else if (isPlayer2) {
      return "border-4 border-red-500 ring-4 ring-red-300";
    }
    return "border-2 border-gray-600";
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 overflow-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 mb-4 animate-pulse">
            🏁 CHARACTER SELECT 🏁
          </h1>
          <p className="text-2xl text-white font-semibold">
            Choose Your Brainrot Racer!
          </p>
        </div>

        {/* Player Selection Indicators */}
        <div className="flex justify-center gap-8 mb-8">
          {/* Player 1 Card */}
          <Card 
            className={`w-64 cursor-pointer transition-all ${
              selectingFor === 1 
                ? 'bg-blue-600 border-4 border-blue-300 scale-105' 
                : 'bg-blue-900/50 border-2 border-blue-600'
            }`}
            onClick={() => setSelectingFor(1)}
          >
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  PLAYER 1 🔵
                </h3>
                {selectedCharacters.player1 ? (
                  <div className="space-y-2">
                    <div className="text-5xl">{selectedCharacters.player1.emoji}</div>
                    <p className="text-white font-semibold">{selectedCharacters.player1.name}</p>
                    <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden border-2 border-white">
                      <img 
                        src={selectedCharacters.player1.image} 
                        alt={selectedCharacters.player1.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="py-8">
                    <p className="text-white/60 text-lg">Click to select</p>
                    <p className="text-white/40 text-sm mt-2">WASD controls</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Player 2 Card */}
          <Card 
            className={`w-64 cursor-pointer transition-all ${
              selectingFor === 2 
                ? 'bg-red-600 border-4 border-red-300 scale-105' 
                : 'bg-red-900/50 border-2 border-red-600'
            }`}
            onClick={() => setSelectingFor(2)}
          >
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  PLAYER 2 🔴
                </h3>
                {selectedCharacters.player2 ? (
                  <div className="space-y-2">
                    <div className="text-5xl">{selectedCharacters.player2.emoji}</div>
                    <p className="text-white font-semibold">{selectedCharacters.player2.name}</p>
                    <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden border-2 border-white">
                      <img 
                        src={selectedCharacters.player2.image} 
                        alt={selectedCharacters.player2.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="py-8">
                    <p className="text-white/60 text-lg">Click to select</p>
                    <p className="text-white/40 text-sm mt-2">Arrow keys</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Currently Selecting Indicator */}
        <div className="text-center mb-6">
          <div className={`inline-block px-6 py-3 rounded-lg font-bold text-xl ${
            selectingFor === 1 
              ? 'bg-blue-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            Now Selecting for: {selectingFor === 1 ? 'PLAYER 1 🔵' : 'PLAYER 2 🔴'}
          </div>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {brainrotCharacters.map((character) => {
            const borderClass = getCharacterBorder(character.id);
            const isSelected = 
              selectedCharacters.player1?.id === character.id || 
              selectedCharacters.player2?.id === character.id;

            return (
              <Card
                key={character.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-2xl ${borderClass} bg-gray-900/90`}
                onClick={() => handleCharacterClick(character)}
              >
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    {/* Character Image */}
                    <div className="w-full h-[150px] rounded-lg overflow-hidden bg-gray-800">
                      <img 
                        src={character.image} 
                        alt={character.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Character Emoji */}
                    <div className="text-4xl">{character.emoji}</div>
                    
                    {/* Character Name */}
                    <p className="text-white font-bold text-sm leading-tight">
                      {character.name}
                    </p>
                    
                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="flex justify-center gap-1">
                        {selectedCharacters.player1?.id === character.id && (
                          <span className="text-blue-400 text-xs font-bold">P1</span>
                        )}
                        {selectedCharacters.player2?.id === character.id && (
                          <span className="text-red-400 text-xs font-bold">P2</span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Start Race Button */}
        <div className="flex justify-center pb-8">
          <Button
            onClick={startCountdown}
            disabled={!bothPlayersSelected}
            size="lg"
            className={`text-3xl px-16 py-8 font-bold transition-all duration-300 ${
              bothPlayersSelected
                ? 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white border-4 border-green-300 shadow-lg hover:scale-105 animate-pulse'
                : 'bg-gray-600 text-gray-400 border-4 border-gray-500 cursor-not-allowed'
            }`}
          >
            {bothPlayersSelected ? '🏁 START RACE! 🏁' : '⏳ Select Both Players ⏳'}
          </Button>
        </div>

        {/* Instructions */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-black/70 border-2 border-yellow-400">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-yellow-400 text-center mb-4">
                📋 HOW TO SELECT
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-white">
                <div className="space-y-2">
                  <p>1️⃣ Click on a player card (blue or red) to choose who you're selecting for</p>
                  <p>2️⃣ Click on a character to select it for that player</p>
                </div>
                <div className="space-y-2">
                  <p>3️⃣ Both players can choose the same character!</p>
                  <p>4️⃣ Once both players have selected, click START RACE!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
