import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { type BrainrotCharacter } from "../gameData";

export type GamePhase = "menu" | "characterSelect" | "countdown" | "racing" | "results";

interface PlayerState {
  position: [number, number, number];
  score: number;
}

interface PlayerPhysics {
  velocity: [number, number, number];
  isGrounded: boolean;
}

interface TouchControlState {
  left: boolean;
  right: boolean;
  jump: boolean;
}

interface BrainrotGameState {
  gamePhase: GamePhase;
  currentRound: number;
  currentCourse: number;
  totalCourses: number;
  
  selectedCharacters: {
    player1: BrainrotCharacter | null;
    player2: BrainrotCharacter | null;
  };
  
  playerPhysics: {
    player1: PlayerPhysics;
    player2: PlayerPhysics;
  };
  
  touchControls: {
    player1: TouchControlState;
    player2: TouchControlState;
  };
  
  raceTimer: number;
  raceWinner: 1 | 2 | null;
  
  checkpoints: {
    player1: number[];
    player2: number[];
  };
  
  player1: PlayerState;
  player2: PlayerState;
  
  // Timeout IDs for cleanup
  countdownTimeoutId: NodeJS.Timeout | null;
  resultsTimeoutId: NodeJS.Timeout | null;
  
  // Actions
  setPhase: (phase: GamePhase) => void;
  selectCharacter: (player: 1 | 2, character: BrainrotCharacter) => void;
  startCountdown: () => void;
  startRace: () => void;
  updatePlayerPhysics: (player: 1 | 2, physics: { velocity: [number, number, number]; isGrounded: boolean }) => void;
  reachCheckpoint: (player: 1 | 2, checkpointId: number) => void;
  finishRace: (player: 1 | 2) => void;
  nextCourse: () => void;
  resetToMenu: () => void;
  setPlayerPosition: (player: 1 | 2, position: [number, number, number]) => void;
  setTouchControl: (player: 1 | 2, control: 'left' | 'right' | 'jump', pressed: boolean) => void;
}

const initialPlayerState: PlayerState = {
  position: [0, 0.5, 0],
  score: 0
};

const initialPlayerPhysics: PlayerPhysics = {
  velocity: [0, 0, 0],
  isGrounded: true
};

const initialTouchControlState: TouchControlState = {
  left: false,
  right: false,
  jump: false
};

export const useBrainrotGame = create<BrainrotGameState>()(
  subscribeWithSelector((set, get) => ({
    gamePhase: "menu",
    currentRound: 0,
    currentCourse: 1,
    totalCourses: 3,
    
    selectedCharacters: {
      player1: null,
      player2: null
    },
    
    playerPhysics: {
      player1: { ...initialPlayerPhysics },
      player2: { ...initialPlayerPhysics }
    },
    
    touchControls: {
      player1: { ...initialTouchControlState },
      player2: { ...initialTouchControlState }
    },
    
    raceTimer: 0,
    raceWinner: null,
    
    checkpoints: {
      player1: [],
      player2: []
    },
    
    player1: { ...initialPlayerState, position: [-3, 0.5, 5] },
    player2: { ...initialPlayerState, position: [3, 0.5, 5] },
    
    countdownTimeoutId: null,
    resultsTimeoutId: null,
    
    setPhase: (phase) => {
      set({ gamePhase: phase });
    },
    
    selectCharacter: (player, character) => {
      set({
        selectedCharacters: {
          ...get().selectedCharacters,
          [`player${player}`]: character
        }
      });
    },
    
    startCountdown: () => {
      // Clear any existing countdown timeout
      const { countdownTimeoutId } = get();
      if (countdownTimeoutId !== null) {
        clearTimeout(countdownTimeoutId);
      }
      
      set({ gamePhase: "countdown" });
      
      // After 3 seconds, start the race
      const timeoutId = setTimeout(() => {
        get().startRace();
      }, 3000);
      
      set({ countdownTimeoutId: timeoutId });
    },
    
    startRace: () => {
      set({
        gamePhase: "racing",
        raceTimer: 0,
        raceWinner: null,
        checkpoints: {
          player1: [],
          player2: []
        }
      });
    },
    
    updatePlayerPhysics: (player, physics) => {
      set({
        playerPhysics: {
          ...get().playerPhysics,
          [`player${player}`]: physics
        }
      });
    },
    
    reachCheckpoint: (player, checkpointId) => {
      const currentCheckpoints = get().checkpoints[`player${player}`];
      
      // Only add if not already reached
      if (!currentCheckpoints.includes(checkpointId)) {
        set({
          checkpoints: {
            ...get().checkpoints,
            [`player${player}`]: [...currentCheckpoints, checkpointId]
          }
        });
      }
    },
    
    finishRace: (player) => {
      const { gamePhase, raceWinner, player1, player2, currentCourse, totalCourses, resultsTimeoutId } = get();
      
      // Guard: Only award points if we're still in the racing phase
      if (gamePhase !== "racing") {
        return;
      }
      
      // Guard: Only award points if no winner has been declared yet
      if (raceWinner !== null) {
        return;
      }
      
      // Award points based on who finished first
      const newPlayer1 = { ...player1 };
      const newPlayer2 = { ...player2 };
      
      if (player === 1) {
        newPlayer1.score += 1;
      } else {
        newPlayer2.score += 1;
      }
      
      set({
        gamePhase: "results",
        player1: newPlayer1,
        player2: newPlayer2,
        raceWinner: player
      });
      
      // Clear any existing results timeout
      if (resultsTimeoutId !== null) {
        clearTimeout(resultsTimeoutId);
      }
      
      // Auto-advance after showing results
      const timeoutId = setTimeout(() => {
        if (currentCourse >= totalCourses) {
          // Game over - show final results
          set({ gamePhase: "results" });
        } else {
          get().nextCourse();
        }
      }, 3000);
      
      set({ resultsTimeoutId: timeoutId });
    },
    
    nextCourse: () => {
      const { currentCourse, totalCourses, countdownTimeoutId } = get();
      
      if (currentCourse >= totalCourses) {
        set({ gamePhase: "results" });
        return;
      }
      
      set({
        gamePhase: "countdown",
        currentCourse: currentCourse + 1,
        currentRound: get().currentRound + 1,
        raceTimer: 0,
        raceWinner: null,
        checkpoints: {
          player1: [],
          player2: []
        },
        playerPhysics: {
          player1: { ...initialPlayerPhysics },
          player2: { ...initialPlayerPhysics }
        },
        player1: { ...get().player1, position: [-3, 0.5, 5] },
        player2: { ...get().player2, position: [3, 0.5, 5] }
      });
      
      // Clear any existing countdown timeout
      if (countdownTimeoutId !== null) {
        clearTimeout(countdownTimeoutId);
      }
      
      // Start the race after countdown
      const timeoutId = setTimeout(() => {
        get().startRace();
      }, 3000);
      
      set({ countdownTimeoutId: timeoutId });
    },
    
    resetToMenu: () => {
      const { countdownTimeoutId, resultsTimeoutId } = get();
      
      // Clear all active timeouts
      if (countdownTimeoutId !== null) {
        clearTimeout(countdownTimeoutId);
      }
      if (resultsTimeoutId !== null) {
        clearTimeout(resultsTimeoutId);
      }
      
      set({
        gamePhase: "menu",
        currentRound: 0,
        currentCourse: 1,
        raceWinner: null,
        selectedCharacters: {
          player1: null,
          player2: null
        },
        playerPhysics: {
          player1: { ...initialPlayerPhysics },
          player2: { ...initialPlayerPhysics }
        },
        touchControls: {
          player1: { ...initialTouchControlState },
          player2: { ...initialTouchControlState }
        },
        raceTimer: 0,
        checkpoints: {
          player1: [],
          player2: []
        },
        player1: { ...initialPlayerState, position: [-3, 0.5, 5] },
        player2: { ...initialPlayerState, position: [3, 0.5, 5] },
        countdownTimeoutId: null,
        resultsTimeoutId: null
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
    
    setTouchControl: (player, control, pressed) => {
      set({
        touchControls: {
          ...get().touchControls,
          [`player${player}`]: {
            ...get().touchControls[`player${player}`],
            [control]: pressed
          }
        }
      });
    }
  }))
);
