"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { db, auth, doc, getDoc, updateDoc, onAuthStateChanged } from "../firebase";
import { useRouter } from "next/navigation";
import Select from 'react-select'
import Image from "next/image";
import 'katex/dist/katex.min.css';
import { renderToString } from 'katex';
import { TiTick } from "react-icons/ti";
import { mathCategories } from "../mathCategories";


import Confetti from 'react-confetti-boom';


const Grad_Desc = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [completedModules, setCompletedModules] = useState({});
  const [status, setStatus] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizResults, setQuizResults] = useState(null); // null, 'passed', 'failed'
  const [score, setScore] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);

      if (authUser) {
        const docRef = doc(db, "users", authUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCompletedModules(docSnap.data().completedModules || {});
          setStatus(docSnap.data().completedModules["intro_matrs"] || "not started");
        } else {
          await setDoc(docRef, { completedModules: {} });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const updateModuleStatus = async (newStatus) => {
    if (!user) return;

    try {
      const docRef = doc(db, "users", user.uid);
      let updatedModules = { ...completedModules, ["intro_matrs"]: newStatus };

      await updateDoc(docRef, { completedModules: updatedModules });
      setCompletedModules(updatedModules);
      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const quizQuestions = [
    {
      question: "What is the primary goal of gradient descent in machine learning?",
      options: [
        "To increase the model's error",
        "To minimize the loss function",
        "To randomly adjust model parameters",
        "To visualize data distributions",
      ],
      correctAnswer: "To minimize the loss function",
    },
    {
      question: "In the context of gradient descent, what does a 'gradient' represent?",
      options: [
        "The magnitude of the loss function",
        "A vector pointing in the direction of steepest increase in loss",
        "The learning rate",
        "The current value of the weights",
      ],
      correctAnswer: "A vector pointing in the direction of steepest increase in loss",
    },
    {
      question: "What is the purpose of the 'learning rate' (α) in the gradient descent update formula?",
      options: [
        "It determines the initial value of the weights",
        "It controls how large a step is taken during each update",
        "It represents the total number of iterations",
        "It defines the type of loss function used",
      ],
      correctAnswer: "It controls how large a step is taken during each update",
    },
    {
      question: "If the gradient at a point is positive, what does it mean for the loss function if you move in that direction?",
      options: [
        "The loss will decrease",
        "The loss will increase",
        "The loss will remain constant",
        "It cannot be determined",
      ],
      correctAnswer: "The loss will increase",
    },
    {
      question: "Which of the following best describes 'weights' in a machine learning model?",
      options: [
        "Fixed values that never change",
        "Parameters that control how much influence each input has on the prediction",
        "The output of the model's predictions",
        "A measure of the model's accuracy",
      ],
      correctAnswer: "Parameters that control how much influence each input has on the prediction",
    },
  ];

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizResults(null);
    setScore(0);
  };

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    setSelectedAnswer(null); // Clear selected answer for the next question

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz finished
      const minPassingScore = Math.ceil(quizQuestions.length * 0.8); // 80% to pass
      if (score + (selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer ? 1 : 0) >= minPassingScore) {
        setQuizResults("passed");
        updateModuleStatus("completed"); // Automatically mark as completed if passed
      } else {
        setQuizResults("failed");
      }
    }
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <>
      <Navbar />

      <div className="min-h-screen text-gray-800 flex">
        {/* Sidebar Navigation */}
        <div className="w-[350px] fixed top-0 left-0 h-screen overflow-y-auto bg-white shadow-md p-4 z-10">
          <p className="text-[24px] mb-[20px] font-bold text-center">Mathematical Prerequisites</p>
          <hr />
          <div className="mt-[30px]"></div>
          {mathCategories.map((category) => (
            <div key={category.title} className="border-b mb-4">
              <h4 className="text-lg font-semibold mb-2">{category.title}</h4>
              <ul className="list-none pl-2">
                {category.modules.map((module) => (
                  <li
                    key={module.id}
                    className={`cursor-pointer p-2 hover:text-[#0000ff] rounded mb-2 ${
                      module.id === "intro_matrs" ? "text-[#0000ff] font-bold" : ""
                    }`}
                    onClick={() => router.push(`/${module.id}`)}
                  >
                    {module.title}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Module Content */}
        <div className="flex-grow p-6 ml-[400px] text-lg">
          <h2 className="text-3xl font-black mb-4 mt-[30px]">Introduction to Matrices</h2>
          <p>Authors: Afsah Buraaq, Kartik Garg</p>
          <br /><br />
          <p className="text-2xl font-bold underline">Understanding the Structure and Dimensions of a Matrix: </p>
          <br />
          <p className="text-xl font-bold">What is a Matrix?</p>
          <br />
          <p>A matrix is a rectangular arrangement of objects—most often numbers—placed in rows and
columns. Think of it like a neatly organized table where each box holds a value. These values
are called the <b>elements</b> of the matrix.</p>
<br />
<p>We write a matrix by placing its elements inside large square brackets. The order of the
numbers tells us how they are arranged: first by row; then by column.</p>

<br />
<div className="bg-pink-100 p-[20px] rounded-sm">
<b>Formal Defination:</b>
<p>A matrix is a rectangular array of values arranged in horizontal rows and vertical columns.
Each value is called an element. A matrix is usually enclosed in brackets and may contain
numbers, symbols, or expressions.</p>
<br />
<p><b>Dimensions of a matrix</b> = Number of rows × Number of columns</p>

</div>
<br />
<p>Each element in a matrix is identified by its position: the row it is in and the column it is in.
For example, the element in the 2nd row and 3rd column is denoted as a2,3.</p>
<p>Let’s see an example matrix:</p>
<br />
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`[\\begin{matrix} 1 & 3 & 5\\\\ 7 & 9 & 11 \\end{matrix}]`) }} />
<br />
<p>Here:</p>
<p>• Matrix A has 2 rows and 3 columns</p>
<p>
• The element a1,2 = 3; this means the value in row 1, column 2 is 3</p>
<p>• The element a2,3 = 11</p>

<br /><br /> <hr /><br /><br />
<div className="bg-pink-100 p-[20px] rounded-sm">
<b>Question 1: What is the dimension of the matrix below?</b>
<br /><br />
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`E = [\\begin{matrix} 2 & 4\\\\6 & 8\\\\10 & 12 \\end{matrix}]`) }} />
<div className="ml-[20px]">
<p>A) 3 × 2</p>
<p>B) 2 × 3</p>
<p>C) 2 × 2</p>
<p>D) 3 × 3</p>

</div>
<br />
<hr />
<br />
<p><b>Answer :</b> A)</p>
</div>
<br />
<div className="bg-pink-100 p-[20px] rounded-sm">
<b>Q2. What is the element a2,1 in matrix A</b>
<br /><br />
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`E = [\\begin{matrix} 1 & 0 & -1\\\\4 & 2 & 5\\end{matrix}]`) }} />
<br />
<hr />
<br />
<p><b>Answer :</b> 4</p>
</div>
<br /><br /><br />
<hr/>
<br /><br /><br />

{/* <p className="text-2xl font-bold underline">Types of Matrices: </p>
<br />
<p className="text-2xl font-bold">Row Matrix</p>
<br />
<p><b><u>Raw Idea</u></b>: A row matrix is like a single shelf with boxes arranged left to right. All the data is in a
single horizontal line.</p>
<br />
<div className="bg-pink-100 p-[20px] rounded-sm">
<b>Formal Defination:</b>
<p>A row matrix is a matrix that has only one row and one or more columns. It is of order
1 × n.</p>
</div>
<br />
<p>Eg. </p>
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`E = [\\begin{matrix} 1 & 2 & 3 & 4\\end{matrix}]`) }} />
<br /><br /><hr /><br /><br />
<p className="text-2xl font-bold">Column Matrix</p>
<br />
<p><b><u>Raw Idea</u></b>: Think of a column matrix as a vertical stack—like books on a tower—one on top of the
other.</p>
<br />
<div className="bg-pink-100 p-[20px] rounded-sm">
<b>Formal Defination:</b>
<p>A column matrix is a matrix that has only one column and one or more rows. It is of order m × 1.</p>
</div>
<br />
<p>Eg. </p>
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`E = \\begin{matrix} 2 \\\\ 4 \\\\ 6 \\end{matrix}`) }} />
<br /><br /><hr /><br /><br />
<p className="text-2xl font-bold">Square Matrix</p>
<br />
<p><b><u>Raw Idea</u></b>: A square matrix is like a perfect chessboard—same number of rows and columns.</p>
<br />
<div className="bg-pink-100 p-[20px] rounded-sm">
<b>Formal Defination:</b>
<p>A square matrix is a matrix that has the same number of rows and columns. That is, it is of
order n × n.</p>
</div>
<br />
<p>Eg. </p>
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`E = \\begin{matrix} 2 \\\\ 4 \\\\ 6 \\end{matrix}`) }} /> */}
<p className="text-2xl font-bold underline">Matrix Notation and Indexing </p>
<br />
<div className="flex items-center">
<p className="mr-[10px]">The element at first row and second column in a matrix can be written in 2 ways. First way is : </p>
<div className="text-[20px]" dangerouslySetInnerHTML={{ __html: renderToString(`a_{1,2}`) }} />
</div>
<p>And the second way is : A[1][2]</p>
<br />
<p>The general rule is - First row, then column</p>
<br />
<b>Common Confusion: 1-Based vs 0-Based Indexing</b>
<br /><br />
<div className="bg-pink-100 p-[20px] rounded-sm">
<b>Formal Explanation:</b>

<ul style={{listStyleType:"disc"}} className="ml-[20px]">
<li><div className="flex items-center gap-1">
<p>In mathematics, indexing starts from 1. So the top-left element is </p><div className="text-[20px]" dangerouslySetInnerHTML={{ __html: renderToString(`a_{1,1}`) }} />
</div></li>
<li><p>In programming languages like Python, indexing starts from 0. So the top-left element is A[0][0].</p></li>
</ul>
</div>





          <hr />
          <div className="flex justify-center items-center mt-[70px] mb-[80px]">
            <div className="flex items-center justify-center">
              <label className="font-semibold text-gray-700 mr-[10px] text-[30px]">Module Progress :</label>

              <Select
                options={[
                  { value: "not started", label: "Not Started" },
                  { value: "completed", label: "Completed" },
                  { value: "skipped", label: "Skipped" },
                ]}
                onChange={(value) => updateModuleStatus(value.value)}
                className="w-[200px]"
                menuPlacement="top"
                value={{ value: status, label: status.charAt(0).toUpperCase() + status.slice(1) }} // Set selected value
              />

              {/* Move TiTick inside the same flex container */}
              {status == "completed" && <TiTick size={"3em"} className="ml-[15px] text-green-600" />}
            </div>
          </div>

          {/* Interactive Quiz Section */}
          <hr />
          <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-black mb-6 text-center">Test Your Knowledge: Gradients & Gradient Descent</h2>

            {!quizStarted && !quizResults && (
              <div className="text-center">
                <p className="text-lg mb-6">Ready to test your understanding of Gradients and Gradient Descent?</p>
                <button
                  onClick={handleStartQuiz}
                  className="bg-[#0000ff] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#0000cc] transition-colors duration-300"
                >
                  Start Quiz
                </button>
              </div>
            )}

            {quizStarted && !quizResults && (
              <div className="quiz-container">
                <p className="text-xl font-semibold mb-4">
                  Question {currentQuestionIndex + 1} of {quizQuestions.length}
                </p>
                <p className="text-lg mb-6">{currentQuestion.question}</p>
                <div className="options-container grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      className={`block w-full text-left p-4 border rounded-lg transition-colors duration-200 
                                  ${selectedAnswer === option ? "bg-[#e0e7ff] border-[#0000ff]" : "bg-gray-50 hover:bg-gray-100 border-gray-200"}`}
                      onClick={() => handleAnswerSelection(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null}
                    className={`px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-300 
                                ${selectedAnswer === null ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-[#0000ff] text-white hover:bg-[#0000cc]"}`}
                  >
                    {currentQuestionIndex === quizQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
                  </button>
                </div>
              </div>
            )}

            {quizResults && (
              <div className="quiz-results text-center">
                <h3 className="text-2xl font-bold mb-4">Quiz Complete!</h3>
                {quizResults === "passed" ? (
                  <>
                    <p className="text-green-600 text-xl font-semibold mb-2">Congratulations! You passed!</p>
                    <p className="text-lg">Your score: {score} out of {quizQuestions.length}</p>
                    <TiTick size={"3em"} className="mx-auto mt-4 text-green-600" />
                  </>
                ) : (
                  <>
                    <p className="text-red-600 text-xl font-semibold mb-2">Keep practicing! You can do it!</p>
                    <p className="text-lg">Your score: {score} out of {quizQuestions.length}</p>
                    <p className="text-md mt-2">You need to score {Math.ceil(quizQuestions.length * 0.8)} or more to pass.</p>
                  </>
                )}
                <button
                  onClick={handleStartQuiz}
                  className="mt-8 bg-[#0000ff] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#0000cc] transition-colors duration-300"
                >
                  Retake Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Grad_Desc;