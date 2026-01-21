const gameArea = document.getElementById("game");
const MAX_APPLES = 5;
const APPLE_SIZE = 50;
const SPEED = 3;
const CROSSHAIR_SIZE = 60;
const CROSSHAIR_SPEED = 8;
const BOMB_TIME = 5000;
const APPLE_AGAIN_TIME = 10000
const REMOVE_TIME = 15000;


const bombSound = new Audio("sounds/bomb.mp3");
bombSound.volume = 0.7;

const hitSound = new Audio("sounds/hit.mp3");
hitSound.volume = 0.7;

const missSound = new Audio("sounds/miss.mp3");
missSound.volume = 0.6;

let frozen = false;
const FREEZE_TIME = 1000; // ms
let bombPlayed = false;
let gameOver = false;
let reqScore = parseInt(localStorage.getItem("levelScore")) || 1;
let reqTime = parseInt(localStorage.getItem("levelTime")) || 10;
let currentLevel = parseInt(localStorage.getItem("currentLevel")) || 1;
document.getElementById("score").textContent = reqScore;




let apples = [];
let quarterCounts = [0, 0, 0, 0];

const crosshair = createCrosshair();



const keys = {
  w: false, a: false, s: false, d: false,
  arrowup: false, arrowdown: false, arrowleft: false, arrowright: false
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
    quarter: q,        // keep track of its quarter
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


  if (!frozen) {
    if (keys.w || keys.arrowup) crosshair.y -= CROSSHAIR_SPEED;
    if (keys.s || keys.arrowdown) crosshair.y += CROSSHAIR_SPEED;
    if (keys.a || keys.arrowleft) crosshair.x -= CROSSHAIR_SPEED;
    if (keys.d || keys.arrowright) crosshair.x += CROSSHAIR_SPEED;
  }

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
    if (apple.type === "bomb" && now - apple.spawnTime > APPLE_AGAIN_TIME) {
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

//gaber code 
function hit(apple) {
  const crossX = crosshair.x + CROSSHAIR_SIZE / 2;
  const crossY = crosshair.y + CROSSHAIR_SIZE / 2;

  const appleX = apple.x + APPLE_SIZE / 2;
  const appleY = apple.y + APPLE_SIZE / 2;

  const dx = crossX - appleX;
  const dy = crossY - appleY;
  const HIT_RADIUS = (APPLE_SIZE / 2) + 40;
  return Math.hypot(dx, dy) < HIT_RADIUS;
  // return Math.hypot(dx, dy) < APPLE_SIZE / 2;
}

document.addEventListener("keydown", (e) => {
  if (e.code !== "Space" || gameOver) return;

  vibrateCrosshair();
  let hitSomething = false;

  for (let i = apples.length - 1; i >= 0; i--) {
    const apple = apples[i];

    if (hit(apple)) {
      hitSomething = true;
      apple.el.remove();
      apples.splice(i, 1);

      if (apple.type === "safe") {
        frozen = false;
        hitSound.currentTime = 0;
        hitSound.play();
        reqScore--;      // apple
      } else if (apple.type === "bomb") {
        frozen = true;
        hitSomething = false;
        bombSound.currentTime = 0;
        bombSound.play();
        bombPlayed = true;
        reqScore++;      // bomb
      }

      document.getElementById("score").textContent = reqScore;
      apples.push(createApple());

      break; // hit one object only
    }
  }

  if (!hitSomething) {
    if (!bombPlayed) {
      missSound.currentTime = 0;
      missSound.play();
    }
    bombPlayed = false;


    frozen = true;
    setTimeout(() => {
      frozen = false;
    }, FREEZE_TIME);
  }

  // win condition
  if (reqScore === 0) {
    endGame("w");//call function finishh game with win situation

  }
});

function endGame(gameStatus) {
  gameOver = true;
  let msg = "";
  if (gameStatus === "w") {
    //finsih game with janna conditions
    localStorage.setItem("levelPassed", currentLevel);
    localStorage.removeItem("levelLost");
    msg = "🎉 Level Passed!,You Win";

  }
  else {//trigger by alla send "L" with timer ends
    //finish game lose with janna conditnos
    localStorage.setItem("levelLost", currentLevel);
    localStorage.removeItem("levelPassed");
    msg = "❌ Level Failed!, You Lost";

  }

  // alert(msg);//return to the main menu// make animation for win then go to main menu
  // showPopup(msg)
  setTimeout(() => {//return to the main menu
    window.location.href = "index.html";
  }, 1200);

}

function vibrateCrosshair() {
  crosshair.el.classList.remove("shake"); // reset
  void crosshair.el.offsetWidth;          // force reflow
  crosshair.el.classList.add("shake");
}



function loop() {
  update();
  requestAnimationFrame(loop);// ضربة واحدة بسimationFrame(loop);
}

loop();
