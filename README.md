# PixelNaruto

PixelNaruto is a browser pixel arcade game inspired by Pac-Man, with Naruto as the main character.

## Play Locally

Open `index.html` in a browser, or run a local server:

```bash
python3 -m http.server 5173
```

Then open:

```text
http://localhost:5173/
```

## Controls

- Arrow keys: move Naruto
- Pause button: pause/resume the game

## Game Rules

- Naruto has 3 lives.
- Each level has 5 scrolls.
- There are 5 different maze layouts.
- Akatsuki enemies move through the maze.
- Touching an Akatsuki removes 1 life and returns Naruto to the level start.
- After 5 completed levels, the game ends successfully.
