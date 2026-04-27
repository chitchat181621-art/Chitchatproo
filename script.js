// ─── QUESTION BANK ────────────────────────────────────────────────
const questions = {
    
         

"Logical Reasoning": [
   
{ q: "A is B’s sister, C is B’s mother, D is C’s father. How is D related to A?", a: ["Father", "Grandfather", "Uncle", "Brother"], correct: 1 },
{ q: "Ravi walks 10m north, then 5m east, then 10m south. Where is he now?", a: ["5m east", "5m west", "10m north", "Same point"], correct: 0 },
{ q: "If 12 Jan 2020 is Sunday, what day is 12 Jan 2021?", a: ["Monday", "Tuesday", "Wednesday", "Thursday"], correct: 1 },
{ q: "If in a row, Ramesh is 7th from left and 10th from right, how many people are there?", a: ["16", "17", "18", "19"], correct: 1 },
{ q: "If LIGHT = 49, HEAVY = ?", a: ["81", "64", "100", "121"], correct: 1 }
],
    "Computer Awareness": 
      [
   
{ q: "Which layer of OSI model is responsible for encryption?", a: ["Transport", "Presentation", "Session", "Application"], correct: 1 },
{ q: "Which memory is non-volatile?", a: ["RAM", "Cache", "ROM", "Register"], correct: 2 },
{ q: "Which is the smallest unit of data?", a: ["Byte", "Bit", "Nibble", "Word"], correct: 1 },
{ q: "Which of the following is NOT a programming language?", a: ["Python", "Java", "HTTP", "C++"], correct: 2 },
{ q: "Which of the following is NOT storage device?", a: ["Hard Disk", "Pen Drive", "RAM", "CD"], correct: 2 }
],


    "General English": 
[
{ q: "Choose correct: I wish I _ taller.", a: ["am", "was", "were", "be"], correct: 2 },
{ q: "Synonym of 'Obsolete'?", a: ["Modern", "Outdated", "New", "Recent"], correct: 1 },
{ q: "Antonym of 'Transparent'?", a: ["Clear", "Opaque", "Visible", "Bright"], correct: 1 },
{ q: "Choose correct: She is fond _ music.", a: ["of", "in", "on", "at"], correct: 0 },
{ q: "Fill in: He prevented me _ going there.", a: ["to", "from", "at", "for"], correct: 1 }


],
    "General Knowledge": 
    [
       

{ q: "Which is the deepest ocean in the world?", a: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3 },
{ q: "Who was the first Governor-General of independent India?", a: ["C. Rajagopalachari", "Lord Mountbatten", "Rajendra Prasad", "Nehru"], correct: 1 },
{ q: "Which Indian state produces maximum tea?", a: ["Kerala", "Assam", "Tamil Nadu", "West Bengal"], correct: 1 },
{ q: "Which is the fastest train in India (approx)?", a: ["Rajdhani", "Shatabdi", "Vande Bharat", "Duronto"], correct: 2 },
{ q: "Which is the longest highway in India?", a: ["NH44", "NH27", "NH48", "NH66"], correct: 0 },
    ]

};

// ─── ROUND CONFIG ─────────────────────────────────────────────────
const ROUNDS = [
    { category: "Logical Reasoning",  icon: "🧩", desc: "Put your logic and reasoning to the test!" },
    { category: "Computer Awareness", icon: "💻", desc: "How well do you know computers & tech?" },
    { category: "General English",    icon: "📚", desc: "Grammar, vocabulary & comprehension!" },
    { category: "General Knowledge",  icon: "🌍", desc: "From science to history — how sharp are you?" }
];

// ─── STATE ────────────────────────────────────────────────────────
let playerName    = "";
let currentRound  = 0;
let currentQIndex = 0;
let timer;
let timeLeft      = 15;

// ─── SCORE TRACKING (silent – never shown on screen) ──────────────
let totalScore = 0;

// ─── HELPERS ──────────────────────────────────────────────────────
function playSound(id) {
    try { const s = document.getElementById(id); s.currentTime = 0; s.play(); } catch(e) {}
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        s.classList.add('fade-out');
    });
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.add('hidden');
            s.classList.remove('fade-out');
        });
        const target = document.getElementById(id);
        target.classList.remove('hidden');
        setTimeout(() => target.classList.add('active'), 20);
    }, 300);
}

// ─── SAVE TO GOOGLE SHEETS + GMAIL ───────────────────────────────
function saveScoreToServer() {
    const totalQuestions = 120;
    const url = 'https://script.google.com/macros/s/AKfycbxpvIhanrIRHgFIyjWM8yZEGrxIjMUFvfaEe38QH1UUyBecebVqlpcFcmPowVXdhG9A/exec'
        + '?name='  + encodeURIComponent(playerName)
        + '&score=' + encodeURIComponent(totalScore)
        + '&total=' + encodeURIComponent(totalQuestions);

    console.log('Sending score... Name:', playerName, 'Score:', totalScore);

    // Fetch with CORS for GitHub Pages
    fetch(url)
    .then(res => res.json())
    .then(data => console.log('Score sent successfully!', data))
    .catch(err => {
        // Fallback image tag
        var img = new Image();
        img.src = url;
        console.log('Score sent via fallback!');
    });
}
// ─── FLOW ─────────────────────────────────────────────────────────
function startJourney() {
    const inp = document.getElementById('username').value.trim();
    if (!inp) {
        document.getElementById('username').classList.add('shake');
        setTimeout(() => document.getElementById('username').classList.remove('shake'), 500);
        return;
    }
    playerName   = inp;
    currentRound = 0;
    totalScore   = 0;
    playSound('sound-click');
    showRoundIntro();
}

function showRoundIntro() {
    const r = ROUNDS[currentRound];
    document.getElementById('round-badge-num').textContent = `${r.icon} ROUND ${currentRound + 1} of ${ROUNDS.length}`;
    document.getElementById('round-cat-name').textContent  = r.category;
    document.getElementById('round-desc').textContent      = r.desc;
    showScreen('round-intro-screen');
}

function beginRound() {
    playSound('sound-click');
    currentQIndex = 0;

    const r = ROUNDS[currentRound];
    document.getElementById('qtb-round').textContent = `ROUND ${currentRound + 1}`;
    document.getElementById('qtb-cat').textContent   = r.category;

    showScreen('quiz-screen');
    loadQuestion();
}

function loadQuestion() {
    const cat   = ROUNDS[currentRound].category;
    const qList = questions[cat];
    const qData = qList[currentQIndex];

    document.getElementById('question-text').textContent = qData.q;
    document.getElementById('q-number').textContent      = `Q${currentQIndex + 1} / ${qList.length}`;
    document.getElementById('next-btn').classList.add('hidden');

    const container = document.getElementById('options-container');
    container.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    qData.a.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span class="opt-letter">${letters[i]}</span><span class="opt-text">${opt}</span>`;
        btn.onclick   = () => checkAnswer(i, btn);
        container.appendChild(btn);
    });

    startTimer();
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 30;
    const fill = document.getElementById('timer-fill');
    const num  = document.getElementById('timer-num');
    fill.style.width      = '100%';
    fill.style.background = '#22d3ee';
    num.textContent       = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        num.textContent      = timeLeft;
        fill.style.width     = (timeLeft / 30 * 100) + '%';
        if (timeLeft <= 5)      fill.style.background = '#f43f5e';
        else if (timeLeft <= 9) fill.style.background = '#f59e0b';
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
            document.getElementById('next-btn').classList.remove('hidden');
        }
    }, 1000);
}

function checkAnswer(index, btn) {
    clearInterval(timer);
    const cat   = ROUNDS[currentRound].category;
    const qData = questions[cat][currentQIndex];
    const allBtns = document.querySelectorAll('.option-btn');

    allBtns.forEach(b => b.disabled = true);

    if (index === qData.correct) {
        btn.classList.add('correct');
        playSound('sound-correct');
        totalScore++; // silent score increment only
    } else {
        btn.classList.add('wrong');
        playSound('sound-wrong');
    }

    document.getElementById('next-btn').classList.remove('hidden');
}

function nextQuestion() {
    const cat = ROUNDS[currentRound].category;
    currentQIndex++;
    if (currentQIndex < questions[cat].length) {
        loadQuestion();
    } else {
        showRoundResult();
    }
}
document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        alert("You left the quiz window. Quiz will be submitted.");

        clearInterval(timer);
        showFinalScreen();
    }
});

function showRoundResult() {
    playSound('sound-finish');
    const r = ROUNDS[currentRound];
    document.getElementById('rr-round-tag').textContent = `ROUND ${currentRound + 1} COMPLETE`;
    document.getElementById('rr-cat').textContent       = `${r.icon} ${r.category}`;
    document.getElementById('rr-verdict').textContent   = "🎉 Round Complete! Keep it up!";

    const isLast = currentRound >= ROUNDS.length - 1;
    document.getElementById('next-round-btn').textContent = isLast ? "See Results →" : "Next Round →";

    showScreen('round-result-screen');
}


function retryRound() {
    playSound('sound-click');
    beginRound();
}

function goNextRound() {
    playSound('sound-click');
    currentRound++;
    if (currentRound >= ROUNDS.length) {
        showFinalScreen();
    } else {
        showRoundIntro();
    }
}

function showFinalScreen() {
    playSound('sound-finish');
    document.getElementById('final-player-name').textContent = `🎉 ${playerName}`;
    saveScoreToServer();
    showScreen('final-screen');
}

function resetGame() {
    playSound('sound-click');
    currentRound = 0;
    totalScore   = 0;
    document.getElementById('username').value = '';
    showScreen('login-screen');
}

