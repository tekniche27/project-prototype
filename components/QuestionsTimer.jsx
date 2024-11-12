"use client";
import { useState, useEffect } from "react";

const QuestionTimer = ({ onTimeUp, setTimePerQuestion, isAnswered, resetTimer }) => {
  const [seconds, setSeconds] = useState(setTimePerQuestion); // set the timer for each question

  useEffect(() => {
    if (!isAnswered && seconds > 0) {
      const timer = setTimeout(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (seconds === 0 && !isAnswered) {
      onTimeUp();
    }
  }, [seconds, isAnswered]);

  // Reset the timer whenever a new question is loaded
  useEffect(() => {
    setSeconds(setTimePerQuestion); // Reset the timer to 10 seconds
  }, [resetTimer]); // `resetTimer` is a prop that changes when a new question is loaded

  return <div className="text-xs md:text-sm lg:text-lg xl:text-lg 2xl:text-lg">Time Left: {seconds}s</div>;
};

export default QuestionTimer;