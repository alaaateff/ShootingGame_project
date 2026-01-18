const gameArea = document.getElementById("game");
const MAX_APPLES = 5;
const APPLE_SIZE = 50;
const SPEED = 3;

let apples = [];
let quarterCounts = [0, 0, 0, 0];


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
    quarterIndex: qi    // store index for later removal
  };
}

while (apples.length < MAX_APPLES) {
  apples.push(createApple());
}

function update() {
  apples.forEach( apple  => {
    // Move apple
    apple.x += apple.dx;
    apple.y += apple.dy;

    // Bounce within its quarter
    const q = apple.quarter;
    if (apple.x <= q.x || apple.x >= q.x + q.w - APPLE_SIZE) apple.dx *= -1;
    if (apple.y <= q.y || apple.y >= q.y + q.h - APPLE_SIZE) apple.dy *= -1;

    // Check collision with other apples
    apples.forEach( other => {
      if (apple === other) return; // skip itself

      const dx = apple.x - other.x;
      const dy = apple.y - other.y;
      const dist = Math.hypot(dx, dy);

      if (dist < APPLE_SIZE) {
        // Bounce off: reverse velocity
        apple.dx *= -1;
        apple.dy *= -1;

        // Slightly move them apart
        const overlap = APPLE_SIZE - dist / 2;
        apple.x += (dx / dist) * overlap;
        apple.y += (dy / dist) * overlap;
        other.x -= (dx / dist) * overlap;
        other.y -= (dy / dist) * overlap;
      }
    });

    // Update position on screen
    apple.el.style.left = apple.x + "px";
    apple.el.style.top = apple.y + "px";
  });
}

function loop() {
  update();
  requestAnimationFrame(loop);
}

loop();
