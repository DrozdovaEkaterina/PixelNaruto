const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.tabIndex = 0;
ctx.imageSmoothingEnabled = false;

const levelText = document.getElementById("levelText");
const livesText = document.getElementById("livesText");
const scoreText = document.getElementById("scoreText");
const pauseBtn = document.getElementById("pauseBtn");
const messageLayer = document.getElementById("messageLayer");
const messageTitle = document.getElementById("messageTitle");
const messageText = document.getElementById("messageText");
const messageButton = document.getElementById("messageButton");

const TILE = 32;
const COLS = 21;
const ROWS = 21;
const MAX_LEVEL = 5;
const START_LIVES = 3;
const PLAYER_SCALE = 0.52;
const ENEMY_SCALE = 0.56;
const ENEMY_BOB = 0.8;
const COLLISION_DISTANCE_SQ = 0.34;

const DIRS = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
};

const OPPOSITE = {
  left: "right",
  right: "left",
  up: "down",
  down: "up",
};

const LEVELS = [
  {
    maze: [
      "#####################",
      "#...#.#.....#.......#",
      "###.#.#.#.#.#.###.#.#",
      "#.#.#...#.#.#...#.#.#",
      "#.#.#####.#####.#.#.#",
      "#...#.........#.#.#.#",
      "#.###.#.#.###.#.#.###",
      "#.....#.#...#...#...#",
      "#######.##.########.#",
      "#.....#.............#",
      "#.#.#####...#######.#",
      "#.#.......#...#...#.#",
      "#.###.#######.#.#.###",
      "#....N......#.......#",
      "###.#.#####.###.#.#.#",
      "#.#.#...#.......#.#.#",
      "#.#.#.#.#.#.#.#.###.#",
      "#.#.#.#.#.#...#...#.#",
      "#.#.###.#.#######.#.#",
      "#.......#...........#",
      "#####################",
    ],
    scrolls: [
      { x: 1, y: 3 },
      { x: 19, y: 3 },
      { x: 1, y: 15 },
      { x: 19, y: 15 },
      { x: 10, y: 19 },
    ],
  },
  {
    maze: [
      "#####################",
      "#.#.......#.........#",
      "#.###.###.###.#####.#",
      "#.#...#.#...#...#.#.#",
      "#.#.###.#.#.###.#.#.#",
      "#...#.......#.#...#.#",
      "#####.#.#.###.###.#.#",
      "#...#.#...#.#...#.#.#",
      "#.#.#.###...#.#.#.#.#",
      "#.#...#..N....#...#.#",
      "#.#######...#######.#",
      "#.......#.#.#.......#",
      "#####.#.#.#.#.#.#####",
      "#.#.....#...#.......#",
      "#.#.#.#.#.#.#.#.#.#.#",
      "#...#...#.........#.#",
      "#.#########.#######.#",
      "#...#.....#.....#...#",
      "###.#.###.#.###.#.#.#",
      "#.....#.....#.....#.#",
      "#####################",
    ],
    scrolls: [
      { x: 3, y: 1 },
      { x: 17, y: 1 },
      { x: 5, y: 11 },
      { x: 15, y: 17 },
      { x: 5, y: 19 },
    ],
  },
  {
    maze: [
      "#####################",
      "#.........#.........#",
      "#########.#.#######.#",
      "#.........#...#.....#",
      "#.#######.#.#.#######",
      "#.#.........#.......#",
      "#.#####.#.#########.#",
      "#.....#.........#...#",
      "#####.####.####.#.#.#",
      "#...#...#...#...#.#.#",
      "#.#####.#...#####.#.#",
      "#.....#.#..N..#...#.#",
      "#.###.#.#.#.#.#.###.#",
      "#.......#...#.......#",
      "###.#.#####.###.#####",
      "#.#.#...............#",
      "#.#.#.###.#.#######.#",
      "#...#.#.#.#...#...#.#",
      "#.###.#.#.#####.#.#.#",
      "#.....#.........#...#",
      "#####################",
    ],
    scrolls: [
      { x: 3, y: 1 },
      { x: 19, y: 5 },
      { x: 3, y: 17 },
      { x: 17, y: 19 },
      { x: 9, y: 7 },
    ],
  },
  {
    maze: [
      "#####################",
      "#.#.......#.....#...#",
      "#.#####.#.#.###.###.#",
      "#.......#...#.#...#.#",
      "#########.###.###.#.#",
      "#.............#...#.#",
      "#.###.###.#.#.#.###.#",
      "#.#...#...#.#...#...#",
      "#.#.###.#...#######.#",
      "#.#...#.#.........#.#",
      "#.###.#.#..######.#.#",
      "#.#.#...#.....#.#...#",
      "#.#.#.#####.#.#.###.#",
      "#.#.........#.......#",
      "#.###.#.###.###.#.###",
      "#...#..N........#...#",
      "###.#.#.###.###.###.#",
      "#...#.........#...#.#",
      "#.#######.###.###.#.#",
      "#.........#.....#...#",
      "#####################",
    ],
    scrolls: [
      { x: 5, y: 1 },
      { x: 17, y: 1 },
      { x: 1, y: 9 },
      { x: 13, y: 15 },
      { x: 15, y: 19 },
    ],
  },
  {
    maze: [
      "#####################",
      "#...#.............#.#",
      "###.#########.###.#.#",
      "#.#...#.......#.#...#",
      "#.###.#.#.#####.###.#",
      "#...#...............#",
      "#.#.#####.###########",
      "#.#.#...#...#...#...#",
      "#.#.#.#.##..#.#.#.#.#",
      "#.#...#.#....N....#.#",
      "#.#####.#..##.#.###.#",
      "#...#.#.#.#...#.#...#",
      "###.#.#.#.#.#.#.#.#.#",
      "#.#.....#.#.#.....#.#",
      "#.#.#.#.#.#.###.###.#",
      "#.#...#.......#.....#",
      "#.###.#####.#.#.#####",
      "#.#...#.....#.#.#...#",
      "#.#.#####.#.#.#.###.#",
      "#.........#...#.....#",
      "#####################",
    ],
    scrolls: [
      { x: 1, y: 5 },
      { x: 11, y: 1 },
      { x: 19, y: 9 },
      { x: 5, y: 19 },
      { x: 17, y: 17 },
    ],
  },
];

const ENEMY_STARTS = [
  { x: 1, y: 1, hair: "#f3e2d0", trim: "#e93f4f" },
  { x: 19, y: 1, hair: "#5f6d7a", trim: "#46d9ff" },
  { x: 1, y: 19, hair: "#d06d38", trim: "#ad6cff" },
  { x: 19, y: 19, hair: "#2b2f38", trim: "#71e65a" },
  { x: 10, y: 9, hair: "#f0d15f", trim: "#ff8f3d" },
];

const state = {
  mode: "menu",
  level: 1,
  lives: START_LIVES,
  score: 0,
  map: [],
  pellets: 0,
  player: null,
  enemies: [],
  particles: [],
  sparks: [],
  requestedDir: null,
  lastTime: 0,
  hitCooldown: 0,
  levelFlash: 0,
  shake: 0,
  audio: null,
  melodyTimer: null,
};

function cloneLevel() {
  const levelConfig = LEVELS[state.level - 1] || LEVELS[0];
  const map = [];
  let playerStart = { x: 10, y: 15 };

  levelConfig.maze.forEach((row, y) => {
    const cells = row.split("").map((cell, x) => {
      if (cell === "N") {
        playerStart = { x, y };
        return " ";
      }
      if (cell === "." || cell === "o") {
        return " ";
      }
      return cell;
    });
    map.push(cells);
  });

  levelConfig.scrolls.forEach(({ x, y }) => {
    map[y][x] = "o";
  });

  return { map, pellets: levelConfig.scrolls.length, playerStart };
}

function startGame() {
  state.level = 1;
  state.lives = START_LIVES;
  state.score = 0;
  startLevel();
  state.mode = "playing";
  hideMessage();
  pauseBtn.hidden = false;
  canvas.focus({ preventScroll: true });
  ensureAudio();
  startMelody();
}

function startLevel() {
  const { map, pellets, playerStart } = cloneLevel();
  state.map = map;
  state.pellets = pellets;
  state.player = makeMover(playerStart.x, playerStart.y, 4.8 + state.level * 0.15, null);
  state.enemies = ENEMY_STARTS.slice(0, Math.min(2 + state.level, ENEMY_STARTS.length)).map((enemy, index) => ({
    ...makeMover(enemy.x, enemy.y, 3.05 + state.level * 0.34 + index * 0.08, index % 2 ? "down" : "up"),
    hair: enemy.hair,
    trim: enemy.trim,
    scatter: 0,
  }));
  state.requestedDir = null;
  state.hitCooldown = 0;
  state.levelFlash = 0;
  state.shake = 0;
  state.particles = [];
  state.sparks = [];
  updateHud();
}

function makeMover(x, y, speed, dir) {
  return {
    x: x + 0.5,
    y: y + 0.5,
    targetX: x + 0.5,
    targetY: y + 0.5,
    spawnX: x + 0.5,
    spawnY: y + 0.5,
    dir,
    nextDir: dir,
    speed,
  };
}

function updateHud() {
  levelText.textContent = String(state.level);
  livesText.textContent = "❤".repeat(state.lives).padEnd(START_LIVES, "·");
  scoreText.textContent = String(state.score);
}

function showMessage(title, text, buttonText, action) {
  messageTitle.textContent = title;
  messageText.textContent = text;
  messageButton.textContent = buttonText;
  messageButton.onclick = action;
  messageLayer.hidden = false;
}

function hideMessage() {
  messageLayer.hidden = true;
}

function showMenu(title = "Naruto Pixel Chase", text = "Нажми старт, чтобы начать тренировку.") {
  state.mode = "menu";
  pauseBtn.hidden = true;
  stopMelody();
  showMessage(title, text, "Старт", startGame);
  draw();
}

function togglePause() {
  if (state.mode === "playing") {
    state.mode = "paused";
    stopMelody();
    showMessage("Пауза", "Сделай вдох. Продолжим по команде.", "Продолжить", togglePause);
  } else if (state.mode === "paused") {
    state.mode = "playing";
    hideMessage();
    ensureAudio();
    startMelody();
    state.lastTime = performance.now();
  }
}

function completeLevel() {
  state.mode = "level-clear";
  state.levelFlash = 1;
  burst(canvas.width / 2, canvas.height / 2, ["#ffd35a", "#f68b1f", "#19aa72", "#8ed8f8"], 84);
  playChord([523.25, 659.25, 783.99], 0.18, "triangle", 0.08);

  if (state.level >= MAX_LEVEL) {
    showMessage("Уровень пройден!", "Пятый уровень завершён. Финальная техника готова!", "Завершить", () => {
      stopMelody();
      showMenu("Игра завершена!", "Ты прошёл 5 уровней и стал Хокаге пиксельного лабиринта.");
    });
    return;
  }

  showMessage("Уровень пройден!", `Отлично! Уровень ${state.level} завершён.`, "Дальше", () => {
    state.level += 1;
    startLevel();
    state.mode = "playing";
    hideMessage();
    ensureAudio();
    startMelody();
    state.lastTime = performance.now();
  });
}

function loseLife() {
  if (state.hitCooldown > 0 || state.mode !== "playing") {
    return;
  }

  state.lives -= 1;
  state.hitCooldown = 1.8;
  state.shake = 0.36;
  burst(state.player.x * TILE, state.player.y * TILE, ["#f68b1f", "#ffd35a", "#e93f4f"], 38);
  playChord([146.83, 130.81, 110], 0.22, "sawtooth", 0.06);
  updateHud();

  if (state.lives <= 0) {
    state.mode = "game-over";
    stopMelody();
    setTimeout(() => {
      showMenu("Тренируйся больше!", "Жизни закончились. Вернись сильнее и собери все свитки.");
    }, 950);
    return;
  }

  resetPlayerPosition();
}

function resetPlayerPosition() {
  state.player.x = state.player.spawnX;
  state.player.y = state.player.spawnY;
  state.player.targetX = state.player.spawnX;
  state.player.targetY = state.player.spawnY;
  state.player.dir = null;
  state.requestedDir = null;
}

function isWall(x, y) {
  if (y < 0 || y >= ROWS) {
    return true;
  }
  if (x < 0 || x >= COLS) {
    return true;
  }
  return state.map[y][x] === "#";
}

function isPassableTile(x, y) {
  return !isWall(x, y);
}

function tileX(mover) {
  return Math.floor(mover.x);
}

function tileY(mover) {
  return Math.floor(mover.y);
}

function canMoveFromTile(mover, dirName) {
  if (!DIRS[dirName]) {
    return false;
  }
  const dir = DIRS[dirName];
  return isPassableTile(tileX(mover) + dir.x, tileY(mover) + dir.y);
}

function setPlayerDirection(dir) {
  if (!DIRS[dir] || state.mode !== "playing" || !state.player) {
    state.requestedDir = DIRS[dir] ? dir : state.requestedDir;
    return;
  }

  state.requestedDir = dir;

  if (isArrived(state.player) && canMoveFromTile(state.player, dir)) {
    snapToCenter(state.player);
    state.player.dir = dir;
    setTargetForDirection(state.player, dir);
  } else if (state.player.dir && dir === OPPOSITE[state.player.dir]) {
    state.player.dir = dir;
    state.player.targetX = tileX(state.player) + 0.5;
    state.player.targetY = tileY(state.player) + 0.5;
  }
}

function centered(mover) {
  return isArrived(mover);
}

function isArrived(mover) {
  return Math.abs(mover.x - mover.targetX) < 0.001 && Math.abs(mover.y - mover.targetY) < 0.001;
}

function snapToCenter(mover) {
  mover.x = Math.floor(mover.x) + 0.5;
  mover.y = Math.floor(mover.y) + 0.5;
  mover.targetX = mover.x;
  mover.targetY = mover.y;
}

function setTargetForDirection(mover, dirName) {
  const dir = DIRS[dirName];
  mover.targetX = tileX(mover) + dir.x + 0.5;
  mover.targetY = tileY(mover) + dir.y + 0.5;
}

function moveMover(mover, dt, isPlayer = false) {
  if (isArrived(mover)) {
    snapToCenter(mover);

    if (isPlayer) {
      if (state.requestedDir && canMoveFromTile(mover, state.requestedDir)) {
        mover.dir = state.requestedDir;
      } else if (!mover.dir || !canMoveFromTile(mover, mover.dir)) {
        mover.dir = null;
      }
    } else {
      const options = validDirections(mover, true);
      if (!mover.dir || !canMoveFromTile(mover, mover.dir) || options.length > 1) {
        mover.dir = chooseEnemyDirection(mover);
      }
    }

    if (mover.dir && canMoveFromTile(mover, mover.dir)) {
      setTargetForDirection(mover, mover.dir);
    }
  }

  if (isPlayer && (!mover.dir || isArrived(mover))) {
    return;
  }

  if (!mover.dir || isArrived(mover)) {
    return;
  }

  const dx = mover.targetX - mover.x;
  const dy = mover.targetY - mover.y;
  const distance = Math.hypot(dx, dy);
  const step = mover.speed * dt;

  if (step >= distance) {
    mover.x = mover.targetX;
    mover.y = mover.targetY;
  } else {
    mover.x += (dx / distance) * step;
    mover.y += (dy / distance) * step;
  }
}

function chooseEnemyDirection(enemy) {
  const options = validDirections(enemy, true);
  const fallback = validDirections(enemy, false);
  const choices = options.length ? options : fallback;
  if (!choices.length) {
    return enemy.dir;
  }

  const chaseChance = Math.min(0.42 + state.level * 0.08, 0.78);
  if (Math.random() < chaseChance) {
    return choices
      .map((dir) => {
        const step = DIRS[dir];
        const dx = enemy.x + step.x - state.player.x;
        const dy = enemy.y + step.y - state.player.y;
        return { dir, dist: dx * dx + dy * dy };
      })
      .sort((a, b) => a.dist - b.dist)[0].dir;
  }

  return choices[Math.floor(Math.random() * choices.length)];
}

function validDirections(mover, avoidReverse) {
  return Object.keys(DIRS).filter((dir) => (!avoidReverse || dir !== OPPOSITE[mover.dir]) && canMoveFromTile(mover, dir));
}

function collectScroll() {
  const x = Math.floor(state.player.x);
  const y = Math.floor(state.player.y);
  const cell = state.map[y]?.[x];

  if (cell !== "o") {
    return;
  }

  state.map[y][x] = " ";
  state.pellets -= 1;
  state.score += 50;
  sparkle((x + 0.5) * TILE, (y + 0.5) * TILE, "#8ed8f8");
  playBlip(740, 0.035, "square", 0.035);
  updateHud();

  if (state.pellets <= 0) {
    completeLevel();
  }
}

function checkCollisions() {
  state.enemies.forEach((enemy) => {
    const dx = enemy.x - state.player.x;
    const dy = enemy.y - state.player.y;
    if (dx * dx + dy * dy < COLLISION_DISTANCE_SQ) {
      loseLife();
    }
  });
}

function updateParticles(dt) {
  state.particles = state.particles.filter((particle) => {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += 180 * dt;
    particle.life -= dt;
    return particle.life > 0;
  });

  state.sparks = state.sparks.filter((spark) => {
    spark.life -= dt;
    spark.r += 12 * dt;
    return spark.life > 0;
  });
}

function burst(x, y, colors, count) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 70 + Math.random() * 210;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 4 + Math.random() * 7,
      life: 0.5 + Math.random() * 0.9,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
}

function sparkle(x, y, color) {
  state.sparks.push({ x, y, r: 2, life: 0.18, color });
}

function update(time) {
  const dt = Math.min((time - state.lastTime) / 1000 || 0, 0.05);
  state.lastTime = time;

  updateParticles(dt);

  if (state.mode === "playing") {
    if (state.hitCooldown > 0) {
      state.hitCooldown -= dt;
    }
    if (state.shake > 0) {
      state.shake -= dt;
    }
    moveMover(state.player, dt, true);
    state.enemies.forEach((enemy) => {
      moveMover(enemy, dt, false);
    });
    collectScroll();
    checkCollisions();
  }

  if (state.levelFlash > 0) {
    state.levelFlash -= dt;
  }

  draw();
  requestAnimationFrame(update);
}

function draw() {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (state.shake > 0) {
    const amount = Math.ceil(state.shake * 12);
    ctx.translate((Math.random() - 0.5) * amount, (Math.random() - 0.5) * amount);
  }

  drawBackground();
  drawMaze();
  drawScrolls();
  drawGate();

  if (state.player) {
    drawNaruto(state.player);
  } else {
    drawNaruto({ x: 10.5, y: 15.5, dir: "left" });
  }

  state.enemies.forEach(drawEnemy);
  drawParticles();

  if (state.levelFlash > 0) {
    ctx.fillStyle = `rgba(255, 211, 90, ${state.levelFlash * 0.35})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.restore();
}

function drawBackground() {
  ctx.fillStyle = "#0a0711";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#111b2a";
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if ((x + y) % 2 === 0) {
        ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      }
    }
  }
}

function drawMaze() {
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (state.map[y]?.[x] !== "#") {
        continue;
      }
      const px = x * TILE;
      const py = y * TILE;
      ctx.fillStyle = "#254a82";
      ctx.fillRect(px, py, TILE, TILE);
      ctx.fillStyle = "#3f7bcc";
      ctx.fillRect(px + 4, py + 4, TILE - 8, TILE - 8);
      ctx.fillStyle = "#1c315c";
      ctx.fillRect(px + 4, py + TILE - 8, TILE - 8, 4);
    }
  }
}

function drawScrolls() {
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const cell = state.map[y]?.[x];
      const cx = x * TILE + TILE / 2;
      const cy = y * TILE + TILE / 2;

      if (cell === "o") {
        drawScroll(cx, cy, 1);
      }
    }
  }
}

function drawScroll(cx, cy, scale) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  pixel(-10, -5, 20, 10, "#ead6a1");
  pixel(-12, -4, 4, 8, "#f7edc7");
  pixel(8, -4, 4, 8, "#f7edc7");
  pixel(-7, -5, 3, 10, "#d33a2c");
  pixel(4, -5, 3, 10, "#d33a2c");
  pixel(-3, -2, 6, 4, "#7a4b26");
  ctx.restore();
}

function drawGate() {
  ctx.fillStyle = "#f68b1f";
  ctx.fillRect(9 * TILE, 10 * TILE + 14, 3 * TILE, 4);
}

function drawNaruto(player) {
  const t = performance.now() / 140;
  const bob = Math.sin(t) * 2;
  const px = player.x * TILE;
  const py = player.y * TILE + bob;

  ctx.save();
  ctx.translate(px, py);
  if (player.dir === "up") ctx.rotate(-0.08);
  if (player.dir === "down") ctx.rotate(0.08);
  ctx.scale(player.dir === "left" ? -PLAYER_SCALE : PLAYER_SCALE, PLAYER_SCALE);

  pixel(-10, -13, 20, 6, "#ffd33f");
  pixel(-12, -9, 24, 5, "#f2b933");
  pixel(-9, -7, 18, 13, "#f7c791");
  pixel(-11, -5, 22, 4, "#2a4c7f");
  pixel(-7, -4, 4, 2, "#d9ecff");
  pixel(3, -4, 4, 2, "#d9ecff");
  pixel(-9, 0, 4, 2, "#442117");
  pixel(5, 0, 4, 2, "#442117");
  pixel(-7, 6, 14, 11, "#f68b1f");
  pixel(-11, 8, 4, 9, "#1d3359");
  pixel(7, 8, 4, 9, "#1d3359");
  pixel(-7, 17, 6, 7, "#1d3359");
  pixel(1, 17, 6, 7, "#1d3359");
  pixel(-12, 24, 10, 4, "#d9ecff");
  pixel(2, 24, 10, 4, "#d9ecff");
  pixel(-14, -1, 6, 2, "#5b2c20");
  pixel(8, -1, 6, 2, "#5b2c20");
  pixel(-14, 3, 6, 2, "#5b2c20");
  pixel(8, 3, 6, 2, "#5b2c20");
  ctx.restore();
}

function drawEnemy(enemy) {
  const px = enemy.x * TILE;
  const py = enemy.y * TILE;
  const pulse = Math.sin(performance.now() / 120 + enemy.spawnX) * ENEMY_BOB;

  ctx.save();
  ctx.translate(px, py + pulse);
  ctx.scale(ENEMY_SCALE, ENEMY_SCALE);
  pixel(-8, -14, 16, 5, enemy.hair);
  pixel(-7, -10, 14, 8, "#f0bf8c");
  pixel(-10, -4, 20, 23, "#16151c");
  pixel(-12, 0, 5, 15, "#111018");
  pixel(7, 0, 5, 15, "#111018");
  pixel(-7, 19, 5, 5, "#111018");
  pixel(2, 19, 5, 5, "#111018");
  pixel(-7, -6, 14, 3, "#35313d");
  pixel(-5, -5, 3, 2, "#dfefff");
  pixel(2, -5, 3, 2, "#dfefff");
  pixel(-6, 2, 8, 5, "#d71930");
  pixel(-4, 3, 5, 3, "#f0e9dc");
  pixel(2, 9, 7, 5, "#d71930");
  pixel(4, 10, 4, 3, "#f0e9dc");
  pixel(-2, 15, 5, 3, enemy.trim);
  ctx.restore();
}

function drawParticles() {
  state.sparks.forEach((spark) => {
    ctx.globalAlpha = Math.max(spark.life / 0.18, 0);
    ctx.strokeStyle = spark.color;
    ctx.lineWidth = 3;
    ctx.strokeRect(spark.x - spark.r, spark.y - spark.r, spark.r * 2, spark.r * 2);
    ctx.globalAlpha = 1;
  });

  state.particles.forEach((particle) => {
    ctx.globalAlpha = Math.max(particle.life, 0);
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    ctx.globalAlpha = 1;
  });
}

function pixel(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function ensureAudio() {
  if (state.audio) {
    if (state.audio.state === "suspended") {
      state.audio.resume();
    }
    return;
  }
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) {
    return;
  }
  state.audio = new AudioCtor();
}

function startMelody() {
  if (state.melodyTimer) {
    return;
  }
  const notes = [392, 523.25, 587.33, 659.25, 587.33, 523.25, 440, 523.25];
  let index = 0;
  state.melodyTimer = setInterval(() => {
    if (state.mode !== "playing") {
      return;
    }
    playBlip(notes[index % notes.length], 0.09, index % 4 === 0 ? "triangle" : "square", 0.025);
    if (index % 4 === 2) {
      playBlip(notes[(index + 3) % notes.length] / 2, 0.12, "sawtooth", 0.018);
    }
    index += 1;
  }, 165);
}

function stopMelody() {
  if (state.melodyTimer) {
    clearInterval(state.melodyTimer);
    state.melodyTimer = null;
  }
}

function playBlip(freq, duration, type, volume) {
  if (!state.audio) {
    return;
  }
  const now = state.audio.currentTime;
  const osc = state.audio.createOscillator();
  const gain = state.audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(gain).connect(state.audio.destination);
  osc.start(now);
  osc.stop(now + duration);
}

function playChord(notes, duration, type, volume) {
  notes.forEach((note, i) => {
    setTimeout(() => playBlip(note, duration, type, volume), i * 55);
  });
}

function handleKeyDown(event) {
  const keyMap = {
    ArrowLeft: "left",
    ArrowRight: "right",
    ArrowUp: "up",
    ArrowDown: "down",
  };

  if (event.code === "KeyP" || event.code === "Space") {
    event.preventDefault();
    togglePause();
    return;
  }

  const dir = keyMap[event.code] || keyMap[event.key];
  if (dir) {
    event.preventDefault();
    setPlayerDirection(dir);
  }
}

window.addEventListener("keydown", handleKeyDown, { capture: true });

document.querySelectorAll(".dir-btn").forEach((button) => {
  button.addEventListener("pointerdown", () => {
    setPlayerDirection(button.dataset.dir);
  });
});

pauseBtn.addEventListener("click", togglePause);

showMenu();
requestAnimationFrame(update);
