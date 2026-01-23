const reqlevelno = parseInt(localStorage.getItem("currentLevel")) || 1;
var levelnumber = document.getElementById("level-no");
levelnumber.textContent = reqlevelno;

const reqscoreno = parseInt(localStorage.getItem("levelScore")) || 1;
var scorenumber = document.getElementById("score-no");
scorenumber.textContent = reqscoreno;

 function updateScore(s) {
    var curScore = parseInt(document.getElementById("score-no").textContent);
    var score = document.getElementById("score-no");
    if(s === "l"){
        curScore++;
    }
    else{
        curScore--;
    }
    score.textContent = curScore;
    var scoredisp = document.getElementsByClassName("score")[0];
    scoredisp.classList.add("pump");
    scoredisp.classList.remove("pump-back");

    setTimeout(() => {
        scoredisp.classList.remove("pump");
        scoredisp.classList.add("pump-back");
    }, 150);

    if (curScore == 0) {
        var popup = document.getElementById("pop-up");
        var p_in_popup = document.getElementById("game-over");
        p_in_popup.textContent = "YOU WIN!"; // go to main menu
        p_in_popup.style.fontFamily = "Russo One";
        p_in_popup.style.fontSize = "xx-large";
        popup.style.display = "flex";
        clearInterval(timenow);
        // clearInterval(scorenow);
        var bg = document.getElementById("game");
        bg.style.display = "block";
        endGame("w");
        // setTimeout(function () {
        //     window.location.href = "index.html"; // return main menu when win
        // }, 2000);
    }
}

const reqTimee = parseInt(localStorage.getItem("levelTime")) || 10;
var time_no = document.getElementById("time-no");
time_no.textContent = reqTimee;
var timer = parseInt(document.getElementById("time-no").textContent);
var time10 = document.getElementsByClassName("timer")[0];
console.log(typeof timer);
var timenow = setInterval(function () {
    timer--;
    time_no.textContent = timer;
    console.log(timer);
    if (timer <= 10 && timer > 0) {
        time10.style.color = "red";
        time10.style.transform = "scale(1.3)";
        setTimeout(() => { time10.style.transform = "scale(1)" }, 150);
    }
    if (timer == 0) {
        var popup = document.getElementById("pop-up");
        popup.style.display = "flex";
        clearInterval(timenow);
        var bg = document.getElementById("game");
        bg.style.display = "block";
        endGame("l");
        // setTimeout(() => {
        //      window.location.href = "index.html";
        // }, 2000);
    }

}, 1000);


// function countdownn() {
//     outerpopup.style.display = "none";
//     var number = document.getElementById("numbers");
//     var countdown = 3;
//     var interval = setInterval(function () {
//         if (countdown > 0) {
//             number.textContent = countdown;
//             number.style.transform = "scale(1.3)";
//             setTimeout(() => { number.style.transform = "scale(1)" }, 150);
//             countdown--;
//         }
//         else {
//             clearInterval(interval);
//             number.textContent = "";
//             window.location.reload();
//         }
//     }, 1000);
// }

//var play_again_button = document.getElementById("play-again");
var outerpopup = document.getElementById("pop-up");
//play_again_button.addEventListener("click", countdownn);

var exit_button = document.getElementById("exit-button");
exit_button.addEventListener("click", function () {
    if (outerpopup.style.display = "flex") {
        outerpopup.style.display = "none";
        var confirming = document.getElementById("confirming_exit");
        confirming.style.display = "flex";
        clearInterval(timenow);
    }
    else {
        var confirming = document.getElementById("confirming_exit");
        confirming.style.display = "flex";
        clearInterval(timenow);
    }
});

var yes_button = document.getElementById("yes_button");
yes_button.addEventListener("click", function () { window.location.href = "index.html" });  //return to main menu

// var no_button = document.getElementById("no_button");
// no_button.addEventListener("click", function () { window.location.reload() });  //restart the game


