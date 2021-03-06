import React, { useState, useEffect } from 'react';
import Game from './components/Game';
import axios from 'axios';

const App = () => {
  //initial state for App
  const [state, setState] = useState({
    gameQuestions: [],
    counter: 0,
    questionId: 1,
    question: '',
    answerOptions: [],
    correctAnswer: '',
    answerStatus: null,
    score: 0,
    isLoaded: false,
    gameOver: false,
  });

  useEffect(() => {
    //Async function to load question data
    async function fetchData() {
      let response = await axios.get('https://opentdb.com/api.php?amount=10');
      for (let i = 0; i < response.data.results.length; i++) {
        let shuffledAnswers = [
          ...response.data.results[i].incorrect_answers,
          response.data.results[i].correct_answer,
        ].sort();
        response.data.results[i].answerOptions = shuffledAnswers;
      }

      setState((prevState) => {
        return {
          ...prevState,
          gameQuestions: response.data.results,
          question: response.data.results[0].question,
          answerOptions: response.data.results[0].answerOptions,
          correctAnswer: response.data.results[0].correct_answer,
          gameOver: false,
          isLoaded: true,
        };
      });
    }
    fetchData();
  }, []);

  //function to grab and set next question after user has answered previous one
  const setNextQuestion = () => {
    const nextCount = state.counter + 1;
    const nextQuestionId = state.questionId + 1;

    setState((prevState) => {
      return {
        ...prevState,
        counter: nextCount,
        questionId: nextQuestionId,
        question: state.gameQuestions[nextCount].question,
        answerOptions: state.gameQuestions[nextCount].answerOptions,
        correctAnswer: state.gameQuestions[nextCount].correct_answer,
        answerStatus: null,
      };
    });
    setTimer(30);
  };

  //onClick function to handle answerSelection
  const handleAnswerSelected = (event) => {
    clearTimeout(stopTimer);
    let questionScore = state.score;
    let answerStatus = null;
    //logic to increment score if answer is correct
    //answerStatus is set here to determine which AnswerResult version will be displayed
    if (event.target.value === state.correctAnswer) {
      questionScore += timer;
      answerStatus = 'correct';
    } else {
      answerStatus = 'incorrect';
    }
    setState((prevState) => {
      return {
        ...prevState,
        score: questionScore,
        answerStatus: answerStatus,
      };
    });
    handleAnswerFeedback();
  };

  //setTimeout to display AnswerResult or GameResults
  const handleAnswerFeedback = () => {
    if (state.questionId < 10) {
      setTimeout(() => setNextQuestion(), 3000);
    } else {
      setTimeout(
        () =>
          setState((prevState) => {
            return { ...prevState, gameOver: true };
          }),
        3000
      );
    }
  };

  //initial timer state
  const [timer, setTimer] = useState(30);

  //variable for clearTimeout
  let stopTimer = null;

  //function to start timer
  const startTimer = () => {
    stopTimer = setTimeout(() => setTimer(timer - 1), 1000);
  };

  //starts timer and if time runs out changes answerStatus to render Time Out
  useEffect(() => {
    if (timer > 0) {
      startTimer();
    } else {
      setState((prevState) => {
        return { ...prevState, answerStatus: 'timeOut' };
      });
      handleAnswerFeedback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  if (state.isLoaded) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>tandem trivia</h1>
        </header>
        <Game
          answerOptions={state.answerOptions}
          correctAnswer={state.correctAnswer}
          questionId={state.questionId}
          question={state.question}
          score={state.score}
          answerStatus={state.answerStatus}
          onAnswerSelected={handleAnswerSelected}
          gameOver={state.gameOver}
          timer={timer}
        />
      </div>
    );
  } else {
    return (
      <div className="App">
        <h1 className="highlight-text">Loading...</h1>
      </div>
    );
  }
};

export default App;
