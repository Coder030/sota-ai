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
import img1 from "./img1.png"
import img2 from "./img2.png"
import img3 from "./img3.png"
import img4 from "./img4.png"
import img5 from "./img5.png"
import gif1 from "./gif1.gif"
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
          setStatus(docSnap.data().completedModules["gradients_desc"] || "not started");
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
      let updatedModules = { ...completedModules, ["gradients_desc"]: newStatus };

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
                      module.id === "gradients_desc" ? "text-[#0000ff] font-bold" : ""
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
        <div className="flex-grow p-6 ml-[400px]">
          <h2 className="text-3xl font-black mb-4 mt-[30px]">Gradients and Gradient Descent</h2>
          <p>Authors: Kartik Garg, Trisanu Das</p>
          <br />
          <p className="text-lg">
            Imagine that you are standing at some point on a hill, and your goal is to get to the lowest point possible.
            So, you take small steps, always downhill.
          </p>
          <br />
          <br />
          <div className="flex justify-center">
            <Image src={img1} width={400} height={400} alt="slope" />
          </div>
          <br />
          <br />

          <p className="text-lg mb-[30px]">
            That’s exactly what <b>gradient descent</b> does. It helps the machine learning model learn by{" "}
            <b>minimizing error</b>, one small step at a time.
          </p>
          <hr />
          <h2 className="text-3xl font-black mb-4 mt-[30px]">Intuition</h2>
          <p className="text-lg">
            At the heart of machine learning is this idea: "We have a model, and we want to{" "}
            <b>make it better by minimizing its mistakes."</b> These "mistakes" are measured using a{" "}
            <b>loss function</b> — a formula that tells us <i>how far off</i> our predictions are from the correct
            answers.{" "}
          </p>
          <br />
          <p className="text-lg">So the goal becomes:</p>
          <p className="text-lg">Find value of the model's parameters (like weights* and bias*), that minimizes the loss function.</p>
          <br />
          <p className="text-lg">
            But how do we know <b>which direction to change the weights</b> in order to reduce the loss? That’s where{" "}
            <b>gradients</b> come in.
          </p>
          <p></p>
          <br />
          <br />
          <br />
          <div className="flex justify-center">
            <div className="bg-[#b3b3b5] w-[500px] h-[1px]"></div>
          </div>
          <br />
          <br />
          <br />
          <div className="text-base text-gray-800 space-y-4 ">
            <p>
              <span className="font-semibold">Weights and Biases:</span>
            </p>

            <p>
              In machine learning, we use an equation (called the <span className="font-semibold">loss function</span>) to
              measure how well our model is predicting the target values. To improve the model, we adjust the{" "}
              <span className="font-semibold">coefficients</span> of the input variables — these are called{" "}
              <span className="font-semibold"> weights</span>. A weight controls <span className="italic">
                how much influence
              </span>{" "}
              each input has on the final prediction. The larger the weight, the more that input matters.
            </p>

            <p>
              The <span className="font-semibold">bias</span> is like the equation’s{" "}
              <span className="italic"> starting point</span> — it lets the model make non-zero predictions even when all
              inputs are zero. You can think of it as the intercept in a straight-line equation.
            </p>

            <p>
              <span className="font-semibold">Example:</span>
            </p>

            <p>Suppose we are predicting a student's test score based on four factors:</p>

            <ul className="list-disc list-inside space-y-1">
              <li>Study hours (x₁)</li>
              <li>Sleep hours (x₂)</li>
              <li>Attendance (x₃)</li>
              <li>Previous grades (x₄)</li>
            </ul>

            <p>The prediction model can be written as:</p>

            <p className="font-mono text-gray-700">ŷ = w₁·x₁ + w₂·x₂ + w₃·x₃ + w₄·x₄ + b</p>

            <p>
              Here, <span className="font-semibold">w₁, w₂, w₃, w₄</span> are the weights showing how important each
              factor is, and <span className="font-semibold">b</span> is the bias that shifts the whole prediction up or
              down.
            </p>
          </div>
          <br />
          <br />
          <hr />
          <br />
          <br />
          <p className="text-lg">Think of a loss function like a simple U-shaped curve: </p>
          <br />
          <div className="text-lg flex justify-center" dangerouslySetInnerHTML={{ __html: renderToString("f(w) = (w-3)^2") }} />
          <br />
          <p className="text-lg">
            Suppose we set the weight <code>w</code> to 5 — that means we're starting high up on the curve. But we know
            the lowest point (the minimum) is at <code>w = 0</code>, so our goal is to slide down toward it (The slope at
            any point on the curve tells us how steep the descent is.) In calculus, this slope is what we call the{" "}
            <strong>derivative</strong> — something you’ve already seen earlier.
          </p>
          <br />
          <div className="flex justify-center">
            <Image src={img2} width={400} height={400} alt="slope" />
          </div>
          <br />
          <br />
          <hr />
          <br />
          <br />
          <h2 className="text-3xl font-black mb-4">Gradients</h2>
          <p className="text-lg">
            The gradient is just a way to bundle all the partial derivatives together. It’s a vector (an arrow) pointing
            in the direction of the steepest <b><i>increase</i></b> in loss.
          </p>
          <p className="text-lg">So if:</p>
          <br />
          <ul style={{ listStyleType: "disc" }}>
            <li>
              <div className="text-[20px]" dangerouslySetInnerHTML={{ __html: renderToString("\\frac{\\partial L}{\\partial w_1} = 6") }} />
            </li>
            <br />
            <li>
              <div className="text-[20px]" dangerouslySetInnerHTML={{ __html: renderToString("\\frac{\\partial L}{\\partial w_2} = 4") }} />
            </li>
          </ul>
          <br />
          <p className="text-lg">Then the gradient is : [6,4]. </p>
          <br />
          <p className="text-lg">
            This means: If you increase w₁, the loss increases by 6, and if you increase w₂, the loss increases by 4. So, to minimize the loss, you want to go in the <b>opposite direction of the
            gradient.</b>
          </p>
          <br />
          <br />
          <hr />
          <br />
          <br />
          <h2 className="text-3xl font-black mb-4">Gradient Descent</h2>
          <p className="text-lg">
            If you have a current weight value w, and you know the derivative (the gradient that is in the increasing
            direction), then you update like this:
          </p>
          <br />
          <div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString("w = w - \\alpha * \\frac{\\partial L}{\\partial w}") }} />
          <br />
          <p className="text-lg">
            Where w is the weight, and α is the learning rate, a small positive number (like 0.01) that controls how{" "}
            <i>big a step</i> you take. So, each weight decreases in the opposite direction of the gradient (that's why
            the negative sign) multiplied by a constant value - the learning rate.
          </p>
          <br />
          <br />
          <div
            className="flex justify-center"
          >
            <p
              className="border-[2px] p-[40px] px-[50px] w-[800px] text-lg"
              style={{
                clipPath:
                  "polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)",
              }}
            >
              At this stage, many might wonder: if we use a constant learning rate—meaning each step we take is of the
              same size—there's a chance the model could overshoot the minimum point of the function. To address this
              issue, researchers have developed techniques known as adaptive learning rates, which we'll explore in a later
              module.
            </p>
          </div>
          <br />
          <br />
          <p className="text-lg">An example of Gradient Descent at work is below:</p>
          <br /><br />
          <div className="flex justify-center ">
  <Image
    src={gif1} // Use the imported GIF
    alt="Gradient Descent Animation"
    width={700} // Adjust width and height as needed to fit your design
    height={500}
    unoptimized={true} // Add this if you want to use the GIF as-is without Next.js optimization.
                       // GIFs often don't optimize well, so this is often needed.
  />
</div>
          <br />
          <br />

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