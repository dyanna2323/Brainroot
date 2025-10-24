export interface BrainrotCharacter {
  id: string;
  name: string;
  emoji: string;
  color: string;
  sound: string;
  image: string;
}

export const brainrotCharacters: BrainrotCharacter[] = [
  {
    id: "1",
    name: "Cappuccino Assassino",
    emoji: "☕",
    color: "#374151",
    sound: "/sounds/background.mp3",
    image: "/characters/Coffee_Ninja_Character_7cca111d.png"
  },
  {
    id: "2",
    name: "Banana Monkeyito",
    emoji: "🍌",
    color: "#FBBF24",
    sound: "/sounds/hit.mp3",
    image: "/characters/Banana_Monkey_Character_d6d8c369.png"
  },
  {
    id: "3",
    name: "Sharko Nike",
    emoji: "🦈",
    color: "#3B82F6",
    sound: "/sounds/success.mp3",
    image: "/characters/Nike_Shark_Character_3cdbd61d.png"
  },
  {
    id: "4",
    name: "Baseballo Bambino",
    emoji: "⚾",
    color: "#92400E",
    sound: "/sounds/background.mp3",
    image: "/characters/Baseball_Bat_Character_82c111ce.png"
  },
  {
    id: "5",
    name: "Cammello Frigo",
    emoji: "🐫",
    color: "#D97706",
    sound: "/sounds/hit.mp3",
    image: "/characters/Camel_Fridge_Character_dc249e0f.png"
  },
  {
    id: "6",
    name: "Ballerina Cappucina",
    emoji: "🩰",
    color: "#EC4899",
    sound: "/sounds/success.mp3",
    image: "/characters/Coffee_Ballerina_Character_d5cce9ad.png"
  },
  {
    id: "7",
    name: "Crocodilo Aereo",
    emoji: "✈️",
    color: "#6B7280",
    sound: "/sounds/background.mp3",
    image: "/characters/Crocodile_Plane_Character_b71733b4.png"
  },
  {
    id: "8",
    name: "Elefante Sandalo",
    emoji: "🐘",
    color: "#10B981",
    sound: "/sounds/hit.mp3",
    image: "/characters/Elephant_Sandals_Character_57909640.png"
  },
  {
    id: "9",
    name: "Pane Muscolo",
    emoji: "💪",
    color: "#F59E0B",
    sound: "/sounds/success.mp3",
    image: "/characters/Bread_Bodybuilder_Character_c3f97959.png"
  },
  {
    id: "10",
    name: "Watermelone Felice",
    emoji: "🍉",
    color: "#EF4444",
    sound: "/sounds/background.mp3",
    image: "/characters/Watermelon_Character_0599dc35.png"
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
