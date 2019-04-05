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
    this.done();
  }
};

Quiz.prototype.start = function(arr) {
  timer = setInterval(this.runCounter.bind(this), 1000);

  $("#sub-wrapper").prepend(
    `<h2>Time Remaining: <span id="counter-number">${
      this.counter
    }</span> Seconds</h2>`
  );

  $("#start").remove();

  arr.forEach((quizQuestion, index) => {
    const { question, choices } = quizQuestion;
    card.append(`
      <h2 class="card-header text-primary rounded">${question}</h2>
     `);
    console.log(choices);
    this.randomizeAnswers(choices);
    for (choice of choices) {
      card.append(
        `<div class="form-check form-check-inline">
        <input class="form-check-input" name="${index}" type="radio" id="${choice}" value="${choice}">
        <label class="form-check-label answers" for="${choice}">
        ${choice}
        </label>
      </div>`
      );
    }
  });

  card.append(`
  <div class="row justify-content-center">
    <button class="mt-2 btn btn-danger" id='done'>Done</button>
  </div`);
};

Quiz.prototype.finish = function() {
  let inputs = $(".form-check").children(".form-check-input:checked");
  console.log(inputs);
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

  $("#sub-wrapper h2").remove();
  let score = `${((this.correct / questionBank.length) * 100).toFixed(2)}%`;
  console.log(score);

  card.html(`
  <div class="card">
    <div class="card-header">
      <h2>All Done!</h2>
    </div>
    <div class="card-body">
    </div>
  </div>`);
  $(".card-body").append(`<h3>Correct choices: ${this.correct}</h3>`);
  $(".card-body").append(`<h3>Incorrect choices: ${this.incorrect}</h3>`);
  $(".card-body").append(`<h2>Your Score: ${score}`);
  $(".card-body").append(
    `<button class="btn btn-success" id="start">Start</button>`
  );
};

$(document).on("click", "#start", function() {
  card.empty();
  thisQuiz = new Quiz(180);
  thisQuiz.start(questionBank);
});

$(document).on("click", "#done", function() {
  thisQuiz.finish();
});

// let quiz = Object.getPrototypeOf(thisQuiz);
// console.log(quiz);
