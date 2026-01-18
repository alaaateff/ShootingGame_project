/* ================= READ LEVEL DATA FROM MENU ================= */
const currentLevel = parseInt(localStorage.getItem("currentLevel")) || 1;
const reqTime = parseInt(localStorage.getItem("levelTime")) || 30;
const reqScore = parseInt(localStorage.getItem("levelScore")) || 5;

/* ================= HTML ELEMENTS ================= */
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const infoBox = document.getElementById("info");

/* ================= FULL SCREEN ================= */
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* ================= DISPLAY TEST INFO ================= */
infoBox.innerHTML = `
  <h1 style="color:white;margin-bottom:10px;">TEST LEVEL ${currentLevel}</h1>
  <p style="color:white;">Required Time: ${reqTime}s</p>
  <p style="color:white;">Required Score: ${reqScore}</p>
  <p style="color:white;margin-top:15px;">Use keys to simulate:</p>
  <p style="color:white;">
      <b>W</b> = Win<br>
      <b>L</b> = Lose
  </p>
`;

/* ================= SIMULATE WIN / LOSE ================= */
document.addEventListener("keydown", (e) => {
  if (e.code === "KeyW") {
    simulateWin();
  } else if (e.code === "KeyL") {
    simulateLose();
  }
});

/* ================= SIMULATION FUNCTIONS ================= */
function simulateWin() {
  localStorage.setItem("levelPassed", currentLevel);
  localStorage.removeItem("levelLost");
  endTest("🎉 Level Passed!");
}

function simulateLose() {
  localStorage.setItem("levelLost", currentLevel);
  localStorage.removeItem("levelPassed");
  endTest("❌ Level Failed!");
}

/* ================= END TEST ================= */
function endTest(message) {
  infoBox.innerHTML = `
    <h1 style="color:white;">${message}</h1>
    <p style="color:white;">Returning to menu...</p>
  `;

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1200);
}

/* ================= OPTIONAL BACKGROUND (NOT GAME) ================= */
const bgImg = new Image();
bgImg.src = "images/bg.jpg";

bgImg.onload = () => draw();
function draw() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  requestAnimationFrame(draw);
}
