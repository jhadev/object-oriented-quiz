let questionBank = [];

let timer;

class Question {
  constructor(question, choices, correctAnswer) {
    this.question = question;
    this.choices = choices;
    this.correctAnswer = correctAnswer;
  }
}

const question1 = new Question(
  "Which group released the hit song, 'Smells Like Teen Spirit'?",
  ["Nirvana", "Backstreet Boys", "The Offspring", "No Doubt"],
  "Nirvana"
);

const question2 = new Question(
  "What was Doug's best friend's name?",
  ["Skeeter", "Mark", "Zach", "Cody"],
  "Skeeter"
);

const question3 = new Question(
  "What was the name of the principal at Bayside High in Saved By The Bell?",
  ["Mr.Zhou", "Mr.Driggers", "Mr.Belding", "Mr.Page"],
  "Mr.Belding"
);

// Question.prototype.addQuestion = function(arr, question) {
//   arr.push(question);
// };

questionBank.push(question1, question2, question3);

class Quiz {
  constructor(counter) {
    this.correct = 0;
    this.incorrect = 0;
    this.counter = counter;
  }
}

let thisQuiz;

Quiz.prototype.randomizeAnswers = function(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

Quiz.prototype.runCounter = function() {
  this.counter--;
  $("#counter-number").html(this.counter);
  if (this.counter === 0) {
    this.finishQuiz();
  }
};

Quiz.prototype.startQuiz = function(arr) {
  timer = setInterval(this.runCounter.bind(this), 1000);

  $("#quiz-wrapper").prepend(
    `<h2>Time Remaining: <span id="counter-number">${
      this.counter
    }</span> Seconds</h2>`
  );

  $("#start").remove();

  arr.forEach((quizQuestion, index) => {
    const { question, choices } = quizQuestion;
    $("#quiz").append(`
      <h2 class="card-header text-primary rounded">${question}</h2>
     `);
    this.randomizeAnswers(choices);
    for (choice of choices) {
      $("#quiz").append(
        `<div class="form-check form-check-inline">
        <input class="form-check-input" name="${index}" type="radio" id="${choice}" value="${choice}">
        <label class="form-check-label answers" for="${choice}">
        ${choice}
        </label>
      </div>`
      );
    }
  });

  $("#quiz").append(`
  <div class="row justify-content-center">
    <button class="mt-2 btn btn-danger" id='done'>Done</button>
  </div`);
};

Quiz.prototype.finishQuiz = function() {
  let inputs = $(".form-check").children(".form-check-input:checked");
  for (let i = 0; i < inputs.length; i++) {
    const { correctAnswer } = questionBank[i];
    if ($(inputs[i]).val() === correctAnswer) {
      this.correct++;
    } else {
      this.incorrect++;
    }
  }
  this.result();
};

Quiz.prototype.result = function() {
  clearInterval(timer);

  $("#quiz-wrapper h2").remove();
  let score = `${((this.correct / questionBank.length) * 100).toFixed(2)}%`;

  $("#quiz").html(`
  <div class="card">
    <div class="card-header">
      <h2>Finished</h2>
    </div>
    <div class="card-body">
    </div>
  </div>`);
  $(".card-body").append(`
  <h3>Correct: ${this.correct}</h3>
  <h3>Incorrect: ${this.incorrect}</h3>
  <h2>Your Score: ${score}</h2>
  <button class="btn btn-success" id="start">Start</button>
  `);
};

$(document).on("click", "#start", function() {
  $("#quiz").empty();
  thisQuiz = new Quiz(180);
  thisQuiz.startQuiz(questionBank);
});

$(document).on("click", "#done", function() {
  thisQuiz.finishQuiz();
});

// let quiz = Object.getPrototypeOf(thisQuiz);
// console.log(quiz);
