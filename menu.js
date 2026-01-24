

let unlockedLevel = parseInt(localStorage.getItem("unlockedLevel")) || 1;
const totalLevels = 3;
let selectedLevel = null; 


const levelsContainer = document.getElementById("levelsContainer");
const startBtn = document.getElementById("startBtn");
const howBtn = document.getElementById("howBtn");
const resetBtn = document.getElementById("resetBtn");

const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");
const closePopup = document.getElementById("closePopup");


const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");
const victorySound = document.getElementById("victorySound");

let soundEnabled = true; 



const LEVEL_CONFIG = {
  1: { time: 30, score: 5 },
  2: { time: 30, score: 10 },
  3: { time: 60, score: 30 }
  
};

function getLevelInfo(level) {
  return LEVEL_CONFIG[level];
}

// fucnction to create buttons for levels and check which is locked and whic is not based on unlocked level
function loadLevels() {
  levelsContainer.innerHTML = "";
  
  
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
    playClick();
  if (i <= unlockedLevel) {
    selectedLevel = i;
    updateLevelSelection();
  }
});
    levelsContainer.appendChild(btn);
  }
  
  
  updateLevelSelection();
}

//fuction for different colors and button altitude if it is selected or not and locked or not
function updateLevelSelection() {
  const buttons = document.querySelectorAll(".levelBtn");
  
  buttons.forEach((btn, index) => {
    const levelNum = index + 1;

    
    btn.classList.remove("newLevelPulse");

   
    if (levelNum > unlockedLevel) {
      btn.style.background = "#444";
      btn.style.border = "3px solid #333";
      btn.style.opacity = "0.6";
      btn.style.cursor = "not-allowed";
      return;
    }

    
    if (levelNum === selectedLevel) {
      btn.style.background = "gold";
      btn.style.color = "#000"; // Black text
      btn.style.border = "4px solid #fff";
      btn.style.boxShadow = "0 0 20px gold";
      btn.style.transform = "scale(1.1)";
      
      
      if (levelNum === unlockedLevel) {
        btn.classList.add("newLevelPulse");
      }
    } 
    
   
    else {
      btn.style.background = "#3498db";
      btn.style.color = "#000"; 
      btn.style.border = "3px solid rgba(255, 255, 255, 0.4)";
      btn.style.boxShadow = "none";
      btn.style.transform = "scale(1)";
    }
  });
}

loadLevels();

//made a function for pop up message to customize the ok button with retry level or start level
function showPopup(text, callback = null, buttonText = "OK") {
  popupText.innerHTML = text;
  popup.classList.remove("hidden");
  popup.classList.add("show");

  
  const newClose = closePopup;
  newClose.replaceWith(newClose.cloneNode(true)); 
  const updatedClose = document.getElementById("closePopup"); 
  updatedClose.textContent = buttonText; 
updatedClose.addEventListener("click", () => {
  playClick();
  popup.classList.remove("show");
  popup.classList.add("hidden");

  if (callback) {
     setTimeout(callback, 100);  
  }
  
  
});
}


howBtn.addEventListener("click",()=>{
   playClick();
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
        <div class="howText">Avoid bombs — hitting one will reset your collected fruits .</div>
      </div>

      <div class="howRow">
        <div class="howBadge timer">⏱ Timer</div>
        <div class="howText">Time is limited — Speed increases each level !! Finish before time runs out.</div>
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


startBtn.addEventListener("click",  () => {
  playClick();
  localStorage.setItem("audioUnlocked", "true");
  const info = getLevelInfo(selectedLevel);

  showPopup(`
    🎮 Level ${selectedLevel} Start!
    <br>Time Limit: <strong>${info.time}s</strong>
    <br>Score to Reach: <strong>${info.score}</strong>
  `, () => {
// send selected level ,info:time and score because it will be used in hu.js for updating score and time
    localStorage.setItem("currentLevel", selectedLevel);
    localStorage.setItem("levelTime", info.time);
    localStorage.setItem("levelScore", info.score);
    window.location.href = "game.html";
  }, "Start Level"); 
});


resetBtn.addEventListener("click" , () => {
   playClick();
  localStorage.setItem("unlockedLevel", 1);
  unlockedLevel = 1;
  selectedLevel = null;
  loadLevels();
  showPopup("Progress reset! Only Level 1 unlocked.");
});


const passed = localStorage.getItem("levelPassed");
const lost = localStorage.getItem("levelLost");

if (passed) {
  playWin();
    const levelJustFinished = parseInt(passed);
    
    
    if (levelJustFinished === unlockedLevel && unlockedLevel < totalLevels) {
        unlockedLevel++; 
        localStorage.setItem("unlockedLevel", unlockedLevel);
        selectedLevel = unlockedLevel; 
        
        loadLevels(); 
        showPopup(`🎉 Congrats! You passed Level ${levelJustFinished} ! Level ${unlockedLevel} is now UNLOCKED!`);
    } 
    else if (levelJustFinished === totalLevels) {
      playVictory();
    showPopup(`🏆 You passed the final level! Amazing!`);
    }
    
    else  {
        selectedLevel = levelJustFinished;
        loadLevels();
      showPopup(`🌟 Level ${levelJustFinished} mastered once more! You’re on a roll!`);
    }
    
    localStorage.removeItem("levelPassed");
}

if (lost) {
  playLose();
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


function playClick() {
  if (soundEnabled) {
    clickSound.currentTime = 0;
    clickSound.play();
  }
}

function playWin() {
  if (soundEnabled) {
    winSound.currentTime = 0;
    winSound.play();
  }
}

function playLose() {
  if (soundEnabled) {
    loseSound.currentTime = 0;
    loseSound.play();
  }
}

function playVictory() {
  if (soundEnabled) {
    victorySound.currentTime = 0;
    victorySound.play();
  }
}

const closeX = document.querySelector(".close-x-btn");

closeX.addEventListener("click", () => {
  playClick();  
  popup.classList.remove("show");
  popup.classList.add("hidden");
});
