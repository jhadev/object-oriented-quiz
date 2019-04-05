//This is all convoluted overkill in my opinion but it is a learning experience.

//declare variable for timer
let timer;
//declare variable for the quiz object
let thisQuiz;

//class for making the question objects, takes in the question, choices, and correctAnswer.
class Question {
  constructor(question, choices, correctAnswer) {
    this.question = question;
    this.choices = choices;
    this.correctAnswer = correctAnswer;
  }
}

//make some question objects with the blueprint
const question1 = new Question(
  "What is not a principle of Object Oriented Programming?",
  [
    "Abstraction",
    "Encapsulation",
    "Inheritence",
    "Polymorphism",
    "Impressionism"
  ],
  "Impressionism"
);

const question2 = new Question(
  "What type of inheritence pattern is utilized in JavaScript?",
  ["Prototypal", "Classical", "Trust"],
  "Prototypal"
);

const question3 = new Question(
  "Which is better? Functional Programming or Object Oriented Programming?",
  [
    "Object Oriented Programming",
    "Functional Programming",
    "Neither, everything has its uses"
  ],
  "Neither, everything has its uses"
);

//class blueprint for new Quiz objects, sets correct and incorrect to 0, sets questionsArray to an empty array and takes in timer value in constructor.
class Quiz {
  constructor(counter) {
    this.correct = 0;
    this.incorrect = 0;
    this.counter = counter;
    this.questionsArray = []
  }
}

//method to add questions to any array. Since the exact number of questions for each quiz can be anything the rest parameter is used.
Quiz.prototype.addQuestions = function (...questions) {
  this.questionsArray.push(...questions);
};

//method to randomize both the questions and answers
Quiz.prototype.randomize = function (arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

//method to run the counter for the timer. Once the counter hits 0 the finishQuiz method is called.
Quiz.prototype.runCounter = function () {
  this.counter--;
  $("#counter-number").html(this.counter);
  if (this.counter === 0) {
    this.finishQuiz();
  }
};

//method to start the quiz takes in an array.
Quiz.prototype.startQuiz = function () {
  //setInterval method called to run the counter method every second. Bind this so it doesn't lose context.
  timer = setInterval(this.runCounter.bind(this), 1000);

  $("#quiz-wrapper").prepend(
    `<h2>Time Remaining: <span id="counter-number">${
      this.counter
    }</span> Seconds</h2>`
  );

  $("#start").remove();
  this.randomize(this.questionsArray);
  this.questionsArray.forEach((quizQuestion, index) => {

    const {
      question,
      choices
    } = quizQuestion;

    $("#quiz").append(`
      <h2 class="card-header text-primary rounded">${question}</h2>
     `);
    this.randomize(choices);
    for (choice of choices) {
      $("#quiz").append(
        `<div class="form-check form-check-inline">
          <input class="form-check-input" name="${index}" type="radio" id="${choice}" value="${choice}">
          <label class="form-check-label answers" for="${choice}">${choice}</label>
        </div>`
      );
    }
  });

  $("#quiz").append(`
  <div class="row justify-content-center">
    <button class="mt-2 btn btn-danger" id="finish">Finish</button>
  </div`);
};

//method to finish quiz. Checks answers accordingly and runs the result method.
Quiz.prototype.finishQuiz = function () {
  let inputs = $(".form-check").children(".form-check-input:checked");
  for (let i = 0; i < inputs.length; i++) {
    const {
      correctAnswer
    } = this.questionsArray[i];
    if ($(inputs[i]).val() === correctAnswer) {
      this.correct++;
    } else {
      this.incorrect++;
    }
  }
  this.result();
};

//method to show the results and clear the timer.
Quiz.prototype.result = function () {
  clearInterval(timer);

  $("#quiz-wrapper h2").remove();

  let score = `${((this.correct / this.questionsArray.length) * 100).toFixed(2)}%`;

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

$(document).on("click", "#start", function () {
  $("#quiz").empty();
  //create newQuiz object
  thisQuiz = new Quiz(30);
  //add quiz questions
  thisQuiz.addQuestions(question1, question2, question3)
  //start quiz
  thisQuiz.startQuiz();
});

$(document).on("click", "#finish", function () {
  thisQuiz.finishQuiz();
});