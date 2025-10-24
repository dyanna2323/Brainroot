import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { generateRound, type QuizRound, type BrainrotCharacter } from "../gameData";

export type GamePhase = "menu" | "playing" | "voting" | "roundEnd" | "gameEnd";

interface PlayerState {
  position: [number, number, number];
  score: number;
  currentVote: number | null;
  correctAnswers: number;
}

interface BrainrotGameState {
  phase: GamePhase;
  currentRound: number;
  totalRounds: number;
  quizRound: QuizRound | null;
  timeRemaining: number;
  usedCharacterIds: Set<string>;
  
  player1: PlayerState;
  player2: PlayerState;
  
  startGame: () => void;
  nextRound: () => void;
  setPlayerPosition: (player: 1 | 2, position: [number, number, number]) => void;
  setPlayerVote: (player: 1 | 2, voteIndex: number | null) => void;
  submitVotes: () => void;
  tick: () => void;
  restartGame: () => void;
  setPhase: (phase: GamePhase) => void;
}

const initialPlayerState: PlayerState = {
  position: [0, 0.5, 0],
  score: 0,
  currentVote: null,
  correctAnswers: 0
};

export const useBrainrotGame = create<BrainrotGameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "menu",
    currentRound: 0,
    totalRounds: 5,
    quizRound: null,
    timeRemaining: 30,
    usedCharacterIds: new Set(),
    
    player1: { ...initialPlayerState, position: [-3, 0.5, 5] },
    player2: { ...initialPlayerState, position: [3, 0.5, 5] },
    
    startGame: () => {
      const usedIds = new Set<string>();
      const round = generateRound(usedIds);
      
      set({
        phase: "playing",
        currentRound: 1,
        quizRound: round,
        timeRemaining: 30,
        usedCharacterIds: usedIds,
        player1: { ...initialPlayerState, position: [-3, 0.5, 5] },
        player2: { ...initialPlayerState, position: [3, 0.5, 5] }
      });
    },
    
    nextRound: () => {
      const { currentRound, totalRounds, usedCharacterIds } = get();
      
      if (currentRound >= totalRounds) {
        set({ phase: "gameEnd" });
        return;
      }
      
      const round = generateRound(usedCharacterIds);
      
      set({
        phase: "playing",
        currentRound: currentRound + 1,
        quizRound: round,
        timeRemaining: 30,
        player1: { ...get().player1, currentVote: null },
        player2: { ...get().player2, currentVote: null }
      });
    },
    
    setPlayerPosition: (player, position) => {
      set({
        [`player${player}`]: {
          ...get()[`player${player}`],
          position
        }
      });
    },
    
    setPlayerVote: (player, voteIndex) => {
      set({
        [`player${player}`]: {
          ...get()[`player${player}`],
          currentVote: voteIndex
        }
      });
    },
    
    submitVotes: () => {
      const { player1, player2, quizRound } = get();
      
      if (!quizRound) return;
      
      const correctIndex = quizRound.options.findIndex(
        opt => opt.id === quizRound.correctCharacter.id
      );
      
      let newPlayer1 = { ...player1 };
      let newPlayer2 = { ...player2 };
      
      if (player1.currentVote === correctIndex) {
        newPlayer1.score += 1;
        newPlayer1.correctAnswers += 1;
      }
      
      if (player2.currentVote === correctIndex) {
        newPlayer2.score += 1;
        newPlayer2.correctAnswers += 1;
      }
      
      set({
        phase: "roundEnd",
        player1: newPlayer1,
        player2: newPlayer2
      });
      
      setTimeout(() => {
        get().nextRound();
      }, 3000);
    },
    
    tick: () => {
      const { timeRemaining, phase } = get();
      
      if (phase !== "playing") return;
      
      if (timeRemaining <= 0) {
        get().submitVotes();
        return;
      }
      
      set({ timeRemaining: timeRemaining - 1 });
    },
    
    restartGame: () => {
      const usedIds = new Set<string>();
      const round = generateRound(usedIds);
      
      set({
        phase: "playing",
        currentRound: 1,
        quizRound: round,
        timeRemaining: 30,
        usedCharacterIds: usedIds,
        player1: { ...initialPlayerState, position: [-3, 0.5, 5] },
        player2: { ...initialPlayerState, position: [3, 0.5, 5] }
      });
    },
    
    setPhase: (phase) => {
      set({ phase });
    }
  }))
);
