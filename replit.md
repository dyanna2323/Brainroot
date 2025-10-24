# Brainrot Quiz - Two Player Meme Game

## Overview

Brainrot Quiz is a two-player local multiplayer 3D quiz game where players compete to identify Italian Brainrot meme characters based on audio clues. Players navigate a colorful 3D arena using separate keyboard controls, listen to sound clips, and race to the correct character voting zones to score points. The game features a vibrant meme-themed design with React Three Fiber 3D graphics, a 5-round tournament system, real-time scoring, and playful UI elements.

## Recent Changes

**October 24, 2025** - Initial MVP Release
- Implemented complete two-player local quiz game with 3D graphics
- Added 10 Italian Brainrot meme characters with emoji representations
- Built dual keyboard control system (Player 1: WASD, Player 2: Arrow Keys)
- Created round-based gameplay with 30-second timer per round
- Implemented voting zone detection and automatic scoring
- Added menu screen, game HUD, and end-game winner declaration
- Integrated sound playback system for audio clues

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, built using Vite as the build tool and development server.

**3D Rendering**: The application uses React Three Fiber (@react-three/fiber) as a React renderer for Three.js, enabling declarative 3D scene creation. Additional utilities from @react-three/drei provide helpers for common 3D elements like text, keyboard controls, and camera management. Post-processing effects are available through @react-three/postprocessing.

**UI Components**: The interface uses a comprehensive Radix UI component library for accessible, unstyled primitives, styled with Tailwind CSS. Components include dialogs, buttons, cards, and various form controls. The design system uses CSS custom properties for theming with support for light/dark modes.

**State Management**: Zustand is used for global state management with two main stores:
- `useBrainrotGame`: Manages game state including phases (menu, playing, roundEnd, gameEnd), player positions, scores, voting, rounds, and timer
- `useGame`: A simpler state manager for basic game phases (ready, playing, ended)
- `useAudio`: Manages audio playback and mute state for background music and sound effects

**Routing**: The application appears to be a single-page game without complex routing needs, though React Query (@tanstack/react-query) is configured for potential API data fetching.

**Styling**: Tailwind CSS with PostCSS for processing, custom font loading via @fontsource/inter, and CSS variables for theming.

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**Development Server**: Custom Vite middleware integration for hot module replacement during development. The server serves the built static assets in production.

**API Structure**: The routes are defined in `server/routes.ts` with a pattern to prefix all routes with `/api`. The current implementation has a placeholder route structure ready for CRUD operations.

**Storage Layer**: Abstracted through an `IStorage` interface with a current in-memory implementation (`MemStorage`). This allows for easy swapping to a database-backed storage solution. The storage pattern includes methods for user operations (getUser, getUserByUsername, createUser).

### Data Storage Solutions

**Current Implementation**: In-memory storage using JavaScript Maps for development/testing purposes.

**Planned Database**: The project is configured for PostgreSQL through Drizzle ORM:
- Database client: @neondatabase/serverless (Neon serverless Postgres)
- ORM: Drizzle with schema-first approach
- Schema location: `shared/schema.ts`
- Migration output: `./migrations` directory

**Schema Design**: Currently defines a simple users table with id (serial primary key), username (unique text), and password (text). The schema uses Drizzle-Zod for validation schema generation.

**Rationale**: The in-memory storage allows rapid prototyping without database setup overhead. The storage interface abstraction means the transition to PostgreSQL requires only implementing the interface methods without changing consumer code.

### Authentication and Authorization

**Current State**: Basic user schema exists but no authentication flow is implemented yet. The schema includes username/password fields suggesting planned credential-based authentication.

**Session Management**: Package dependency on `connect-pg-simple` indicates planned PostgreSQL-backed session storage for Express sessions.

**Approach**: The architecture suggests a traditional session-based authentication pattern with credentials stored in the database and sessions persisted to PostgreSQL.

### Game Architecture

**Game Loop**: The game uses a timer-based tick system that decrements `timeRemaining` every second during the "playing" phase. Game state transitions occur through discrete phases (menu → playing → roundEnd → gameEnd).

**Player Controls**: Dual keyboard control scheme using KeyboardControls from @react-three/drei:
- Player 1: WASD keys
- Player 2: Arrow keys

Players navigate the 3D arena to "vote" by entering character zones, detected through position-based collision logic.

**Round System**: Each game consists of 5 rounds. Each round presents a quiz with 3 character options displayed in voting zones, one correct answer, and a 30-second time limit. The game generates new rounds ensuring no character ID is reused across the game session.

**Scoring**: Players earn 1 point for each correct answer. The game tracks both total score and correct answer count per player, declaring a winner at the end of 5 rounds.

**Character Data**: Currently features 10 Italian Brainrot meme characters (Tralalero Tralala, Tung Tung Sahur, Cappuccino Assassino, Ballerina Cappucina, Brr Brr Patapim, Pizza Pomodoro, Gelato Magnifico, Spaghetti Confetti, Mozzarella Bella, Risotto Perfetto), each with unique emoji representation and color scheme. Audio clues currently use placeholder sounds from the available sound library.

## Game Components

**Core Game Files:**
- `client/src/lib/gameData.ts`: Character definitions and round generation logic
- `client/src/lib/stores/useBrainrotGame.ts`: Main game state management with Zustand
- `client/src/components/Game.tsx`: Main game scene with controls and voting detection
- `client/src/components/GameUI.tsx`: UI overlay with menu, HUD, and end screen
- `client/src/components/Player.tsx`: 3D player character representation
- `client/src/components/VotingZone.tsx`: Interactive character voting areas
- `client/src/components/SoundButton.tsx`: Audio playback button
- `client/src/components/GameArena.tsx`: 3D arena floor and grid

## Future Enhancements

Potential features for future development:
- Cosmetic shop system with unlockable hats and skins using earned points
- Online multiplayer support for remote players
- Expanded character roster to 50+ memes
- Arena shooter mode as alternative gameplay
- Global leaderboard and player statistics tracking
- Custom audio recordings for each character's unique sound

## External Dependencies

### Third-Party Services

**Neon Database**: Serverless PostgreSQL hosting service accessed via `@neondatabase/serverless` driver. Connection configured through `DATABASE_URL` environment variable.

### Development Tools

**Vite**: Build tool and dev server with plugins for React, GLSL shader support (vite-plugin-glsl), and Replit-specific error overlay (@replit/vite-plugin-runtime-error-modal).

**Drizzle Kit**: Database migration and schema management tool for Drizzle ORM.

### Asset Handling

The Vite configuration explicitly supports 3D model formats (GLTF, GLB) and audio files (MP3, OGG, WAV) through the `assetsInclude` option, indicating the game loads character models and sound clips as static assets.

### UI Libraries

- **Radix UI**: Complete suite of unstyled, accessible component primitives
- **Lucide React**: Icon library
- **class-variance-authority**: Utility for managing component variants with Tailwind
- **cmdk**: Command menu component
- **date-fns**: Date manipulation library

### Browser APIs

The game relies heavily on Web Audio API for sound playback, WebGL through Three.js for 3D rendering, and standard DOM APIs for keyboard input handling.