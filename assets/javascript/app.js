let card = $("#quiz-area");

let questions = [];

let timer;

class Question {
  constructor(question, answers, correctAnswer) {
    this.question = question
    this.answers = answers
    this.correctAnswer = correctAnswer
  }
}

const question1 = new Question(
  "Which group released the hit song, 'Smells Like Teen Spirit'?",
  ["Nirvana", "Backstreet Boys", "The Offspring", "No Doubt"],
  "Nirvana")

const question2 = new Question(
  "What was Doug's best friend's name?",
  ["Skeeter", "Mark", "Zach", "Cody"],
  "Skeeter"
)

const question3 = new Question(
  "What was the name of the principal at Bayside High in Saved By The Bell?",
  ["Mr.Zhou", "Mr.Driggers", "Mr.Belding", "Mr.Page"],
  "Mr.Belding"
)

questions.push(question1, question2, question3)

class Quiz {
  constructor(correct, incorrect, counter) {
    this.correct = correct;
    this.incorrect = incorrect;
    this.counter = counter;
  }
}

let thisQuiz = new Quiz(0, 0, 10);

Quiz.prototype.countdown = function () {
  this.counter--;
  console.log(this.counter);
  $("#counter-number").html(this.counter);
  if (this.counter === 0) {
    console.log("TIME UP");
    this.done();
  }
};

Quiz.prototype.start = function () {
  timer = setInterval(this.countdown.bind(this), 1000);

  $("#sub-wrapper").prepend(
    `<h2>Time Remaining: <span id="counter-number">${
      this.counter
    }</span> Seconds</h2>`
  );

  $("#start").remove();

  for (question of questions) {
    card.append(`<h2>${question.question}</h2>`);
    console.log(question.answers)
    for (answer of question.answers) {
      card.append(
        `<div class="form-check">
        <input class="form-check-input" type="radio" id="exampleRadios1" value="${
          answer
        }">
        <label class="form-check-label" for="exampleRadios1">
        ${answer}
        </label>
      </div>`
      );
    }
  }

  card.append(`<button class="btn btn-danger" id='done'>Done</button>`);
};

Quiz.prototype.done = function () {
  let inputs = $(".form-check").children(".form-check-input:checked");
  for (let i = 0; i < inputs.length; i++) {
    if ($(inputs[i]).val() === questions[i].correctAnswer) {
      this.correct++;
    } else {
      this.incorrect++;
    }
  }
  this.result();
};

Quiz.prototype.result = function () {
  clearInterval(timer);

  $("#sub-wrapper h2").remove();

  card.html(`<h2>All Done!</h2>`);
  card.append(`<h3>Correct Answers: ${this.correct}</h3>`);
  card.append(`<h3>Incorrect Answers: ${this.incorrect}</h3>`);
  card.append(`<button class="btn btn-success" id="start">Start</button>`);
};

$(document).on("click", "#start", function () {
  thisQuiz = new Quiz(0, 0, 10);
  thisQuiz.start();
});

$(document).on("click", "#done", function () {
  thisQuiz.done();
});

let quiz = Object.getPrototypeOf(thisQuiz);
console.log(quiz);