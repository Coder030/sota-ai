"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { db, auth, doc, getDoc, updateDoc, onAuthStateChanged } from "../firebase";
import { useRouter } from "next/navigation";
import Select from 'react-select';
import img1 from "./img1.png";
import Image from "next/image";
import 'katex/dist/katex.min.css';
import { renderToString } from 'katex';
import { TiTick } from "react-icons/ti";
import Confetti from 'react-confetti-boom';
import { mathCategories } from "../mathCategories";

import "./style.css";


const DiffCalcPage = () => {
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
          setStatus(docSnap.data().completedModules["diff_calc_part_deriv"] || "not started");
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
      let updatedModules = { ...completedModules, ["diff_calc_part_deriv"]: newStatus };

      await updateDoc(docRef, { completedModules: updatedModules });
      setCompletedModules(updatedModules);
      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const differentiationRules = [
    { rule: 'Multiplication by constant', function: 'c \\times f(x)', derivative: "c \\times \\frac{d}{dx}f(x)" },
    { rule: 'Power Rule', function: 'f(x^n)', derivative: "n \\times (x^{n-1})" },
    { rule: 'Sum Rule', function: 'f(x) + g(x)', derivative: "\\frac{d}{dx}f(x) + \\frac{d}{dx}g(x)" },
    { rule: 'Difference Rule', function: 'f(x) - g(x)', derivative: "\\frac{d}{dx}f(x) - \\frac{d}{dx}g(x)" },
    { rule: 'Product Rule', function: 'f(x) \\times g(x)', derivative: "f \\times \\frac{d}{dx}g(x)  +\\frac{d}{dx}f(x) \\times g(x)" },
    { rule: 'Quotient Rule', function: '\\frac{f(x)}{g(x)}', derivative: "\\frac{\\frac{d}{dx}f(x) \\times g(x) - f \\times \\frac{d}{dx}g(x)}{g^2}" },
    { rule: 'Reciprocal Rule', function: '\\frac{1}{f(x)}', derivative: "\\frac{-\\frac{d}{dx}f(x)}{ f^2}" },
    { rule: 'Chain Rule', function: '\\frac{dy}{dx}', derivative: "\\frac{dy}{du} \\times \\frac{du}{dx}" },
  ];

  const quizQuestions = [
    {
      question: "What does the derivative of a function represent graphically?",
      options: [
        "The area under the curve",
        "The y-intercept of the function",
        "The slope of the tangent to the function at a particular point",
        "The maximum value of the function",
      ],
      correctAnswer: "The slope of the tangent to the function at a particular point",
    },
    {
      question: "Which of the following rules is defined as: d / dx * f(x) + d / dx * g(x) for functions f(x) and g(x)?",
      options: [
        "Power Rule",
        "Product Rule",
        "Sum Rule",
        "Chain Rule",
      ],
      correctAnswer: "Sum Rule",
    },
    {
      question: "What is the primary concept behind a partial derivative?",
      options: [
        "Measuring the change of a single-variable function",
        "Finding the total change of a multivariable function",
        "Measuring how a multivariable function changes when only one variable changes (others held constant)",
        "Calculating the integral of a function",
      ],
      correctAnswer: "Measuring how a multivariable function changes when only one variable changes (others held constant)",
    },
    {
      question: "If f(x, y) = 5x^3 + 2y^2, what is the partial derivative with respect to x?",
      options: [
        "15x^2",
        "4y",
        "15x^2 + 4y",
        "5x^3",
      ],
      correctAnswer: "15x^2",
    },
    {
      question: "When would the Chain Rule be most useful in the context of Neural Networks?",
      options: [
        "When calculating the average of outputs",
        "When finding the global minimum of a simple function",
        "When reading about backpropagation",
        "When visualizing data distributions",
      ],
      correctAnswer: "When reading about backpropagation",
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
      {quizResults === "passed" && <Confetti mode="boom" x={0.5} y={0.5} size={150} direction="up" />}

      <div className="min-h-screen text-gray-800 flex ">
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
                  <li key={module.id} className={`cursor-pointer p-2 hover:text-[#0000ff] rounded mb-2 ${
                    module.id === "diff_calc_part_deriv" ? "text-[#0000ff] font-bold" : ""
                  }`} onClick={() => router.push(`/${module.id}`)} >
                    {module.title}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>


        {/* Module Content */}
        <div className="flex-grow p-6 ml-[400px]">

          <h2 className="text-3xl font-black mb-4 mt-[30px]">Differential Calculus</h2>
          <p>Authors: Kartik Garg, Trisanu Das</p>
          <br />
          <p className="text-lg"><u>Basic definition of a derivative:</u> The derivative of a function is defined as the slope of a tangent to the function at a particular point</p>
          <br /><br />
          <div className="flex justify-center">
            <Image src={img1} width={400} height={400} alt="slope"/>
          </div><br /><br />
          <p className="text-lg">Or in mathematical terms, as follows :</p>
          <br />
          <div className="text-[30px] flex justify-center" dangerouslySetInnerHTML={{ __html: renderToString("\\frac{d}{dx}f(x) = \\lim_{\\Delta x \\to 0} \\frac{f(x + \\Delta x) - f(x)}{\\Delta x}") }} />
          <br />
          <p className="text-lg">Here, 
            $f(x + \\Delta x) - f(x)$
            represents the variation in the function's value, while 
            $\\Delta x$
            denotes the small change in the input, helping to determine the rate at which the function changes.</p>
          <br />
          <p className="text-lg">Below are some rules regarding derivatives:</p>
          <br />
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Rules</th>
                  <th>Function</th>
                  <th>Derivative</th>
                </tr>
              </thead>
              <tbody>
                {differentiationRules.map((rule, index) => (
                  <tr key={index} className="table-row">
                    <td>{rule.rule}</td>
                    <td><div className="flex justify-center" dangerouslySetInnerHTML={{ __html: renderToString(rule.function) }} /></td>
                    <td><div className="flex justify-center" dangerouslySetInnerHTML={{ __html: renderToString(rule.derivative) }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <br />
          {/* Dropdown to Update Progress */}
          <p className="text-lg">You don't need to remember all of these for AI and ML. The chain rule is one of the most useful of the above, and you will find its use when you read about <i>backpropagation</i> in <b>Neural Networks.</b></p>
          <br />
          <h2 className="text-3xl font-black mb-4 mt-[30px]">Partial Derivatives</h2>
          <p className="text-lg">Imagine you're hiking up a hill. But instead of just one path forward, you're walking on a weird surface with slopes in many directions. The big question is : </p>
          <br />
          <p className="text-lg text-center"><b>"Which way should you step to go uphill fastest?”</b></p>
          <br />
          <p className="text-lg pb-[30px]">This is exactly what partial derivatives help us figure out — how a function (like loss or error) changes with respect to each variable, when others are held constant.</p>
          <hr />
          <p className="text-lg pt-[30px]">A partial derivative measures how a multivariable function changes when only one variable changes, and all others are frozen in place. For example, if you have a function:</p>
          <br />
          <div className="text-lg flex justify-center" dangerouslySetInnerHTML={{ __html: renderToString("f(x, y) = 3x^2 + 2xy + y^2") }} />
          <br />
          <p className="text-lg">Then:</p>
          <ul style={{listStyleType: "disc"}}>
            <li className="text-lg">The partial derivative <b>w.r.t. x</b> is (y is assumed to be constant): </li>
            <br />
            <div className="text-lg flex justify-center" dangerouslySetInnerHTML={{ __html: renderToString("\\frac{\\partial f}{\\partial x} = 6x + 2y") }} />
            <br />
            <li className="text-lg">The partial derivative <b>w.r.t. y</b> is (x is assumed to be constant): </li>
            <br />
            <div className="text-lg flex justify-center" dangerouslySetInnerHTML={{ __html: renderToString("\\frac{\\partial f}{\\partial y} = 2x + 2y") }} />
          </ul>
          <br /><p className="text-lg mb-[30px]">Each of these tells you the slope in that direction.</p>

          <hr />
          <div className="flex justify-center items-center mt-[70px] mb-[80px]">
            <div className="flex items-center justify-center">
              <label className="font-semibold text-gray-700 mr-[10px] text-[30px]">
                Module Progress :
              </label>

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
            <h2 className="text-3xl font-black mb-6 text-center">Test Your Knowledge: Differential Calculus & Partial Derivatives</h2>

            {!quizStarted && !quizResults && (
              <div className="text-center">
                <p className="text-lg mb-6">Ready to test your understanding of Differential Calculus and Partial Derivatives?</p>
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
                <p>{currentQuestion.question}</p>
                <br />
                <div className="options-container grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      className={`block w-full text-left p-4 border rounded-lg transition-colors duration-200 
                                  ${selectedAnswer === option ? "bg-[#e0e7ff] border-[#0000ff]" : "bg-gray-50 hover:bg-gray-100 border-gray-200"}`}
                      onClick={() => handleAnswerSelection(option)}
                    >
                      <span>{option}</span>
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

export default DiffCalcPage;