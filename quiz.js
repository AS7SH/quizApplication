import { questions } from "./questions.js";

let currentIndex = 0;
const userAnswers = Array(questions.length).fill(null);

const questionText = document.querySelector(".question");
const optionButtons = document.querySelector(".options");
const questionCounter = document.querySelector(".question-counter");
const prevBtn = document.querySelector(
    ".buttons-container button:nth-child(1)",
);
const submitBtn = document.querySelector(
    ".buttons-container button:nth-child(2)",
);
const nextBtn = document.querySelector(
    ".buttons-container button:nth-child(3)",
);
const endBtn = document.querySelector(".footer button");

let score = 0;
let timer;
let timeLeft = 60;

let updateTimerDisplay = () => {
    const timerEl = document.getElementById("timer");
    const min = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const sec = String(timeLeft % 60).padStart(2, "0");
    timerEl.textContent = `${min}:${sec}`;
};

let startTimer = () => {
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft === 0) {
            clearInterval(timer);
            handleSubmit();
        }
    }, 1000);
};

let loadQuestion = (index) => {
    clearInterval(timer);
    timeLeft = 60;
    updateTimerDisplay();
    startTimer();

    const q = questions[index];
    questionText.textContent = q.question;
    questionCounter.textContent = `${q.number} of ${questions.length} Questions`;

    optionButtons.innerHTML = "";
    q.options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.className = "option";
        btn.textContent = opt;

        if (userAnswers[index] === opt) {
            btn.style.backgroundColor = "#d7ecff";
        }

        if (
            userAnswers[index] !== null &&
            typeof userAnswers[index] !== "string"
        ) {
            btn.disabled = true;
            if (opt === q.answer) {
                btn.style.backgroundColor = "#c8f7c5";
            } else if (opt === userAnswers[index].selected) {
                btn.style.backgroundColor = "#f7c5c5";
            }
        }

        btn.addEventListener("click", () => {
            if (
                userAnswers[index] === null ||
                typeof userAnswers[index] === "string"
            ) {
                document.querySelectorAll(".option").forEach((b) => {
                    b.style.backgroundColor = "";
                });
                btn.style.backgroundColor = "#d7ecff";
                userAnswers[index] = opt;
            }
        });

        optionButtons.appendChild(btn);
    });
};

function handleSubmit() {
    const currentQ = questions[currentIndex];
    const selectedOption = userAnswers[currentIndex];

    if (
        selectedOption === null ||
        (typeof selectedOption !== "string" && selectedOption !== null)
    ) {
        return;
    }

    userAnswers[currentIndex] = { selected: selectedOption, submitted: true };

    const options = document.querySelectorAll(".option");
    options.forEach((btn) => {
        btn.disabled = true;
        if (btn.textContent === currentQ.answer) {
            btn.style.backgroundColor = "#c8f7c5";
        } else if (btn.textContent === selectedOption) {
            btn.style.backgroundColor = "#f7c5c5";
        }
    });

    if (selectedOption === currentQ.answer) {
        score++;
    }

    clearInterval(timer);
}

prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        loadQuestion(currentIndex);
    }
});

nextBtn.addEventListener("click", () => {
    if (currentIndex < questions.length - 1) {
        currentIndex++;
        loadQuestion(currentIndex);
    }
});

submitBtn.addEventListener("click", () => {
    handleSubmit();
});

endBtn.addEventListener("click", () => {
    clearInterval(timer);

    document.querySelector(".main").style.display = "none";
    document.querySelector(".footer").style.display = "none";

    let resultsHTML = `<h2>Quiz Results</h2>`;
    resultsHTML += `<p>Your Score: <strong>${score} / ${questions.length}</strong></p>`;
    resultsHTML += `<ol>`;
    questions.forEach((q, i) => {
        const userAns =
            userAnswers[i]?.selected || userAnswers[i] || "No answer";
        const correct = userAns === q.answer;
        resultsHTML += `<li>
      <strong>${q.question}</strong><br>
      Your answer: <span class="user-answer ${
          correct ? "correct" : "incorrect"
      }">${userAns}</span><br>
      Correct answer: <span class="correct">${q.answer}</span>
    </li>`;
    });
    resultsHTML += `</ol>`;

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = resultsHTML;
    resultsDiv.style.display = "block";
});

loadQuestion(currentIndex);
