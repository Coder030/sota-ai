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
import img1 from "./eigenvector_scaling_animation.gif"
import img2 from "./grid_transform_1.gif"

import img3 from "./grid_transform_2.gif"
import img4 from "./shape_transform_1.gif"
import img5 from "./shape_transform_2.gif"




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
          setStatus(docSnap.data().completedModules["appls_deeper_matr_ideas"] || "not started");
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
      let updatedModules = { ...completedModules, ["appls_deeper_matr_ideas"]: newStatus };

      await updateDoc(docRef, { completedModules: updatedModules });
      setCompletedModules(updatedModules);
      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };
const quizQuestions = [
  {
    question: "What does each number in a black-and-white image matrix represent?",
    options: [
      "A pixel’s temperature",
      "A color’s brightness",
      "A shade of gray",
      "A binary digit",
    ],
    correctAnswer: "A shade of gray",
  },
  {
    question: "How are color images typically represented using matrices?",
    options: [
      "A single matrix of RGB values",
      "Separate matrices for red, green, and blue channels",
      "One matrix where each value is a color name",
      "A string of hexadecimal codes",
    ],
    correctAnswer: "Separate matrices for red, green, and blue channels",
  },
  {
    question: "What does the determinant of a matrix tell us?",
    options: [
      "How fast it can be inverted",
      "Whether the matrix is invertible",
      "The number of rows and columns",
      "The matrix's color depth",
    ],
    correctAnswer: "Whether the matrix is invertible",
  },
  {
    question: "Which of the following is an example of a feature matrix in AI?",
    options: [
      "A chart of image pixels",
      "A table where rows are people and columns are features",
      "A matrix with only zeros and ones",
      "A list of possible outputs",
    ],
    correctAnswer: "A table where rows are people and columns are features",
  },
  {
    question: "What does an inverse matrix do?",
    options: [
      "It deletes a matrix",
      "It transposes a matrix",
      "It undoes the transformation done by the original matrix",
      "It doubles all values in the matrix",
    ],
    correctAnswer: "It undoes the transformation done by the original matrix",
  },
  {
    question: "What is required for a matrix to be invertible?",
    options: [
      "It must have even dimensions",
      "All values must be positive",
      "Its determinant must not be zero",
      "It must be symmetric",
    ],
    correctAnswer: "Its determinant must not be zero",
  },
  {
    question: "What is a matrix transformation?",
    options: [
      "A way to sort a matrix",
      "Applying a matrix to a vector to change its direction or scale",
      "Flipping the matrix horizontally",
      "Adding all elements in a matrix",
    ],
    correctAnswer: "Applying a matrix to a vector to change its direction or scale",
  },
  {
    question: "What stays the same when an eigenvector is transformed by its matrix?",
    options: [
      "Its direction",
      "Its length",
      "Its dimension",
      "Its determinant",
    ],
    correctAnswer: "Its direction",
  },
  {
    question: "In the equation A ⋅ v = λ ⋅ v, what is λ?",
    options: [
      "The inverse of A",
      "A constant called the eigenvalue",
      "A direction vector",
      "A rotation angle",
    ],
    correctAnswer: "A constant called the eigenvalue",
  },
  {
    question: "How are matrices typically stored in programming?",
    options: [
      "As string variables",
      "As 3D tensors",
      "As 2D arrays",
      "As audio files",
    ],
    correctAnswer: "As 2D arrays",
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
                      module.id === "appls_deeper_matr_ideas" ? "text-[#0000ff] font-bold" : ""
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
          <h2 className="text-3xl font-black mb-4 mt-[30px]">Applications and Deeper Matrix Ideas</h2>
          <p>Author: Afsah Buraaq</p>
          <p className="text-[17px] text-[#545353]">Co - Author : Kartik Garg </p>
          <br /><br />
          <p className="text-2xl font-bold text-indigo-600">Applications of Matrices in Real Life and AI</p>
          <br />
          <p>Why are we learning matrices at all? Because they show up everywhere—from photos on your
screen to the neurons in a robot’s brain.</p>
<br />

<p className="text-xl font-bold underline">Matrices in Image Processing</p>
<br />
<p>A black-and-white image is just a matrix of numbers, where each number is a shade of
gray. Color images? A matrix is multiplied for each color—red, green, blue.</p>
<br />
<p>We apply filters, detect edges, sharpen or blur—all through matrix multiplication and convolution.</p>
<br /><br /><hr /><br /><b></b>
<p className="text-xl font-bold underline">Matrices in Data Tables (Features × Samples)</p>
<br />
<p>Imagine a table where: </p>
<p>• Each row is a person</p>
<p>• Each column is a detail: height, age, score, etc.</p>
<br />  
<p>That’s a feature matrix. It forms the input of many AI systems.</p>
<br /><br /><hr /><br /><br />
<p className="text-xl font-bold underline">Storing Info in Computers</p>
<br />
<p>In memory and programming, we store matrices as 2D arrays:</p>
<br />
<code>data = [[1, 2], [3, 4]] </code>
<br />  <br />
<p>This is how spreadsheets, pixel data, and even game maps are represented!</p>
<br /><br /><hr /><br /><br />
          <p className="text-2xl font-bold text-indigo-600">Determinants and Inverse</p>
          <br />
          <p><u>Raw Idea :</u> Think of the determinant as the DNA of a matrix. It tells you if the matrix behaves
nicely (invertible)—or if it’s dangerous (non-invertible).</p>
        <br />
 <div className="bg-pink-100 p-[20px] rounded-sm">
<b>Formal Defination:</b>
<p>If : </p>
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`A = \\begin{matrix} a & b\\\\ c & d \\end{matrix}`) }} />
<br />
<p>Then :</p>
<br />
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`det(A) = ad - bc`) }} />
</div> 
<br /><p className="text-xl font-bold underline">Inverse of a Matrix</p>
<br />
<p><u>Raw Idea :</u> An inverse matrix is like the ”undo” button. If matrix A does something to data, then it's inverse
undoes it.</p>
<br />
<div className="bg-pink-100 p-[20px] rounded-sm">
<b>Formal Defination:</b>
<p>For a 2 × 2 matrix A,</p>
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`A^{-1} = \\frac{1}{det(A)} * \\begin{matrix} d & -b\\\\ -c & a \\end{matrix}`) }} />
</div> 
<br />
<b>A thing to note here is that a matrix A is invertible if and only if det(A) ≠ 0 (because denominator cannot be a 0). Thus, the determinant tells us whether a matrix is invertible or not</b>
<br /><br /><hr /><br /><br />
          <p className="text-2xl font-bold text-indigo-600">Matrix Transformation</p>
          <br />
          <p><u>Raw Idea :</u> When you multiply a vector by a matrix, the matrix transforms the vector — it might stretch it, rotate it, flip it, or squash it, depending on what kind of matrix it is.</p>
          <br />
          <p>Imagine a grid drawn on rubber. A matrix transformation pushes and pulls the grid in specific ways — like rotating it, stretching it along one direction, or compressing it.</p>
          <br />
          <div className="bg-pink-100 p-[20px] rounded-sm">
          <b>Formal Defination:</b>
          <p>Mathematically:</p>
          <p className="text-center">

New Vector
=
𝐴
⋅
𝑣
⃗</p>
<br />
<p>You start with vector v, apply the transformation A, and get a new vector as output.
That’s a matrix transformation — a way of changing vectors.</p>
          </div> 
          <br />
          <p>Examples of how a matrix transforms a grids or shapes :</p>
          <br />
          <p>Grids :</p>
          <div className="flex justify-center">
          <Image src={img2} height={500} width={500} alt="trans1" />
          <Image src={img3} height={500} width={500} alt="trans2" />
          </div>
          <p>Shapes :</p>
          <div className="flex justify-center">
          <Image src={img4} height={500} width={500} alt="trans1" />
          <Image src={img5} height={500} width={500} alt="trans2" />
          </div>
          <br /><br /><hr /><br /><br />
          <p className="text-2xl font-bold text-indigo-600">Eigenvalues and Eigenvectors</p>
          <br />
          <p>This is the heart of advanced matrix theory—and the foundation of many AI algorithms.</p>
          <br />
          <p><u>Raw Idea :</u> An eigenvector is a direction that a matrix transformation doesn’t change. It might stretch
or shrink it, but the direction remains the same.</p>
          <br />
          <p>Let's say A is a square matrix and 𝑣⃗ is a vector. Then 𝐴⋅𝑣⃗ is the transformed vector after applying the matrix to the vector. If the transformed vector still points in the same direction as the initial vector, it implies that 𝑣⃗ is an eigenvector. In other words, </p>
          <br />
          <div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`𝐴⋅𝑣⃗  = \\lambda ⋅ 𝑣⃗`) }} />
          <br />
          <p>where λ is some constant value. This constant value, λ, is called the eigenvalue. </p>
          <div className="flex justify-center">
            <Image src={img1} width={500} height={500} alt="slope"/>
          </div>
          <br /><br /><hr /><br /><br />



 

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
            <h2 className="text-3xl font-black mb-6 text-center">Test Your Knowledge: Applications and Deeper Matrix Ideas</h2>

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