
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

  btn.addEventListener("click", () => {
  if (i <= unlockedLevel) {
    selectedLevel = i;
    updateLevelSelection();
  }
});
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

updatedClose.addEventListener("click", () => {
  popup.classList.remove("show");
  popup.classList.add("hidden");
  if (callback) callback(); // run callback if provided
});
}

/* ================= HOW TO PLAY ================= */
howBtn.addEventListener("click",()=>{
showPopup(`
    <div class="howContainer">
      <div class="howIcon">🎮</div>
      <h2>How to Play</h2>

      <div class="howRow">
        <div class="howBadge safe">🍎 Fruits</div>
        <div class="howText">Shoot fruits to gain points.</div>
      </div>

      <div class="howRow">
        <div class="howBadge danger">💣 Bombs</div>
        <div class="howText">Avoid bombs — hitting one costs a life.</div>
      </div>

      <div class="howRow">
        <div class="howBadge timer">⏱ Timer</div>
        <div class="howText">Time is limited — finish before it runs out.</div>
      </div>

      <div class="howRow">
        <div class="howBadge lives">❤️ Lives</div>
        <div class="howText">You have <b>3 lives</b>. Lose all = Game Over.</div>
      </div>

      <div class="goalBox">
        🎯 <b>Goal:</b> Collect fruits fast and beat your high score!
      </div>

      <div class="tipBox">
        💡 <b>Tip:</b> Watch fruit ↔ bomb switching — timing matters!
      </div>
    </div>
  `);
});

/* ================= START GAME ================= */
startBtn.addEventListener("click",  () => {
  
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
});

/* ================= RESET PROGRESS ================= */
resetBtn.addEventListener("click" , () => {
  localStorage.setItem("unlockedLevel", 1);
  unlockedLevel = 1;
  selectedLevel = null;
  loadLevels();
  showPopup("Progress reset! Only Level 1 unlocked.");
});

/* ================= HANDLE WIN/LOSE ================= */
const passed = localStorage.getItem("levelPassed");
const lost = localStorage.getItem("levelLost");

if (passed) {
    const levelJustFinished = parseInt(passed);
    
    // FIX: If you beat the level that matches your current max progress, 
    // it MUST unlock the next one regardless of what level was 'selected' before.
    if (levelJustFinished === unlockedLevel && unlockedLevel < totalLevels) {
        unlockedLevel++; // Move progress forward
        localStorage.setItem("unlockedLevel", unlockedLevel);
        selectedLevel = unlockedLevel; // Auto-focus on the new Level 3
        
        loadLevels(); // Redraw buttons with new Gold/Blue/Locked states
        showPopup(`🎉 Congrats! You passed Level ${levelJustFinished} ! Level ${unlockedLevel} is now UNLOCKED!`);
    } 
    else if (levelJustFinished === totalLevels) {
    showPopup(`🏆 You passed the final level! Amazing!`);
    }
    // If you won an old level (like playing Level 1 when you already have Level 3)
    else  {
        selectedLevel = levelJustFinished;
        loadLevels();
      showPopup(`🌟 Level ${levelJustFinished} mastered once more! You’re on a roll!`);
    }
    
    localStorage.removeItem("levelPassed");
}

if (lost) {
    const lostLevel = parseInt(lost);
    const info = getLevelInfo(lostLevel);


    selectedLevel = lostLevel;
    loadLevels(); 

    showPopup(`
        <div class="howContainer">
            <h2 style="color:#e74c3c;">❌ Level ${lostLevel} Failed</h2>
            <p>Score Needed: <strong>${info.score}</strong></p>
            <div class="tipBox">Keep practicing! You'll get it next time.</div>
        </div>
    `, null, "Retry Level");

    localStorage.removeItem("levelLost");
}