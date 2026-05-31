/* =========================================
   LONG & SHORT OO GAME
   PART 1
========================================= */

/* =========================================
   DOM REFERENCES
========================================= */

const splashScreen = document.getElementById("splashScreen");
const gameContainer = document.getElementById("gameContainer");
const loadingScreen = document.getElementById("loadingScreen");

const replayInstructionsBtn = document.getElementById("replayInstructionsBtn");
const replayWordBtn = document.getElementById("replayWordBtn");

const scoreValue = document.getElementById("scoreValue");

const cardImage = document.getElementById("cardImage");
const cardWord = document.getElementById("cardWord");
const wordCard = document.getElementById("wordCard");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const backgroundMusic = document.getElementById("backgroundMusic");

const finalScore = document.getElementById("finalScore");
const starContainer = document.getElementById("starContainer");
const endScreen = document.getElementById("endScreen");
const playAgainBtn = document.getElementById("playAgainBtn");

/* =========================================
   GAME DATA
========================================= */

const shortWords = [
    "book",
    "cook",
    "look",
    "hook",
    "good",
    "wood",
    "hood",
    "foot",
    "wool"
];

const longWords = [
    "moon",
    "room",
    "roof",
    "root",
    "pool",
    "spoon",
    "broom",
    "food",
    "zoo"
];

/* =========================================
   BUILD ALTERNATING WORD LIST
========================================= */

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function buildWordSequence() {

    const shortCopy = shuffle([...shortWords]);
    const longCopy = shuffle([...longWords]);

    const result = [];

    for (let i = 0; i < shortCopy.length; i++) {

        result.push({
            word: shortCopy[i],
            type: "short"
        });

        result.push({
            word: longCopy[i],
            type: "long"
        });
    }

    return result;
}

let gameWords = buildWordSequence();

/* =========================================
   GAME STATE
========================================= */

let currentIndex = 0;
let score = 0;
let currentWord = null;
let instructionsFinished = false;

/* =========================================
   IMAGE PRELOADING
========================================= */

function preloadImages() {

    const images = [
        "innovine-logo.png",
        "book-monster.png",
        "moon-monster.png",

        "book.png",
        "cook.png",
        "look.png",
        "hook.png",
        "good.png",
        "wood.png",
        "hood.png",
        "foot.png",
        "wool.png",

        "moon.png",
        "room.png",
        "roof.png",
        "root.png",
        "pool.png",
        "spoon.png",
        "broom.png",
        "food.png",
        "zoo.png"
    ];

    images.forEach(file => {

        const img = new Image();
        img.src = `assets/${file}`;
    });
}

/* =========================================
   SPEECH
========================================= */

function speak(text, callback = null) {

    if (!window.speechSynthesis) {

        if (callback) callback();
        return;
    }

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1;

    utterance.onend = () => {

        if (callback) {
            callback();
        }
    };

    speechSynthesis.speak(utterance);
}

/* =========================================
   INSTRUCTIONS
========================================= */

function speakInstructions() {

    const instructionText =

        "Welcome! " +

        "Listen to the word. " +

        "Then drag the picture to the correct monster. " +

        "Drag left to the Book Monster if you hear the short oo sound like book. " +

        "Drag right to the Moon Monster if you hear the long oo sound like moon.";

    speak(instructionText, () => {

        instructionsFinished = true;

        startBackgroundMusic();

        loadCurrentCard();
    });
}

/* =========================================
   BACKGROUND MUSIC
========================================= */

function startBackgroundMusic() {

    backgroundMusic.volume = 0.25;

    const playPromise = backgroundMusic.play();

    if (playPromise !== undefined) {

        playPromise
            .then(() => {})
            .catch(() => {
                console.log("Music waiting for user interaction.");
            });
    }
}

/* =========================================
   SCORE
========================================= */

function updateScore() {

    scoreValue.textContent = score;
}

/* =========================================
   WORD AUDIO
========================================= */

function speakCurrentWord() {

    if (!currentWord) return;

    speak(currentWord.word);
}

/* =========================================
   LOAD CARD
========================================= */

function loadCurrentCard() {

    if (currentIndex >= gameWords.length) {

        endGame();
        return;
    }

    currentWord = gameWords[currentIndex];

    cardImage.src =
        `assets/${currentWord.word}.png`;

    cardImage.alt =
        currentWord.word;

    cardWord.textContent =
        currentWord.word.toUpperCase();

    wordCard.style.animation = "none";

    void wordCard.offsetWidth;

    wordCard.style.animation =
        "slideUp .7s ease";

    setTimeout(() => {

        speakCurrentWord();

    }, 500);
}

/* =========================================
   REPLAY BUTTONS
========================================= */

replayInstructionsBtn.addEventListener(
    "click",
    () => {

        speakInstructions();
    }
);

replayWordBtn.addEventListener(
    "click",
    () => {

        speakCurrentWord();
    }
);

/* =========================================
   STARTUP
========================================= */

window.addEventListener(
    "load",
    () => {

        preloadImages();

        setTimeout(() => {

            loadingScreen.classList.add("hidden");

        }, 500);

        setTimeout(() => {

            splashScreen.style.display = "none";

            gameContainer.classList.remove("hidden");

            speakInstructions();

        }, 5000);
    }
);

/* =========================================
   PART 2 CONTINUES BELOW
========================================= */
/* =========================================
   PART 2
   DRAG & DROP + GAME LOGIC
========================================= */

const bookMonster =
    document.getElementById("bookMonster");

const moonMonster =
    document.getElementById("moonMonster");

const correctFeedback =
    document.getElementById("correctFeedback");

const wrongFeedback =
    document.getElementById("wrongFeedback");

/* =========================================
   DRAG EVENTS
========================================= */

wordCard.addEventListener("dragstart", dragStart);

function dragStart(e) {

    e.dataTransfer.setData(
        "text/plain",
        currentWord.word
    );
}

/* =========================================
   DROP ZONES
========================================= */

[bookMonster, moonMonster].forEach(zone => {

    zone.addEventListener("dragover", dragOver);

    zone.addEventListener("dragleave", dragLeave);

    zone.addEventListener("drop", handleDrop);
});

function dragOver(e) {

    e.preventDefault();

    e.currentTarget.classList.add("drag-over");
}

function dragLeave(e) {

    e.currentTarget.classList.remove("drag-over");
}

function handleDrop(e) {

    e.preventDefault();

    e.currentTarget.classList.remove("drag-over");

    const selectedType =
        e.currentTarget.dataset.answer;

    checkAnswer(selectedType);
}

/* =========================================
   TOUCH SUPPORT
========================================= */

let currentX = 0;
let currentY = 0;
let startX = 0;
let startY = 0;

wordCard.addEventListener(
    "touchstart",
    touchStart,
    { passive: false }
);

wordCard.addEventListener(
    "touchmove",
    touchMove,
    { passive: false }
);

wordCard.addEventListener(
    "touchend",
    touchEnd
);

function touchStart(e) {

    const touch = e.touches[0];

    startX = touch.clientX;
    startY = touch.clientY;
}

function touchMove(e) {

    e.preventDefault();

    const touch = e.touches[0];

    currentX = touch.clientX - startX;
    currentY = touch.clientY - startY;

    wordCard.style.transform =
        `translate(${currentX}px, ${currentY}px)`;
}

function touchEnd() {

    const cardRect =
        wordCard.getBoundingClientRect();

    const bookRect =
        bookMonster.getBoundingClientRect();

    const moonRect =
        moonMonster.getBoundingClientRect();

    const cardCenterX =
        cardRect.left + cardRect.width / 2;

    const cardCenterY =
        cardRect.top + cardRect.height / 2;

    if (
        cardCenterX > bookRect.left &&
        cardCenterX < bookRect.right &&
        cardCenterY > bookRect.top &&
        cardCenterY < bookRect.bottom
    ) {

        checkAnswer("short");
    }

    else if (
        cardCenterX > moonRect.left &&
        cardCenterX < moonRect.right &&
        cardCenterY > moonRect.top &&
        cardCenterY < moonRect.bottom
    ) {

        checkAnswer("long");
    }

    wordCard.style.transform = "";
}

/* =========================================
   ANSWER CHECKING
========================================= */

function checkAnswer(selectedType) {

    if (!currentWord) return;

    if (selectedType === currentWord.type) {

        handleCorrect();
    }
    else {

        handleWrong();
    }
}

/* =========================================
   CORRECT ANSWER
========================================= */

function handleCorrect() {

    correctSound.currentTime = 0;
    correctSound.play();

    score++;

    updateScore();

    correctFeedback.classList.remove("hidden");

    const targetMonster =
        currentWord.type === "short"
        ? bookMonster
        : moonMonster;

    targetMonster.classList.add("bounce");

    setTimeout(() => {

        targetMonster.classList.remove("bounce");

    }, 600);

    setTimeout(() => {

        correctFeedback.classList.add("hidden");

        currentIndex++;

        loadCurrentCard();

    }, 1500);
}

/* =========================================
   WRONG ANSWER
========================================= */

function handleWrong() {

    wrongSound.currentTime = 0;
    wrongSound.play();

    wrongFeedback.classList.remove("hidden");

    setTimeout(() => {

        wrongFeedback.classList.add("hidden");

        speakCurrentWord();

    }, 1200);
}

/* =========================================
   STAR CALCULATION
========================================= */

function calculateStars() {

    if (score === 18) {

        return "⭐⭐⭐⭐⭐";
    }

    if (score >= 16) {

        return "⭐⭐⭐⭐";
    }

    if (score >= 13) {

        return "⭐⭐⭐";
    }

    if (score >= 10) {

        return "⭐⭐";
    }

    return "⭐";
}

/* =========================================
   END GAME
========================================= */

function endGame() {

    speechSynthesis.cancel();

    backgroundMusic.pause();

    backgroundMusic.currentTime = 0;

    finalScore.textContent =
        `Final Score: ${score} / 18`;

    starContainer.textContent =
        calculateStars();

    endScreen.classList.remove("hidden");
}

/* =========================================
   PLAY AGAIN
========================================= */

playAgainBtn.addEventListener(
    "click",
    restartGame
);

function restartGame() {

    score = 0;

    currentIndex = 0;

    currentWord = null;

    updateScore();

    gameWords =
        buildWordSequence();

    endScreen.classList.add("hidden");

    loadCurrentCard();

    startBackgroundMusic();
}

/* =========================================
   PREVENT IMAGE DRAG ISSUES
========================================= */

cardImage.addEventListener(
    "dragstart",
    e => e.preventDefault()
);

/* =========================================
   UNLOCK AUDIO ON MOBILE
========================================= */

document.addEventListener(
    "click",
    unlockAudio,
    { once: true }
);

document.addEventListener(
    "touchstart",
    unlockAudio,
    { once: true }
);

function unlockAudio() {

    const silent =
        new Audio();

    silent.play()
        .then(() => {})
        .catch(() => {});
}

/* =========================================
   SAFETY CHECK
========================================= */

updateScore();
