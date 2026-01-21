const gameArea = document.getElementById("game");
const MAX_APPLES = 5;
const APPLE_SIZE = 50;
const SPEED = 3;
const CROSSHAIR_SIZE = 60; 
const CROSSHAIR_SPEED = 8;
const BOMB_TIME = 5000;
const APPLE_AGAIN_TIME = 10000
const REMOVE_TIME = 15000;

let apples = [];
let quarterCounts = [0, 0, 0, 0];

const crosshair = createCrosshair();

const keys = {
  w: false,
  a: false,
  s: false,
  d: false
};

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase(); 
  if (keys.hasOwnProperty(key)) keys[key] = true;
});

document.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();
  if (keys.hasOwnProperty(key)) keys[key] = false;
});


function isOverlapping(x, y) {
  return apples.some(a => Math.hypot(a.x - x, a.y - y) < APPLE_SIZE);
}

function getQuarters() {
  const w = window.innerWidth / 2;
  const h = window.innerHeight / 2;

  const quarters = [
    { x: 0, y: 0, w, h },      // top-left
    { x: w, y: 0, w, h },      // top-right
    { x: 0, y: h, w, h },      // bottom-left
    { x: w, y: h, w, h }       // bottom-right
  ];

  // Find least crowded quarter
  const min = Math.min(...quarterCounts);
  const index = quarterCounts.indexOf(min);

  // Increase count 
  quarterCounts[index]++;
  return { quarter: quarters[index], index };
}


function createApple() {
  const apple = document.createElement("img");
  apple.src = "images/apple.png";
  apple.classList.add("apple");

  const { quarter: q, index: qi } = getQuarters();


  //get random position inside the quarter
  let x, y, tries = 0;
  do {
    x = Math.random() * (q.w - APPLE_SIZE) + q.x;
    y = Math.random() * (q.h - APPLE_SIZE) + q.y;
    tries++;
  } while (isOverlapping(x, y, APPLE_SIZE) && tries < 100);

  //place apple in that position
  apple.style.left = x + "px";
  apple.style.top = y + "px";
  gameArea.appendChild(apple);

  //random direction
  const angle = Math.random() * 2 * Math.PI;

  return {
    el: apple,
    x, y,
    dx: Math.cos(angle) * SPEED,//velocity
    dy: Math.sin(angle) * SPEED,
    quarter: q ,        // keep track of its quarter
    quarterIndex: qi, // store index for later removal
    spawnTime: Date.now(),
    type: "safe"
  };
}

function createCrosshair() {
  const el = document.createElement("img");
  el.src = "images/crosshair.png"; 
  el.classList.add("crosshair");
  
  const x = window.innerWidth / 2 - CROSSHAIR_SIZE / 2;
  const y = window.innerHeight / 2 - CROSSHAIR_SIZE / 2;
  
  el.style.left = x + "px";
  el.style.top = y + "px";

  gameArea.appendChild(el);

  return { el, x, y };
}

while (apples.length < MAX_APPLES) {
  apples.push(createApple());
}

function update() {

  if (keys.w) crosshair.y -= CROSSHAIR_SPEED;
  if (keys.s) crosshair.y += CROSSHAIR_SPEED;
  if (keys.a) crosshair.x -= CROSSHAIR_SPEED;
  if (keys.d) crosshair.x += CROSSHAIR_SPEED;

  if (crosshair.x < 0) crosshair.x = 0;
  if (crosshair.y < 0) crosshair.y = 0;
  if (crosshair.x > window.innerWidth - CROSSHAIR_SIZE) 
      crosshair.x = window.innerWidth - CROSSHAIR_SIZE;
  if (crosshair.y > window.innerHeight - CROSSHAIR_SIZE) 
      crosshair.y = window.innerHeight - CROSSHAIR_SIZE;

  crosshair.el.style.left = crosshair.x + "px";
  crosshair.el.style.top = crosshair.y + "px";

  const now = Date.now();

  for (let i = apples.length - 1; i >= 0; i--) {
    const apple = apples[i];

    if (now - apple.spawnTime > REMOVE_TIME) {
      apple.el.remove();
      
      quarterCounts[apple.quarterIndex]--;
      
      apples.splice(i, 1);
      
      apples.push(createApple());
      
      continue; 
    }

    if (apple.type === "safe" && now - apple.spawnTime > BOMB_TIME) {
      apple.type = "bomb";
      apple.el.src = "images/bomb.png";
    }
    if(apple.type === "bomb" && now - apple.spawnTime > APPLE_AGAIN_TIME) {
      apple.type = "safe"; 
      apple.el.src = "images/apple.png";
    }

    /* 3. MOVEMENT */
    apple.x += apple.dx;
    apple.y += apple.dy;

    const q = apple.quarter;
    if (apple.x <= q.x || apple.x >= q.x + q.w - APPLE_SIZE) apple.dx *= -1;
    if (apple.y <= q.y || apple.y >= q.y + q.h - APPLE_SIZE) apple.dy *= -1;

    /* 4. COLLISION */
    apples.forEach(other => {
      if (apple === other) return;
      
      const dx = apple.x - other.x;
      const dy = apple.y - other.y;
      const dist = Math.hypot(dx, dy);

      if (dist < APPLE_SIZE) {
        apple.dx *= -1;
        apple.dy *= -1;
        const overlap = APPLE_SIZE - dist / 2;
        apple.x += (dx / dist) * overlap;
        apple.y += (dy / dist) * overlap;
        other.x -= (dx / dist) * overlap;
        other.y -= (dy / dist) * overlap;
      }
    });

    /* 5. DRAW */
    apple.el.style.left = apple.x + "px";
    apple.el.style.top = apple.y + "px";
  }
}

function loop() {
  update();
  requestAnimationFrame(loop);
}

loop();
