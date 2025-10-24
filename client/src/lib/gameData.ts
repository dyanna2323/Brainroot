export interface BrainrotCharacter {
  id: string;
  name: string;
  emoji: string;
  color: string;
  sound: string;
}

export const brainrotCharacters: BrainrotCharacter[] = [
  {
    id: "1",
    name: "Tralalero Tralala",
    emoji: "🦈",
    color: "#3B82F6",
    sound: "/sounds/background.mp3"
  },
  {
    id: "2",
    name: "Tung Tung Tung Sahur",
    emoji: "🪵",
    color: "#8B4513",
    sound: "/sounds/hit.mp3"
  },
  {
    id: "3",
    name: "Cappuccino Assassino",
    emoji: "☕",
    color: "#D97706",
    sound: "/sounds/success.mp3"
  },
  {
    id: "4",
    name: "Ballerina Cappucina",
    emoji: "🩰",
    color: "#EC4899",
    sound: "/sounds/background.mp3"
  },
  {
    id: "5",
    name: "Brr Brr Patapim",
    emoji: "🎵",
    color: "#10B981",
    sound: "/sounds/hit.mp3"
  },
  {
    id: "6",
    name: "Pizza Pomodoro",
    emoji: "🍕",
    color: "#EF4444",
    sound: "/sounds/success.mp3"
  },
  {
    id: "7",
    name: "Gelato Magnifico",
    emoji: "🍦",
    color: "#A855F7",
    sound: "/sounds/background.mp3"
  },
  {
    id: "8",
    name: "Spaghetti Confetti",
    emoji: "🍝",
    color: "#F59E0B",
    sound: "/sounds/hit.mp3"
  },
  {
    id: "9",
    name: "Mozzarella Bella",
    emoji: "🧀",
    color: "#FBBF24",
    sound: "/sounds/success.mp3"
  },
  {
    id: "10",
    name: "Risotto Perfetto",
    emoji: "🍚",
    color: "#6366F1",
    sound: "/sounds/background.mp3"
  }
];

export interface QuizRound {
  correctCharacter: BrainrotCharacter;
  options: BrainrotCharacter[];
}

export function generateRound(usedIds: Set<string>): QuizRound {
  const availableCharacters = brainrotCharacters.filter(c => !usedIds.has(c.id));
  
  if (availableCharacters.length < 3) {
    usedIds.clear();
    return generateRound(usedIds);
  }
  
  const shuffled = [...availableCharacters].sort(() => Math.random() - 0.5);
  const correctCharacter = shuffled[0];
  const options = shuffled.slice(0, 3).sort(() => Math.random() - 0.5);
  
  usedIds.add(correctCharacter.id);
  
  return {
    correctCharacter,
    options
  };
}
