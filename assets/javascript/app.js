let card = $("#quiz-area");

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

Question.prototype.addQuestion = function(arr, question) {
  arr.push(question);
};

questionBank.push(question1, question2, question3);

class Quiz {
  constructor(correct, incorrect, counter) {
    this.correct = correct;
    this.incorrect = incorrect;
    this.counter = counter;
  }
}

let thisQuiz = new Quiz(0, 0, 120);

Quiz.prototype.countdown = function() {
  this.counter--;
  console.log(this.counter);
  $("#counter-number").html(this.counter);
  if (this.counter === 0) {
    console.log("TIME UP");
    this.done();
  }
};

Quiz.prototype.start = function(arr) {
  timer = setInterval(this.countdown.bind(this), 1000);

  $("#sub-wrapper").prepend(
    `<h2>Time Remaining: <span id="counter-number">${
      this.counter
    }</span> Seconds</h2>`
  );

  $("#start").remove();

  arr.forEach((quizQuestion, index) => {
    const { question, choices } = quizQuestion;
    card.append(`<h2>${question}</h2>`);
    console.log(choices);
    for (choice of choices) {
      card.append(
        `<div class="form-check">
        <input class="form-check-input" name="${index}" type="radio" id="${choice}" value="${choice}">
        <label class="form-check-label" for="${choice}">
        ${choice}
        </label>
      </div>`
      );
    }
  });

  card.append(`<button class="btn btn-danger" id='done'>Done</button>`);
};

Quiz.prototype.done = function() {
  let inputs = $(".form-check").children(".form-check-input:checked");
  for (let i = 0; i < inputs.length; i++) {
    if ($(inputs[i]).val() === questionBank[i].correctAnswer) {
      this.correct++;
    } else {
      this.incorrect++;
    }
  }
  this.result();
};

Quiz.prototype.result = function() {
  clearInterval(timer);

  $("#sub-wrapper h2").remove();

  card.html(`<h2>All Done!</h2>`);
  card.append(`<h3>Correct choices: ${this.correct}</h3>`);
  card.append(`<h3>Incorrect choices: ${this.incorrect}</h3>`);
  card.append(`<button class="btn btn-success" id="start">Start</button>`);
};

$(document).on("click", "#start", function() {
  thisQuiz = new Quiz(0, 0, 120);
  thisQuiz.start(questionBank);
});

$(document).on("click", "#done", function() {
  thisQuiz.done();
});

let quiz = Object.getPrototypeOf(thisQuiz);
console.log(quiz);
