// ==========================================
// 🦸 SUPER ECO HERO
// ASSET VERSION + COMBO + RANK
// ==========================================

// ==========================================
// 🔊 SOUND SYSTEM
// ==========================================

let audioContext = null;
let soundEnabled = true;

// 🎵 BACKGROUND MUSIC
let musicTimer = null;
let musicStep = 0;

const musicNotes = [
    261.63, // C4
    329.63, // E4
    392.00, // G4
    329.63, // E4
    293.66, // D4
    349.23, // F4
    440.00, // A4
    349.23  // F4
];
function startBackgroundMusic() {
    if (!audioContext || !soundEnabled) return;

    stopBackgroundMusic();

    musicStep = 0;

    musicTimer = setInterval(() => {

        if (!soundEnabled) return;

        const note = musicNotes[musicStep];

        playSound(note, 0.25, "sine", 0.035);

        musicStep++;

        if (musicStep >= musicNotes.length) {
            musicStep = 0;
        }

    }, 350);
}


function stopBackgroundMusic() {

    if (musicTimer) {
        clearInterval(musicTimer);
        musicTimer = null;
    }

}
function initAudio() {
    if (!audioContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;

        if (AudioContext) {
            audioContext = new AudioContext();
        }
    }

    if (audioContext && audioContext.state === "suspended") {
        audioContext.resume();
    }
}

function playSound(frequency, duration, type = "sine", volume = 0.08) {
    if (!audioContext || !soundEnabled) return;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
    );

    gain.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        volume,
        audioContext.currentTime + 0.02
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration + 0.05);
}

// ✅ Suara benar
function soundCorrect() {
    playSound(523, 0.12, "sine", 0.08);

    setTimeout(() => {
        playSound(659, 0.15, "sine", 0.08);
    }, 100);

    setTimeout(() => {
        playSound(784, 0.20, "sine", 0.08);
    }, 220);
}

// ❌ Suara salah
function soundWrong() {
    playSound(220, 0.18, "sawtooth", 0.05);

    setTimeout(() => {
        playSound(165, 0.22, "sawtooth", 0.04);
    }, 120);
}

// 🏆 Suara selesai
function soundVictory() {
    
    playSound(523, 0.15, "sine", 0.08);

    setTimeout(() => {
        playSound(659, 0.15, "sine", 0.08);
    }, 120);

    setTimeout(() => {
        playSound(784, 0.15, "sine", 0.08);
    }, 240);

    setTimeout(() => {
        playSound(1047, 0.35, "sine", 0.10);
       }, 380);
}


// 🔥 COMBO SOUND

function soundCombo(combo) {

    if (combo === 2) {

        playSound(659, 0.12, "sine", 0.10);

        setTimeout(() => {
            playSound(784, 0.18, "sine", 0.10);
        }, 100);

    }

    else if (combo === 3) {

        playSound(784, 0.12, "sine", 0.11);

        setTimeout(() => {
            playSound(988, 0.18, "sine", 0.11);
        }, 100);

    }

    else if (combo === 5) {

        playSound(784, 0.12, "sine", 0.12);

        setTimeout(() => {
            playSound(988, 0.12, "sine", 0.12);
        }, 100);

        setTimeout(() => {
            playSound(1175, 0.25, "sine", 0.13);
        }, 200);

    }
}
// 🔥 COMBO POP-UP

function showComboPopup(combo) {

    if (combo < 2) return;

    let message = "";

    if (combo === 2) {
        message = "🔥 COMBO x2!";
    }

    else if (combo === 3) {
        message = "⚡ COMBO x3!";
    }

    else if (combo >= 5) {
        message = "🌟 COMBO x" + combo + "!";
    }

    else {
        message = "🔥 COMBO x" + combo + "!";
    }

   comboPopup.textContent = message;

comboPopup.classList.remove("show");
comboPopup.classList.remove("special");

if (combo >= 5) {
    comboPopup.classList.add("special");}

    // Memaksa animasi bisa dimainkan ulang
    void comboPopup.offsetWidth;

    comboPopup.classList.add("show");

    setTimeout(() => {
        comboPopup.classList.remove("show");
    }, 900);
}


const camera = document.getElementById("camera");
const soundButton = document.getElementById("soundButton");
const cameraBox = document.getElementById("cameraBox");
const trashLayer = document.getElementById("trashLayer");

const scoreElement = document.getElementById("score");
const instruction = document.getElementById("instruction");
const answerFeedback = document.getElementById("answerFeedback");
const comboPopup = document.getElementById("comboPopup");
const targetMessage = document.getElementById("targetMessage");

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

const finishMessage = document.getElementById("finishMessage");
const finalScore = document.getElementById("finalScore");
const restartButton = document.getElementById("restartButton");

const organicBin = document.getElementById("organicBin");
const inorganicBin = document.getElementById("inorganicBin");
const b3Bin = document.getElementById("b3Bin");


// ==========================================
// 🎮 GAME SETTINGS
// ==========================================

const TOTAL_TRASH = 8;

let score = 0;
let sortedCount = 0;

let combo = 0;
let bestCombo = 0;

let mistakeCount = 0;

let selectedTrash = null;
let highlightedTrash = null;

let holdStartTime = null;
let feedbackTimer = null;

let gameStarted = false;
let cameraStarted = false;


// ==========================================
// 🎯 CONTROL SETTINGS
// ==========================================

const HIGHLIGHT_DISTANCE = 330;
const PICK_DISTANCE = 215;

const HAND_SMOOTH = 0.35;

const TARGET_LOCK_TIME = 900;

let targetLockUntil = 0;


// ==========================================
// ✋ SMOOTH HAND
// ==========================================

let smoothHandX = null;
let smoothHandY = null;


// ==========================================
// 🗑️ TRASH TYPES
// ==========================================

const trashTypes = [

    {
        emoji: "🍌",
        image: "Asset/banana_peel.png",
        name: "Kulit Pisang",
        type: "organic"
    },

    {
        emoji: "🍎",
        image: "Asset/apple_core.png",
        name: "Sisa Apel",
        type: "organic"
    },

    {
        emoji: "🍃",
        image: "Asset/banana_leaf.png",
        name: "Daun Pisang",
        type: "organic"
    },

    {
        emoji: "🥚",
        image: "Asset/broken_egg_shells.png",
        name: "Cangkang Telur",
        type: "organic"
    },

    {
        emoji: "🥤",
        image: "Asset/coffe_cup.png",
        name: "Bekas Minuman",
        type: "inorganic"
    },

    {
        emoji: "📰",
        image: "Asset/crumpled_notebook_paper.png",
        name: "Kertas Bekas",
        type: "inorganic"
    },

    {
        emoji: "🥡",
        image: "Asset/styrofoam.png",
        name: "Styrofoam",
        type: "inorganic"
    },

    {
        emoji: "🔋",
        image: "Asset/battery.png",
        name: "Baterai",
        type: "b3"
    },

    {
        emoji: "💡",
        image: "Asset/lamp.png",
        name: "Lampu",
        type: "b3"
    }

];


// ==========================================
// 📍 TRASH POSITIONS
// ==========================================

const trashPositions = [

    { x: 18, y: 42 },
    { x: 36, y: 50 },
    { x: 55, y: 45 },
    { x: 80, y: 42 },

    { x: 25, y: 60 },
    { x: 45, y: 62 },
    { x: 65, y: 58 },
    { x: 85, y: 60 }

];


// ==========================================
// 🏆 CREATE RESULT ELEMENTS
// ==========================================

function createResultElements() {

    let rankElement =
        document.getElementById("finalRank");

    let comboElement =
        document.getElementById("finalCombo");

    let resultMessage =
        document.getElementById("resultMessage");


    const container =
        finishMessage.querySelector("div");


    if (!rankElement) {

        rankElement =
            document.createElement("div");

        rankElement.id =
            "finalRank";

        rankElement.style.fontSize =
            "32px";

        rankElement.style.fontWeight =
            "900";

        rankElement.style.margin =
            "10px 0";

        container.insertBefore(
            rankElement,
            finalScore.parentElement
        );
    }


    if (!comboElement) {

        comboElement =
            document.createElement("div");

        comboElement.id =
            "finalCombo";

        comboElement.style.fontSize =
            "20px";

        comboElement.style.fontWeight =
            "800";

        comboElement.style.marginBottom =
            "10px";

        container.insertBefore(
            comboElement,
            restartButton
        );
    }


    if (!resultMessage) {

        resultMessage =
            document.createElement("div");

        resultMessage.id =
            "resultMessage";

        resultMessage.style.fontSize =
            "18px";

        resultMessage.style.fontWeight =
            "700";

        resultMessage.style.margin =
            "8px 0 18px";

        container.insertBefore(
            resultMessage,
            restartButton
        );
    }


    return {
        rankElement,
        comboElement,
        resultMessage
    };
}


// ==========================================
// 🚀 START GAME
// ==========================================

startButton.addEventListener("click", () => {
    initAudio();
    startBackgroundMusic();
    startScreen.style.display = "none";

    finishMessage.classList.remove("show");

    score = 0;
    sortedCount = 0;
    combo = 0;
    bestCombo = 0;
    mistakeCount = 0;

    scoreElement.textContent = "⭐ 0";

    selectedTrash = null;
    highlightedTrash = null;

    smoothHandX = null;
    smoothHandY = null;

    targetLockUntil = 0;

    answerFeedback.textContent = "";
    targetMessage.textContent = "";

    createTrash();

    gameStarted = true;

    instruction.textContent =
        "🖐️ Dekati sampah dengan tanganmu!";

    startCamera();

});


// ==========================================
// 🔄 RESTART
// ==========================================

restartButton.addEventListener("click", () => {
    startBackgroundMusic();
    finishMessage.classList.remove("show");

    score = 0;
    sortedCount = 0;
    combo = 0;
    bestCombo = 0;
    mistakeCount = 0;

    scoreElement.textContent = "⭐ 0";

    selectedTrash = null;
    highlightedTrash = null;

    smoothHandX = null;
    smoothHandY = null;

    targetLockUntil = 0;

    createTrash();

    gameStarted = true;

    instruction.textContent =
        "🖐️ Dekati sampah dengan tanganmu!";

});


// ==========================================
// 🗑️ CREATE TRASH
// ==========================================

function createTrash() {

    trashLayer.innerHTML = "";


    const shuffled =
        [...trashTypes]
        .sort(() => Math.random() - 0.5)
        .slice(0, TOTAL_TRASH);


    shuffled.forEach((trash, index) => {

        const position =
            trashPositions[index];


        const element =
            document.createElement("div");


        element.className =
            "trash-object";


        // ==================================
        // 🍌 USE IMAGE IF AVAILABLE
        // ==================================

        if (trash.image) {

            const image =
                document.createElement("img");

            image.src =
                trash.image;

            image.alt =
                trash.name;

            image.draggable =
                false;

            image.style.width =
                "72px";

            image.style.height =
                "72px";

            image.style.objectFit =
                "contain";

            image.style.pointerEvents =
                "none";

            element.appendChild(
                image
            );

        } else {

            element.textContent =
                trash.emoji;
        }


        element.dataset.type =
            trash.type;

        element.dataset.name =
            trash.name;

        element.dataset.originalX =
            position.x;

        element.dataset.originalY =
            position.y;


        element.style.left =
            position.x + "%";

        element.style.top =
            position.y + "%";


        trashLayer.appendChild(
            element
        );

    });
}


// ==========================================
// 📏 DISTANCE
// ==========================================

function distance(
    x1,
    y1,
    x2,
    y2
) {

    return Math.sqrt(

        Math.pow(
            x1 - x2,
            2
        )

        +

        Math.pow(
            y1 - y2,
            2
        )

    );
}


// ==========================================
// 🔎 FIND NEAREST TRASH
// ==========================================

function findNearestTrash(
    x,
    y,
    maxDistance
) {

    const trashObjects =
        [
            ...document.querySelectorAll(
                ".trash-object:not(.carried):not(.sorting)"
            )
        ];


    let nearest = null;

    let nearestDistance =
        Infinity;


    trashObjects.forEach(trash => {

        const rect =
            trash.getBoundingClientRect();

        const boxRect =
            cameraBox.getBoundingClientRect();


        const trashX =
            rect.left -
            boxRect.left +
            rect.width / 2;


        const trashY =
            rect.top -
            boxRect.top +
            rect.height / 2;


        const d =
            distance(
                x,
                y,
                trashX,
                trashY
            );


        if (
            d < nearestDistance &&
            d <= maxDistance
        ) {

            nearest =
                trash;

            nearestDistance =
                d;
        }

    });


    return nearest;
}


// ==========================================
// 🎯 TARGET LOCK
// ==========================================

function updateTarget(
    x,
    y
) {

    const now =
        Date.now();


    if (
        highlightedTrash &&
        now < targetLockUntil &&
        document.body.contains(
            highlightedTrash
        )
    ) {

        return highlightedTrash;
    }


    const nearest =
        findNearestTrash(
            x,
            y,
            HIGHLIGHT_DISTANCE
        );


    if (
        nearest !==
        highlightedTrash
    ) {

        if (highlightedTrash) {

            highlightedTrash.classList.remove(
                "target-trash"
            );
        }


        highlightedTrash =
            nearest;


        if (highlightedTrash) {

            highlightedTrash.classList.add(
                "target-trash"
            );


            targetLockUntil =
                Date.now() +
                TARGET_LOCK_TIME;


            targetMessage.textContent =
                "🧲 " +
                highlightedTrash.dataset.name;

        } else {

            targetMessage.textContent =
                "";
        }
    }


    return highlightedTrash;
}


// ==========================================
// 🧲 PICK TRASH
// ==========================================

function pickTrash(
    trash
) {

    if (!trash) return;

    if (selectedTrash) return;


    selectedTrash =
        trash;


    trash.classList.remove(
        "target-trash"
    );


    highlightedTrash =
        null;


    const rect =
        trash.getBoundingClientRect();


    const boxRect =
        cameraBox.getBoundingClientRect();


    const centerX =
        rect.left -
        boxRect.left +
        rect.width / 2;


    const centerY =
        rect.top -
        boxRect.top +
        rect.height / 2;


    trash.style.left =
        centerX + "px";


    trash.style.top =
        centerY + "px";


    trash.classList.add(
        "selected"
    );


    trash.classList.add(
        "carried"
    );


    instruction.textContent =
        "🧲 Bawa sampah ke tempat yang benar!";


    targetMessage.textContent =
        "✋ Pegang dan arahkan!";
}


// ==========================================
// ✋ MOVE TRASH
// ==========================================

function moveSelectedTrash(
    x,
    y
) {

    if (!selectedTrash)
        return;


    const currentX =
        parseFloat(
            selectedTrash.style.left
        );


    const currentY =
        parseFloat(
            selectedTrash.style.top
        );


    const newX =
        currentX +
        (
            x -
            currentX
        ) *
        HAND_SMOOTH;


    const newY =
        currentY +
        (
            y -
            currentY
        ) *
        HAND_SMOOTH;


    selectedTrash.style.left =
        newX + "px";


    selectedTrash.style.top =
        newY + "px";
}


// ==========================================
// 🗑️ DETECT BIN
// ==========================================

function detectBin(
    x,
    y
) {

    if (!selectedTrash)
        return;


    const bins = [
        organicBin,
        inorganicBin,
        b3Bin
    ];


    let targetBin =
        null;


    bins.forEach(bin => {

        const rect =
            bin.getBoundingClientRect();

        const boxRect =
            cameraBox.getBoundingClientRect();


        const left =
            rect.left -
            boxRect.left;

        const top =
            rect.top -
            boxRect.top;

        const right =
            left +
            rect.width;

        const bottom =
            top +
            rect.height;


        const paddingX =
            80;

        const paddingY =
            100;


        if (
            x >= left - paddingX &&
            x <= right + paddingX &&
            y >= top - paddingY &&
            y <= bottom + paddingY
        ) {

            targetBin =
                bin;
        }

    });


    bins.forEach(bin => {

        bin.classList.remove(
            "target"
        );


        if (bin === targetBin) {

            bin.classList.add(
                "target"
            );
        }

    });


    if (!targetBin) {

        holdStartTime =
            null;

        return;
    }


    if (!holdStartTime) {

        holdStartTime =
            Date.now();


        instruction.textContent =
            "⏳ Tahan sebentar...";
    }


    const elapsed =
        Date.now() -
        holdStartTime;


    if (elapsed >= 700) {

        sortTrash(
            targetBin
        );
    }
}


// ==========================================
// ♻️ SORT TRASH
// ==========================================

function sortTrash(
    bin
) {

    if (!selectedTrash)
        return;


    const trash =
        selectedTrash;


    const correctType =
        trash.dataset.type;


    const selectedType =
        bin.dataset.type;


    selectedTrash =
        null;


    holdStartTime =
        null;


    document
        .querySelectorAll(".bin")
        .forEach(binElement => {

            binElement.classList.remove(
                "target"
            );

        });


    // ======================================
    // ✅ CORRECT
    // ======================================

    if (
        correctType ===
        selectedType
    ) {
        soundCorrect();

        score += 10;

        sortedCount++;

        combo++;
        soundCombo(combo);
        showComboPopup(combo);


        if (
            combo > bestCombo
        ) {

            bestCombo =
                combo;
        }


        scoreElement.textContent =
            "⭐ " +
            score;


        if (
            combo >= 2
        ) {

            instruction.textContent =
                "🔥 COMBO x" +
                combo +
                "! +10";


            targetMessage.textContent =
                "🌟 Luar biasa! Pertahankan!";

        } else {

            instruction.textContent =
                "🌟 BENAR! +10";


            targetMessage.textContent =
                "♻️ Sampah berhasil diselamatkan!";
        }


        showFeedback("✅");


        bin.classList.add(
            "success"
        );


        setTimeout(() => {

            bin.classList.remove(
                "success"
            );

        }, 700);


        const binRect =
            bin.getBoundingClientRect();


        const boxRect =
            cameraBox.getBoundingClientRect();


        const binX =
            binRect.left -
            boxRect.left +
            binRect.width / 2;


        const binY =
            binRect.top -
            boxRect.top +
            binRect.height / 2;


        const trashRect =
            trash.getBoundingClientRect();


        const trashX =
            trashRect.left -
            boxRect.left +
            trashRect.width / 2;


        const trashY =
            trashRect.top -
            boxRect.top +
            trashRect.height / 2;


        const moveX =
            binX -
            trashX;


        const moveY =
            binY -
            trashY;


        trash.classList.remove(
            "carried"
        );


        trash.classList.remove(
            "selected"
        );


        trash.classList.add(
            "sorting"
        );


        trash.style.transform =
            `
            translate(
                calc(-50% + ${moveX}px),
                calc(-50% + ${moveY}px)
            )
            scale(0.2)
            rotate(20deg)
            `;


        setTimeout(() => {

            trash.remove();

        }, 500);


        setTimeout(() => {

            if (
                sortedCount >=
                TOTAL_TRASH
            ) {

                finishGame();
            }

        }, 650);

    }


    // ======================================
    // ❌ WRONG
    // ======================================

    else {
        soundWrong();

        showFeedback("❌");


        combo = 0;

        mistakeCount++;


        instruction.textContent =
            "❌ Belum tepat, coba lagi!";


        targetMessage.textContent =
            "🔄 Coba tempat sampah lain!";


        trash.classList.add(
            "wrong-trash"
        );


        const originalX =
            trash.dataset.originalX;


        const originalY =
            trash.dataset.originalY;


        setTimeout(() => {

            trash.style.transform =
                "translate(-50%, -50%)";


            trash.style.left =
                originalX + "%";


            trash.style.top =
                originalY + "%";


            trash.classList.remove(
                "selected"
            );


            trash.classList.remove(
                "carried"
            );


            trash.classList.remove(
                "wrong-trash"
            );

        }, 650);
    }
}


// ==========================================
// 💥 FEEDBACK
// ==========================================

function showFeedback(
    symbol
) {

    clearTimeout(
        feedbackTimer
    );


    answerFeedback.textContent =
        symbol;


    answerFeedback.classList.remove(
        "show"
    );


    void answerFeedback.offsetWidth;


    answerFeedback.classList.add(
        "show"
    );


    feedbackTimer =
        setTimeout(() => {

            answerFeedback.classList.remove(
                "show"
            );

        }, 900);
}


// ==========================================
// 🏆 DETERMINE RANK
// ==========================================

function determineRank() {

    if (
        mistakeCount === 0 &&
        sortedCount === TOTAL_TRASH
    ) {

        return {
            icon: "🌍",
            title: "PLANET SAVER!",
            message:
                "Sempurna! Tidak ada satu pun kesalahan!"
        };
    }


    if (
        bestCombo >= 5
    ) {

        return {
            icon: "🦸‍♀️",
            title: "SUPER ECO HERO!",
            message:
                "Wow! Combo kamu luar biasa!"
        };
    }


    if (
        bestCombo >= 3
    ) {

        return {
            icon: "🌿",
            title: "ECO HERO!",
            message:
                "Keren! Kamu hebat menjaga bumi!"
        };
    }


    return {
        icon: "🌱",
        title: "ECO ROOKIE!",
        message:
            "Terus berlatih untuk menjadi Eco Hero!"
    };
}


// ==========================================
// 🏆 FINISH GAME
// ==========================================

function finishGame() {
    initAudio();
    stopBackgroundMusic();
    soundVictory();

    gameStarted =
        false;


    selectedTrash =
        null;


    highlightedTrash =
        null;


    targetMessage.textContent =
        "";


    instruction.textContent =
        "🎉 Semua sampah berhasil diselamatkan!";


    finalScore.textContent =
        score;


    const results =
        createResultElements();


    const rank =
        determineRank();


    results.rankElement.innerHTML =
        rank.icon +
        " " +
        rank.title;


    results.comboElement.innerHTML =
        "🔥 Best Combo: x" +
        bestCombo;


    results.resultMessage.textContent =
        rank.message;


    setTimeout(() => {

        finishMessage.classList.add(
            "show"
        );

    }, 700);
}


// ==========================================
// ✋ SUPERHERO HAND CURSOR
// ==========================================

let handCursor =
    document.getElementById(
        "testHand"
    );


if (!handCursor) {

    handCursor =
        document.createElement(
            "div"
        );


    handCursor.id =
        "testHand";


    cameraBox.appendChild(
        handCursor
    );
}


// ==========================================
// 🎥 MEDIAPIPE POSE
// ==========================================

const pose =
    new Pose({

        locateFile: file => {

            return (
                "https://cdn.jsdelivr.net/npm/" +
                "@mediapipe/pose/" +
                file
            );

        }

    });


pose.setOptions({

    modelComplexity: 1,

    smoothLandmarks: true,

    enableSegmentation: false,

    minDetectionConfidence: 0.5,

    minTrackingConfidence: 0.5

});


// ==========================================
// 📸 POSE RESULTS
// ==========================================

pose.onResults(results => {

    if (!gameStarted)
        return;


    if (
        !results.poseLandmarks ||
        !results.poseLandmarks[16]
    ) {

        handCursor.style.display =
            "none";

        return;
    }


    handCursor.style.display =
        "block";


    const wrist =
        results.poseLandmarks[16];


    const boxWidth =
        cameraBox.clientWidth;


    const boxHeight =
        cameraBox.clientHeight;


    // ======================================
    // 👉 RIGHT HAND = RIGHT SCREEN
    // ======================================

    const targetX =
        wrist.x *
        boxWidth;


    const targetY =
        wrist.y *
        boxHeight;


    // ======================================
    // ✨ HAND SMOOTHING
    // ======================================

    if (
        smoothHandX === null ||
        smoothHandY === null
    ) {

        smoothHandX =
            targetX;

        smoothHandY =
            targetY;

    } else {

        smoothHandX +=
            (
                targetX -
                smoothHandX
            ) *
            HAND_SMOOTH;


        smoothHandY +=
            (
                targetY -
                smoothHandY
            ) *
            HAND_SMOOTH;
    }


    // ======================================
    // 👆 MOVE SUPERHERO HAND
    // ======================================

    handCursor.style.left =
        smoothHandX +
        "px";


    handCursor.style.top =
        smoothHandY +
        "px";


    // ======================================
    // 🧲 SMART MAGNET
    // ======================================

    if (!selectedTrash) {

        const target =
            updateTarget(
                smoothHandX,
                smoothHandY
            );


        if (target) {

            const rect =
                target.getBoundingClientRect();


            const boxRect =
                cameraBox.getBoundingClientRect();


            const trashX =
                rect.left -
                boxRect.left +
                rect.width / 2;


            const trashY =
                rect.top -
                boxRect.top +
                rect.height / 2;


            const d =
                distance(
                    smoothHandX,
                    smoothHandY,
                    trashX,
                    trashY
                );


            if (
                d <= PICK_DISTANCE
            ) {

                pickTrash(
                    target
                );
            }
        }

    } else {

        moveSelectedTrash(
            smoothHandX,
            smoothHandY
        );


        detectBin(
            smoothHandX,
            smoothHandY
        );
    }

});


// ==========================================
// 🎥 START CAMERA
// ==========================================

function startCamera() {

    if (cameraStarted)
        return;


    cameraStarted =
        true;


    const cameraController =
        new Camera(
            camera,
            {

                onFrame:
                    async () => {

                        await pose.send({
                            image: camera
                        });

                    },

                width: 640,

                height: 480

            }
        );


    cameraController.start();
}
// 🔊 SOUND ON / OFF

soundButton.addEventListener("click", () => {

    soundEnabled = !soundEnabled;

    if (soundEnabled) {
        soundButton.textContent = "🔊";
        initAudio();
    } else {
        soundButton.textContent = "🔇";
    }

});