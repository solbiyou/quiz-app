// import Question from "./Question.js";
import Question from "./Question.js";
import Quiz from "./Quiz.js";

// // const q1 = new Question("what's 1+1?", [2, 3, 7], 0);
// const q1 = new Question("2+2?", [2,3,4,5], 2);
// const q2 = new Question("my fav artist", ['iu', 'jason', 'map'], 0);
// // const q3 = new Question();
// // const q4 = new Question();
// // const q5 = new Question();

// const qArray  = [q1, q2];

// const myQuiz = new Quiz(qArray);
// console.log(myQuiz.getCurrentQeustion());

// myQuiz.nextIndex();
// console.log(myQuiz.getCurrentQeustion());

const App = (() => {
  //cache the DOM
  const quizEl = document.querySelector(".quiz");
  const quizQuestionEl = document.querySelector(".quiz__question");
  const trackerEl = document.querySelector(".quiz__tracker");
  const taglineEl = document.querySelector(".quiz__tagline");
  const choicesEl = document.querySelector(".quiz__choices");
  const progressInnerEl = document.querySelector(".progress__inner");
  const nextButton = document.querySelector(".next");
  const restartButton = document.querySelector(".restart")
  
  const q1 = new Question("Where am I from?", ['South Korea', 'North Korea', 'USA', 'Japan'], 0);
  const q2 = new Question("I went to high school in ... ", ['China', 'USA', 'South Korea', 'Australia'], 3);
  const q3 = new Question("What is the instrument that I can't play? ", ['piano', 'guitar', 'clarinet', 'drums'], 2);
  const q4 = new Question("What is my favorite programming language?", ['C/C++', 'Java', 'Python', 'JavaScript'], 3);
  const q5 = new Question("Do you like me?", ['Yes!' , 'No...'], 0);

  const quiz = new Quiz([q1, q2, q3, q4, q5]);
  // console.log(quiz);


  const listeners = _ => {
    nextButton.addEventListener('click', () => {
      const selectedRadioElem = document.querySelector('input[name="choice"]:checked'); //imporatant
      if(selectedRadioElem) {
        const key = Number(selectedRadioElem.getAttribute('data-order'));
        quiz.guess(key);
        renderAll();
      }
      
    })

    restartButton.addEventListener('click', () => {
      //1. reset the quiz
      quiz.reset();
      //2. renderAll again
      renderAll();
      //3. restore the next button
      nextButton.style.display = 'block';
      choicesEl.style.display = 'flex';
    })
  }

  const setValue = (elem, value) => {
    elem.innerHTML = value;
  }


  const renderQeustion = _ => {
    const question = quiz.getCurrentQuestion().question;
    setValue(quizQuestionEl, question);
  }


  const renderChoicesElment = _ => {
    let markup = "";
    const currentChoices = quiz.getCurrentQuestion().choices;
    currentChoices.forEach((elem, index) => { //data attribute is custom attribute that we can create
      markup += `            
        <li class="quiz__choice">
          <input type="radio" name="choice" class="quiz__input" data-order="${index}" id="choice${index}"> 
          <label for="choice${index}" class="quiz__label">
            <i></i>
            <span>${elem}<span>
          </label>
        </li>
      `
    })
    setValue(choicesEl, markup);
  }

  const renderTracker = _ => {
    let index = quiz.currentIndex;
    setValue(trackerEl, `${index+1} of ${quiz.questions.length}`);
  }


  const getPercentage = (num1, num2) => {
    return Math.floor((num1/num2) * 100);
  }
  const launch = (width, maxPercent) => {
    let loadingBar = setInterval(function() {
      if (width > maxPercent) {
        clearInterval(loadingBar);
      } else {
        width++;
        progressInnerEl.style.width = `${width}%`;
      }
    }, 3)
  }
  // launch(0,40);
  const renderProgress = _ => {
    //1. width
    let curretnWidth = getPercentage(quiz.currentIndex, quiz.questions.length);
    //2. launch(0, width);
    launch(0, curretnWidth);
  }
  const renderEndScreen = _ => {
    setValue(quizQuestionEl, `Great Job!`);
    setValue(taglineEl, `Complete!`);
    setValue(trackerEl, `Your score: ${getPercentage(quiz.score, quiz.questions.length)}%`);
    launch(0,100);
    nextButton.style.display = 'none';
    choicesEl.style.display = 'none';

  }
  const renderAll = _ => {
    if (quiz.hasEnded()) {
      //render the End screen
      renderEndScreen();
    } else {
      // 1. render the question
      renderQeustion();
      // 2. render the choices elements
      renderChoicesElment();
      // 3. render the Tracker
      renderTracker();
      // 4. render Progress
      renderProgress();
    }

  }
  return {
    renderAll: renderAll,
    listeners: listeners
  }
})();

App.renderAll();
App.listeners();