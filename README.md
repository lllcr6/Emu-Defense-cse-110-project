# CSE 110 Emu Defense

`CSE 110 Emu Defense` is a browser-based strategy and action game inspired by the Great Emu War.

You run a wheat farm under constant pressure from emus. The main game revolves around keeping your crops alive, managing your resources, and surviving as many days as you can.

## Gameplay

- Your main objective is to protect every crop on your farm.
- If the emus eat all of your crops, the game ends.
- You can pause the game from the in-game menu, save and exit to the main menu, then continue the same run later from the main menu.
- The hunting mini-game lets you fight emus directly and earn points by defeating them.
- The raid mini-game lets you sneak into emu territory, steal eggs, and sell them for money.
- Defense items such as barbed wire, sandbags, machine guns, and mines help you slow down, block, or defeat emus on the farm.
- The daily quiz covers emus, Great Emu War history, and gameplay tips, and a correct answer rewards you with a mine for future defense.
- The end-of-game leaderboard stores your previous scores and survival times in browser storage, so you can compare runs over time.

## Requirements

- Node.js
- npm

## Setup

1. Clone the repository.
2. Open the project directory in your terminal.
3. Install the dependencies:

```bash
npm install
```

## Run Locally

Start the development server:

```bash
npm run dev
```

Vite will print a local URL in the terminal. Open that address in your browser to play the game.

## Build for Production

Create a production-ready build:

```bash
npm run build
```

## Preview the Production Build

After building, preview the production version locally:

```bash
npm run preview
```

## Testing

Run the test suite:

```bash
npm run test
```

Open the interactive Vitest UI:

```bash
npm run test:ui
```

## Project Structure

- `src/` contains the game logic, controllers, views, and screens
- `public/` contains static assets such as audio files and images
- `package.json` defines the available scripts

## Tech Stack

- TypeScript
- Vite
- Konva

## Notes

- If the game does not load correctly, make sure dependencies are installed and restart the dev server.
