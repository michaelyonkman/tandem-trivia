import React from 'react';
const he = require('he');

const AnswerResults = (props) => {
  if (props.answerStatus) {
    return (
      <div className="answer-results">
        <h2>
          {props.answerStatus === 'correct' ? (
            <span className="highlight-text">Correct!!!</span>
          ) : props.answerStatus === 'incorrect' ? (
            <span className="highlight-text">Wrong!!!</span>
          ) : (
            <span className="highlight-text">Time's up!!!</span>
          )}{' '}
          The correct answer is{' '}
          <span className="highlight-text">
            {he.decode(props.correctAnswer)}
          </span>
          .
        </h2>
      </div>
    );
  } else {
    return null;
  }
};

export default AnswerResults;
