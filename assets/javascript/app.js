//This is all overkill in my opinion but it is a good learning experience.

//declare variable for timer
let timer;
//declare variable for the quiz object
let thisQuiz;

let repeatedQuiz = false
const repeatedQuizIndex = []

//keep track of quiz totals since a new quiz object if being created for each new quiz.
let totalCorrect = 0
let totalIncorrect = 0
let totalQuestionCount = 0

//class for making the question objects, takes in the question, choices, and correctAnswer.
class Question {
  constructor(question, choices, correctAnswer) {
    this.question = question;
    this.choices = choices;
    this.correctAnswer = correctAnswer;
    this.userAnswer = ""
  }
}

//make some question objects with the blueprint
const oop1 = new Question(
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

const oop2 = new Question(
  "What type of inheritence pattern is utilized in JavaScript?",
  ["Prototypal", "Classical", "Trust"],
  "Prototypal"
);

const oop3 = new Question(
  "Which is better? Functional Programming or Object Oriented Programming?",
  [
    "Object Oriented Programming",
    "Functional Programming",
    "Neither, everything has its uses"
  ],
  "Neither, everything has its uses"
);

const trivia1 = new Question(
  "Which group released the hit song, 'Smells Like Teen Spirit'?",
  ["Nirvana", "Backstreet Boys", "The Offspring", "No Doubt"],
  "Nirvana"
);

const trivia2 = new Question(
  "What was Doug's best friend's name?",
  ["Skeeter", "Mark", "Zach", "Cody"],
  "Skeeter"
);

const trivia3 = new Question(
  "What was the name of the principal at Bayside High in Saved By The Bell?",
  ["Mr.Zhou", "Mr.Driggers", "Mr.Belding", "Mr.Page"],
  "Mr.Belding"
);

//declare some question group arrays to use in the addQuestions method
const oopQuiz = [oop1, oop2, oop3]
const triviaQuiz = [trivia1, trivia2, trivia3]
//flatten this array but can't use .flat() bc edge is poop.
const comboQuiz = [oopQuiz, triviaQuiz].reduce((a, b) => a.concat(b), [])

//class blueprint for new Quiz objects, sets correct and incorrect to 0, sets questionsArray and quizQuestionBanks to an empty array 
class Quiz {
  constructor() {
    this.correct = 0;
    this.incorrect = 0;
    this.counter = 0;
    //questionsArray will hold the quiz array for the specific instance of the quiz being generated
    this.questionsArray = []
    //this array holds all the questionBanks as an array of arrays, allowing the quiz to be randomly generated.
    this.quizQuestionBanks = []
  }
}

//method to add questions to any array. Since the exact number of questions for each quiz can be anything the rest parameter is used.
Quiz.prototype.addQuestionBank = function (...questions) {
  //push our array of questionBanks
  this.quizQuestionBanks.push(...questions);
}

Quiz.prototype.setQuestionBank = function () {
  //grab random index based on question bank array
  let randomIndex = Math.floor(Math.random() * this.quizQuestionBanks.length)
  //add randomIndex to repeatedQuizIndex[0]
  repeatedQuizIndex.unshift(randomIndex)
  //if first 2 index numbers do not match set the questionsArray to the quizQuestionBank array at [randomIndex] 
  if (repeatedQuizIndex[0] !== repeatedQuizIndex[1]) {
    repeatedQuiz = false
    this.questionsArray = this.quizQuestionBanks[randomIndex]
  } else {
    repeatedQuiz = true;
    //if true run this method again
    this.setQuestionBank()
  }
  //trim end of array since only the first 2 indexes are needed to check for the same quiz
  if (repeatedQuizIndex.length > 2) {
    repeatedQuizIndex.pop()
  }
  //set counter for 10 seconds per question in array
  this.counter = this.questionsArray.length * 10
}

//method to convert seconds into minutes for the counter
Quiz.prototype.convertTime = function (timeInSeconds) {
  return `${Math.floor(timeInSeconds / 60)}:${(timeInSeconds % 60 < 10 ? "0" : "") + timeInSeconds % 60}`;
}

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
  $("#counter-number").html(this.convertTime(this.counter));
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
      this.convertTime(this.counter)
    }</span></h2>`
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
    <button class="mt-4 btn btn-danger" id="finish">Finish</button>
  </div`);
};

//method to finish quiz. Checks answers accordingly and runs the result method.
Quiz.prototype.finishQuiz = function () {
  for (let i = 0; i < this.questionsArray.length; i++) {
    const {
      correctAnswer,
      userAnswer
    } = this.questionsArray[i];
    if (userAnswer === correctAnswer) {
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
  totalCorrect += this.correct
  totalIncorrect += this.incorrect
  totalQuestionCount += this.questionsArray.length
  totalScore = `${((totalCorrect / totalQuestionCount) * 100).toFixed(2)}%`

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
  <hr>
  <h3>Total Correct: ${totalCorrect}</h3>
  <h3>Total Incorrect: ${totalIncorrect}</h3>
  <h2>Total Score: ${totalScore}</h3>
  <button class="btn btn-success mt-2" id="start">Start</button>
  `);
};

$("#quiz").on("change", ".form-check-input", function () {
  // GET question index out of "name" attribute so we know what question you answered
  const questionIndex = $(this).attr("name");
  // get value out of radio button you selected
  const answer = $(this).val();
  // set answer to question's userAnswer property
  thisQuiz.questionsArray[questionIndex].userAnswer = answer;
});

$(document).on("click", "#start", function () {
  $("#quiz").empty();
  //create newQuiz object
  thisQuiz = new Quiz();
  //add quiz question arrays declared earlier
  thisQuiz.addQuestionBank(oopQuiz, triviaQuiz, comboQuiz)
  //set the questionBank to the new quiz
  thisQuiz.setQuestionBank()
  //start quiz
  thisQuiz.startQuiz();
});

$(document).on("click", "#finish", function () {
  thisQuiz.finishQuiz();
});