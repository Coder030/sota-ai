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
          setStatus(docSnap.data().completedModules["transp_mult_matr"] || "not started");
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
      let updatedModules = { ...completedModules, ["transp_mult_matr"]: newStatus };

      await updateDoc(docRef, { completedModules: updatedModules });
      setCompletedModules(updatedModules);
      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const quizQuestions = [
  {
    question: "What happens when a matrix is transposed?",
    options: [
      "Its values are squared",
      "The rows become columns and columns become rows",
      "Its elements are reversed",
      "The matrix is multiplied by 2",
    ],
    correctAnswer: "The rows become columns and columns become rows",
  },
  {
    question: "If matrix A is of dimension 2 × 3, what will be the dimensions of Aᵀ (its transpose)?",
    options: [
      "3 × 2",
      "2 × 3",
      "2 × 2",
      "3 × 3",
    ],
    correctAnswer: "3 × 2",
  },
  {
    question: "Matrix multiplication is only possible when:",
    options: [
      "Both matrices are square",
      "The number of rows in A equals the number of rows in B",
      "The number of columns in the first matrix equals the number of rows in the second matrix",
      "Both matrices have equal dimensions",
    ],
    correctAnswer: "The number of columns in the first matrix equals the number of rows in the second matrix",
  },
  {
    question: "Which of the following correctly describes how to compute one element of the product matrix A × B?",
    options: [
      "Add all elements in A and B",
      "Multiply entire rows of A with columns of B and sum the products",
      "Add the diagonals of A and B",
      "Subtract rows of B from A",
    ],
    correctAnswer: "Multiply entire rows of A with columns of B and sum the products",
  },
  {
    question: "Matrix multiplication is not commutative. What does this mean?",
    options: [
      "A × B = B × A always",
      "Matrix multiplication is impossible",
      "Changing the order of multiplication may give different results",
      "You can only multiply square matrices",
    ],
    correctAnswer: "Changing the order of multiplication may give different results",
  },
  {
    question: "Which of the following is a real-world use of matrix multiplication?",
    options: [
      "Counting letters in a sentence",
      "Applying image filters in processing",
      "Generating random numbers",
      "Formatting documents",
    ],
    correctAnswer: "Applying image filters in processing",
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
                      module.id === "transp_mult_matr" ? "text-[#0000ff] font-bold" : ""
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
          <h2 className="text-3xl font-black mb-4 mt-[30px]">Transpose and Multiplication of Matrices</h2>
          <p>Authors: Afsah Buraaq, Kartik Garg</p>
          <br /><br />
          <p className="text-2xl font-bold text-indigo-600">Transpose of a Matrix </p>
          <br />
          <p><u>Raw Idea :</u> Imagine a mirror placed along the diagonal of a matrix. The elements reflect across
it—what was a row becomes a column, and what was a column becomes a row.</p>
<br />
        
<div className="bg-pink-100 p-[20px] rounded-sm">
<b>Formal Defination:</b>
<p>If A is an m × n matrix, then the transpose of A, written as A^T , is the n × m matrix obtained
by switching the rows with columns.</p>
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`A = \\begin{matrix} 1 & 2\\\\ 3 & 4\\\\ 5 & 6 \\end{matrix}`) }} />
<br />
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`A^T = \\begin{matrix} 1 & 3 & 5\\\\ 2 & 4 & 6 \\end{matrix}`) }} />
</div>
<br />
<p><b>NOTE:</b> A row matrix, when transposed, becomes a column matrix, and vice versa.</p>
<br /><br /><hr /><br /><br />
          <h2 className="text-3xl font-black mt-[30px]">Matrix Multiplication</h2>
          <br />
          <p>In this section, we uncover the most important matrix operation of all: matrix multiplication. Unlike scalar multiplication, this is not about changing values—but about combining two
matrices to create something new.</p>
<br />
          <p className="text-2xl font-bold text-indigo-600">When is Matrix Multiplication Possible? </p>
          <br />
          <p>If A is of size m × n and B is of size n × p, then the matrix A * B has the dimensions m × p.
The number of columns in the first matrix must equal the number of rows in the second</p>
<br />
<p><b><u>Dot-Product of Rows and Columns</u></b></p>
<br />
<p><u>Raw Idea :</u> To get one number in the new matrix, take a row from the first matrix and a column from
the second. Multiply their matching parts and add them up.</p>
<br />
<p>Given :</p>
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`A = \\begin{matrix} a_{11} & a_{12} \\end{matrix}`) }} />
<br />
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`B = \\begin{matrix} b_{11} & b_{12}\\\\ b_{21} & b_{22} \\end{matrix}`) }} />
<br />
<p>To perform the multiplication A × B, we first check if the operation is possible. The number of columns in matrix A (which is 2) must be equal to the number of rows in matrix B (which is 2). Since 2=2, the multiplication is possible.</p>
<br />
<p>The resulting matrix, let's call it C, will have dimensions (number of rows in A) × (number of columns in B), which is 1 × 2 .</p>
<br />
<p className="mb-[10px]">To find each element of the resulting matrix C:</p>
<ul className="ml-[30px]" style={{listStyleType: "disc"}}>
  <li>
    The element in the first row and first column of C, denoted as c_11, is calculated by taking the dot product of the first row of A and the first column of B:
    <div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`c_{11} = (a_{11} * b_{11}) + ({a_{12} * b_{21}})`) }} />
  </li>
  <br />
  <li>
    The element in the first row and second column of C, denoted as c_{12}, is calculated by taking the dot product of the first row of A and the second column of B:
    <div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`c_{12} = (a_{11} * b_{12}) + ({a_{12} * b_{22}})`) }} />
  </li>
</ul>
<br />
<p>Therefore, the product A × B is:</p>
<br />
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`A * B = [\\begin{matrix} (a_{11} * b_{11} + a_{12} * b_{21}) & (a_{11} * b_{12} + a_{12} * b_{22})\\end{matrix}]`) }} />

<br /><br /><hr /><br /><br />
<b>Example : </b>
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`A = \\begin{matrix} 1 & 2 \\\\ 3 & 4 \\end{matrix}`) }} />
<br />
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`B = \\begin{matrix} 5 & 6\\\\ 7 & 8 \\end{matrix}`) }} />
<br />
<p>Then :</p>
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`A * B = \\begin{matrix} 1 * 5 + 2 * 7 & 1 * 6 + 2 * 8 \\\\ 3 * 5 + 4 * 7 & 3 * 6 + 4 * 8 \\end{matrix} = \\begin{matrix} 19 & 22 \\\\ 43 & 50 \\end{matrix}`) }} />
<br /><br /><hr /><br /><br />
          <p className="text-xl"><b>NOTE:</b> Matrix Multiplication is not commutative in general. The order of multiplication matters. </p>
<br /><br /><hr /><br /><br />
          <p className="text-2xl font-bold text-indigo-600">Real-World Example: Data Transformation </p>
          <br />
          <p>Let’s say you have a data matrix where rows are students and columns are subjects. You can
multiply it by a matrix that transforms or combines subjects—say, to get an overall score or
rating.</p>
<br />
<p>Some more uses of multiplication in matrices are : </p>
<br />
<ul className="ml-[30px]" style={{listStyleType:"disc"}}>
  <li><b>Apply filters in image processing :</b> Matrix multiplication helps enhance images by applying transformations such as sharpening, blurring, and edge detection through convolution operations.</li>
  <br />
  <li><b>Combine features in data :</b> It enables the fusion of multiple data attributes, allowing efficient representation and transformation, crucial in areas like recommendation systems and predictive modeling.</li>
  <br />
  <li><b>Performing weighted sums in neural networks :</b> We will study this in a later module. </li>
</ul>
<br /><br />






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
            <h2 className="text-3xl font-black mb-6 text-center">Test Your Knowledge: Transpose and Multiplication of Matrices</h2>

            {!quizStarted && !quizResults && (
              <div className="text-center">
                <p className="text-lg mb-6">Ready to test your understanding of Matrices?</p>
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