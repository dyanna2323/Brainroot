# Brainrot Race - Two Player Mobile Racing Game

## Overview

Brainrot Race is a Fall Guys-style obstacle course racing game featuring two-player local multiplayer with mobile touch controls. Players select from a roster of quirky Brainrot meme characters and race through challenging 3D obstacle courses with auto-run physics. The game is designed for mobile and tablet devices, with intuitive touch controls for moving left/right and jumping. Players compete across 3 race courses, navigating moving barriers, rotating platforms, spinner hammers, and gap jumps. The first player to cross the finish line in each race earns a point, and the player with the most points after all courses wins. The game features vibrant 3D graphics powered by React Three Fiber, dynamic camera following, and responsive mobile-optimized controls.

## Recent Changes

**October 24, 2025** - Transformed into Fall Guys-style mobile race game
- Completely redesigned from quiz game to obstacle course racing
- Implemented mobile touch controls for both players (left, right, jump buttons)
- Added auto-run physics with constant forward movement
- Created obstacle course with 4 obstacle types: MovingBarrier, RotatingPlatform, SpinnerHammer, GapJump
- Implemented AABB collision detection system for obstacle interactions
- Added character selection screen with 10 Brainrot meme characters
- Built 3-race tournament system with countdown and results phases
- Created dynamic camera system that follows both players during races
- Designed mobile-friendly UI with touch-optimized buttons and overlays

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

**3D Rendering**: The application uses React Three Fiber (@react-three/fiber) as a React renderer for Three.js, enabling declarative 3D scene creation. Additional utilities from @react-three/drei provide helpers for common 3D elements like text, camera management, and 3D primitives. Post-processing effects are available through @react-three/postprocessing.

**UI Components**: The interface uses a comprehensive Radix UI component library for accessible, unstyled primitives, styled with Tailwind CSS. Components include dialogs, buttons, cards, and various form controls. The design system uses CSS custom properties for theming with support for light/dark modes.

**State Management**: Zustand is used for global state management with two main stores:
- `useBrainrotGame`: Manages game state including phases (menu, characterSelect, countdown, racing, results), player positions and physics, selected characters, touch control states, race timer, checkpoints, scoring, and winner determination
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

**Game Loop**: The game uses a frame-based update loop through React Three Fiber's `useFrame` hook. During the "racing" phase, players move forward automatically at constant speed while the physics system handles velocity, jumping, and landing. The game continuously checks for obstacle collisions using AABB (Axis-Aligned Bounding Box) detection and resolves collisions by pushing players out of obstacles. Finish line detection triggers when a player's Z position reaches 50 or greater. Game state transitions occur through discrete phases (menu → characterSelect → countdown → racing → results).

**Player Controls**: Mobile touch control system with separate controls for each player:
- Player 1 (left side): Left button, Right button, Jump button (blue theme)
- Player 2 (right side): Left button, Right button, Jump button (red theme)

Players auto-run forward constantly and use touch buttons to move left/right and jump over obstacles. The touch controls are only visible during the racing phase and use `touchstart`/`touchend` events to update the game state. Control state is stored in the Zustand store and accessed by the Player component to apply physics and movement.

**Round System**: Each game consists of 3 race courses. Before each race, a 3-second countdown prepares players. During racing, players navigate obstacles and compete to reach the finish line first. After someone finishes, a results screen shows the winner for 3 seconds before advancing to the next course or final results.

**Scoring**: First player to cross the finish line (Z >= 50) wins the race and earns 1 point. The game tracks total score across all 3 courses. After 3 races, the player with the most points is declared the overall winner. Guards prevent double-scoring if both players finish nearly simultaneously.

**Character Data**: Currently features 10 Brainrot meme characters (Tralalero Tralala, Tung Tung Sahur, Cappuccino Assassino, Ballerina Cappucina, Brr Brr Patapim, Pizza Pomodoro, Gelato Magnifico, Spaghetti Confetti, Mozzarella Bella, Risotto Perfetto), each with unique image representation and color scheme. Characters are purely cosmetic - all have identical racing physics.

**Obstacle System**: The obstacle course features 4 distinct obstacle types:
- **MovingBarrier**: Barriers that slide left and right, requiring timing to pass
- **RotatingPlatform**: Platforms that rotate continuously, challenging player positioning
- **SpinnerHammer**: Large rotating hammers that sweep across the course
- **GapJump**: Gaps in the track requiring precise jumps to clear

Obstacles are positioned throughout the 50-unit-long course and use AABB collision boxes for interaction detection.

## Game Components

**Core Game Files:**
- `client/src/lib/gameData.ts`: Character definitions with images, names, colors, and emojis
- `client/src/lib/stores/useBrainrotGame.ts`: Main game state management with Zustand - handles phases, physics, controls, scoring, timers
- `client/src/lib/collision.ts`: AABB collision detection utilities for obstacle interactions
- `client/src/components/Game.tsx`: Main game scene with camera system, obstacle collision detection, and finish line logic
- `client/src/components/GameUI.tsx`: UI overlay with menu, character selection, HUD, countdown, and results screens
- `client/src/components/Player.tsx`: 3D player character with auto-run physics, jumping, landing, and touch control input
- `client/src/components/TouchControls.tsx`: Mobile touch button interface for both players
- `client/src/components/ObstacleCourse.tsx`: 3D obstacle course terrain with all obstacle instances
- `client/src/components/MovingBarrier.tsx`: Sliding barrier obstacle component
- `client/src/components/RotatingPlatform.tsx`: Rotating platform obstacle component
- `client/src/components/SpinnerHammer.tsx`: Rotating hammer obstacle component
- `client/src/components/GapJump.tsx`: Gap jump obstacle component
- `client/src/components/GameArena.tsx`: 3D arena floor and grid
- `client/src/components/CharacterSelect.tsx`: Character selection screen with portrait grid

## Future Enhancements

Potential features for future development:
- More obstacle course variety with unique themes (ice, lava, space, jungle)
- Additional obstacle types (bouncing balls, treadmills, swinging pendulums, disappearing platforms)
- Mobile-specific optimizations for better touch responsiveness and performance
- Leaderboard system tracking fastest completion times per course
- Expanded character roster to 50+ unique Brainrot memes
- Cosmetic shop system with unlockable hats, trails, and emotes using earned points
- Online multiplayer support for remote mobile players
- Power-ups and boost pads for added gameplay variety
- Custom course editor for player-created obstacle layouts
- Daily challenges and seasonal events
- Replay system to watch race highlights

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

The game relies heavily on WebGL through Three.js for 3D rendering, Touch Events API for mobile input handling, and Web Audio API for sound playback.
