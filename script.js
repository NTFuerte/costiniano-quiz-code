
window.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-button");
  if (startButton) {
    startButton.addEventListener("click", () => {
      document.getElementById("start-page").style.display = "none";
      document.getElementById("quiz-area").style.display = "block";
      showAgeSelection();
    });
  }
});
// ----------------------------
// Quiz data
// ----------------------------
const questions = [
  { video: "https://www.youtube.com/embed/PHqbESeLHIs", text: "Which video is an AI Deepfake?", correct: "Video 2" },
  { video: "https://www.youtube.com/embed/H43HlJJ9Gbs", text: "Which video is an AI Deepfake?", correct: "Video 2" },
  { video: "https://www.youtube.com/embed/xGkNU3uwfq0", text: "Which video is an AI Deepfake?", correct: "Video 1" },
  { video: "https://www.youtube.com/embed/fpcwKJgKG54", text: "Which video is an AI Deepfake?", correct: "Video 2" },
  { video: "https://www.youtube.com/embed/8mM_BbYcGNc", text: "Which video is an AI Deepfake?", correct: "Video 2" },
  { video: "https://www.youtube.com/embed/5OdHD85dkfg", text: "Which video is an AI Deepfake?", correct: "Video 1" },
  { video: "https://www.youtube.com/embed/Aj21mrNOeEk", text: "Which video is an AI Deepfake?", correct: "Video 2" },
  { video: "https://www.youtube.com/embed/lXLbWjUV8sE", text: "Which video is an AI Deepfake?", correct: "Video 1" },
  { video: "https://www.youtube.com/embed/fSI6BG3oY6c", text: "Which video is an AI Deepfake?", correct: "Video 2" },
  { video: "https://www.youtube.com/embed/yffYnQe_JE4", text: "Which video is an AI Deepfake?", correct: "Video 2" },
  { video: "https://www.youtube.com/embed/DbhkcwJCBDs", text: "Which video is an AI Deepfake?", correct: "Video 1" },
  { video: "https://www.youtube.com/embed/tXiM7N0yVNA", text: "Which video is an AI Deepfake?", correct: "Video 2" },
  { video: "https://www.youtube.com/embed/3lOa_x_WDQw", text: "Which video is an AI Deepfake?", correct: "Video 1" },
  { video: "https://www.youtube.com/embed/Y4pd98sA3RI", text: "Which video is an AI Deepfake?", correct: "Video 1" },
  { video: "https://www.youtube.com/embed/Vi87Q3SYjtw", text: "Which video is an AI Deepfake?", correct: "Video 2" }
];

// ----------------------------
// Quiz state
// ----------------------------
let currentQuestion = 0;
let respondentAge = "";
let respondentGeneration = "";
let score = 0;

// ----------------------------
// Functions
// ----------------------------
function showAgeSelection() {
  document.getElementById("question-area").innerHTML = `
    <h2>Please select your age range:</h2>
    <hr>
    <div class="choices age-section">
      <div class="choice-block">
        <button class="age" onclick="setAge('13-28','Gen Z')">13–28</button>
      </div>
      <div class="choice-block">
        <button class="age" onclick="setAge('29-44','Gen Y (Millennials)')">29–44</button>
      </div>
      <div class="choice-block">
        <button class="age" onclick="setAge('45-60','Gen X')">45–60</button>
      </div>
      <div class="choice-block">
        <button class="age" onclick="setAge('61-79','Baby Boomers')">61–79</button>
      </div>
    </div>
  `;
}

function updateProgress() {
    document.getElementById("progress").innerText =
        `Question ${currentQuestion + 1} of ${questions.length}`;
}

function setAge(ageRange, generation) {
  respondentAge = ageRange;
  respondentGeneration = generation;
  setTimeout(loadQuestion, 800);
}

function answer(choice) {
  document.querySelectorAll(".choices button").forEach(btn => btn.disabled = true);

  let correctAnswer = questions[currentQuestion].correct;
  let isCorrect = (choice === correctAnswer);

  if (isCorrect) {
    score++;
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion();
    } else {
      // ✅ Only send data once, after quiz is finished
      fetch("https://script.google.com/macros/s/AKfycbyH_ffPIsJ8yMJpewsRhCGHP2MqcFQX57KCQWc4GC6zesWlh5di3FQVVD_O-uRSnI1BOA/exec", {
        method: "POST",
        body: JSON.stringify({
          generation: respondentGeneration,
          summary: `${score}/${questions.length}`   // Final score only
        })
      })
      .then(res => res.text())
      .then(text => {
        console.log("Submitted to Google Sheet:", text);
      })
      .catch(err => {
        console.error("Error submitting:", err);
      });

      // Show results
      document.getElementById("question-area").innerHTML = `
        <h2>Quiz Complete!</h2>
        <p class="justified">You got ${score} out of ${questions.length} correct.</p>
        <p class="justified">All videos seen in this test are collected from Synthesia.io on YouTube. Thank you for accomplishing the AI Deepfake Detection Quiz!</p>
      `;
    }
  }, 800);
}

function loadQuestion() {
  updateProgress();

  document.getElementById("question-area").innerHTML = `
    <h2>${questions[currentQuestion].text}</h2>
    <iframe src="${questions[currentQuestion].video}" frameborder="0" allowfullscreen></iframe>
    <div class="choices video-section">
      <button class="video1" onclick="answer('Video 1')">Video 1</button>
      <button class="video2" onclick="answer('Video 2')">Video 2</button>
    </div>
  `;

  // Re-enable buttons
  document.querySelectorAll(".choices button").forEach(btn => btn.disabled = false);

  // Clear previous answer feedback
  document.getElementById("answer-result").innerText = "";
}
