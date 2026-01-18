
/* ================= STORAGE ================= */
let unlockedLevel = parseInt(localStorage.getItem("unlockedLevel")) || 1;
const totalLevels = 5;
let selectedLevel = null; // track which level the user selects

/* ================= UI ELEMENTS ================= */
const levelsContainer = document.getElementById("levelsContainer");
const startBtn = document.getElementById("startBtn");
const howBtn = document.getElementById("howBtn");
const resetBtn = document.getElementById("resetBtn");

const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");
const closePopup = document.getElementById("closePopup");

/* ================= RANDOM LEVEL CONFIG ================= */
const LEVEL_CONFIG = {
  1: { time: 20, score: 5 },
  2: { time: 25, score: 7 },
  3: { time: 30, score: 9 },
  4: { time: 35, score: 12 },
  5: { time: 40, score: 15 }
};

function getLevelInfo(level) {
  return LEVEL_CONFIG[level];
}

/* ================= CREATE LEVEL BUTTONS ================= */
function loadLevels() {
  levelsContainer.innerHTML = "";
  
  // Default selection to the newest level if nothing is selected
  if (!selectedLevel) {
    selectedLevel = unlockedLevel;
  }

  for (let i = 1; i <= totalLevels; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.classList.add("levelBtn");

    if (i > unlockedLevel) {
      btn.classList.add("locked");
    }

    btn.onclick = () => {
      if (i <= unlockedLevel) {
        selectedLevel = i;
        updateLevelSelection();
      }
    };
    levelsContainer.appendChild(btn);
  }
  
  // This line ensures the colors are correct immediately
  updateLevelSelection();
}


function updateLevelSelection() {
  const buttons = document.querySelectorAll(".levelBtn");
  
  buttons.forEach((btn, index) => {
    const levelNum = index + 1;

    // Remove any previous pulse animation
    btn.classList.remove("newLevelPulse");

    // 1. LOCKED LEVELS
    if (levelNum > unlockedLevel) {
      btn.style.background = "#444";
      btn.style.border = "3px solid #333";
      btn.style.opacity = "0.6";
      btn.style.cursor = "not-allowed";
      return;
    }

    // 2. THE CURRENTLY SELECTED LEVEL (Gold)
    if (levelNum === selectedLevel) {
      btn.style.background = "gold";
      btn.style.color = "#000"; // Black text
      btn.style.border = "4px solid #fff";
      btn.style.boxShadow = "0 0 20px gold";
      btn.style.transform = "scale(1.1)";
      
      // If it's also the highest unlocked level, add the pulse
      if (levelNum === unlockedLevel) {
        btn.classList.add("newLevelPulse");
      }
    } 
    
    // 3. PASSED/UNLOCKED BUT NOT SELECTED (Blue)
    else {
      btn.style.background = "#3498db";
      btn.style.color = "#000"; // Black text
      btn.style.border = "3px solid rgba(255, 255, 255, 0.4)";
      btn.style.boxShadow = "none";
      btn.style.transform = "scale(1)";
    }
  });
}
loadLevels();

/* ================= CONTEXTUAL POPUP FUNCTION ================= */
function showPopup(text, callback = null, buttonText = "OK") {
  popupText.innerHTML = text;
  popup.classList.remove("hidden");
  popup.classList.add("show");

  // Remove old event listener first
  const newClose = closePopup;
  newClose.replaceWith(newClose.cloneNode(true)); // remove old listeners
  const updatedClose = document.getElementById("closePopup"); // get the new button

  updatedClose.textContent = buttonText; // set button text

  updatedClose.onclick = () => {
    popup.classList.remove("show");
    popup.classList.add("hidden");
    if (callback) callback(); // run callback if provided
  };
}

/* ================= HOW TO PLAY ================= */
howBtn.onclick = () => {
  showPopup(`
    <h2>🎯 How to Play – Shooting Fruits</h2>
    <ul>
      <li>Shoot only the <strong>Safe targets (Fruits)</strong> to earn points 🍎</li>
      <li><strong>Avoid Hazard targets (Bombs)</strong> – hitting one will cost a life 💣</li>
      <li>You have <strong>3 lives </strong>. Game ends if all are lost </li>
      <li>Score points quickly – targets shift states dynamically ⚡</li>
      <li>Timer is running, so act fast and improve your <strong>High Score</strong> ⏱️</li>
    </ul>
    <div class="goal">Goal: Get the highest Combat Score possible and beat your personal best!</div>
    <div class="tip">Tip: Focus, react fast, and don’t shoot the bombs! 🍎💣</div>
  `);
};

/* ================= START GAME ================= */
startBtn.onclick = () => {
  if (!selectedLevel) {
    showPopup("⚠️ Please select an unlocked level first!");
    return;
  }

  const info = getLevelInfo(selectedLevel);

  showPopup(`
    🎮 Level ${selectedLevel} Start!
    <br>Time Limit: <strong>${info.time}s</strong>
    <br>Score to Reach: <strong>${info.score}</strong>
  `, () => {
    // Callback runs when "Start Level" clicked
    localStorage.setItem("currentLevel", selectedLevel);
    localStorage.setItem("levelTime", info.time);
    localStorage.setItem("levelScore", info.score);
    window.location.href = "game.html";
  }, "Start Level"); // Button text customized
};

/* ================= RESET PROGRESS ================= */
resetBtn.onclick = () => {
  localStorage.setItem("unlockedLevel", 1);
  unlockedLevel = 1;
  selectedLevel = null;
  loadLevels();
  showPopup("Progress reset! Only Level 1 unlocked.");
};

/* ================= HANDLE WIN/LOSE ================= */
const passed = localStorage.getItem("levelPassed");
if (passed) {
  const level = parseInt(passed);
  if (level >= unlockedLevel && level < totalLevels) {
    unlockedLevel++;
    localStorage.setItem("unlockedLevel", unlockedLevel);
    selectedLevel=unlockedLevel;      ;
    loadLevels();
    showPopup(`🎉 Congrats! You passed Level ${level} and unlocked Level ${unlockedLevel}!`);
  } else if (level === totalLevels) {
    showPopup(`🏆 You passed the final level! Amazing!`);
  }
  localStorage.removeItem("levelPassed");
}

const lost = localStorage.getItem("levelLost");
if (lost) {
  const lostLevel = parseInt(lost);
  const info = getLevelInfo(lostLevel);
  showPopup(`
    ❌ You lost Level ${lostLevel}! 
    <br>Time Limit: <strong>${info.time}s</strong>
    <br>Score to Reach: <strong>${info.score}</strong>
  `, () => {
    selectedLevel = lostLevel; // select it automatically for retry
    updateLevelSelection();
  }, "Retry Level"); // Button text customized
  localStorage.removeItem("levelLost");
}
