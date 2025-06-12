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
          setStatus(docSnap.data().completedModules["scalar_mult_matrix"] || "not started");
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
      let updatedModules = { ...completedModules, ["scalar_mult_matrix"]: newStatus };

      await updateDoc(docRef, { completedModules: updatedModules });
      setCompletedModules(updatedModules);
      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const quizQuestions = [
    {
      question: "What is a matrix?",
      options: [
        "A circular arrangement of numbers",
        "A rectangular arrangement of objects in rows and columns",
        "A single line of text",
        "A list of random numbers",
      ],
      correctAnswer: "A rectangular arrangement of objects in rows and columns",
    },
    {
      question: "What do the 'elements' of a matrix refer to?",
      options: [
        "The brackets surrounding the numbers",
        "The empty spaces within the matrix",
        "The individual values or numbers inside the matrix",
        "The dimensions of the matrix",
      ],
      correctAnswer: "The individual values or numbers inside the matrix",
    },
    {
      question: "How are the dimensions of a matrix typically expressed?",
      options: [
        "Number of columns + Number of rows",
        "Number of rows × Number of columns",
        "Number of elements total",
        "The sum of all elements",
      ],
      correctAnswer: "Number of rows × Number of columns",
    },
    {
      question: `Given the matrix A = [[1, 3, 5], [7, 9, 11]], what is the element a[1][2]?`,
      options: [
        "1",
        "3",
        "9",
        "11",
      ],
      correctAnswer: "11",
    },
    {
      question: `What is the dimension of the matrix E = [[2,4], [6,8], [10,12]]?`,
      options: [
        "3 × 2",
        "2 × 3",
        "2 × 2",
        "3 × 3",
      ],
      correctAnswer: "3 × 2",
    },
    {
      question: `What is the element A[1][0] in matrix E = [[1,0,-1], [4,2,5]]?`,
      options: [
        "0",
        "1",
        "4",
        "5",
      ],
      correctAnswer: "4",
    },
    {
      question: "Which type of matrix has only one row and one or more columns?",
      options: [
        "Column Matrix",
        "Square Matrix",
        "Row Matrix",
        "Zero Matrix",
      ],
      correctAnswer: "Row Matrix",
    },
    {
      question: "A matrix with the same number of rows and columns is called a:",
      options: [
        "Row Matrix",
        "Column Matrix",
        "Square Matrix",
        "Identity Matrix",
      ],
      correctAnswer: "Square Matrix",
    },
    {
      question: "In an Identity Matrix, what are the values on the main diagonal?",
      options: [
        "0",
        "Any random numbers",
        "1",
        "The same as the number of rows",
      ],
      correctAnswer: "1",
    },
    {
      question: "If all elements in a matrix are zero, it is called a:",
      options: [
        "Diagonal Matrix",
        "Identity Matrix",
        "Zero Matrix",
        "Row Matrix",
      ],
      correctAnswer: "Zero Matrix",
    },
    {
      question: "Which of the following best describes a Diagonal Matrix?",
      options: [
        "All elements are zero.",
        "Only elements on the main diagonal are zero.",
        "All elements except those on the main diagonal are zero.",
        "It has only one row.",
      ],
      correctAnswer: "All elements except those on the main diagonal are zero.",
    },
    {
      question: "In mathematical notation, what does a_{1,2} represent?",
      options: [
        "The element in the second row, first column",
        "The element in the first row, second column",
        "The product of 1 and 2",
        "The sum of 1 and 2",
      ],
      correctAnswer: "The element in the first row, second column",
    },
    {
      question: "What is the common starting index for elements in matrices in programming languages like Python?",
      options: [
        "1",
        "0",
        "2",
        "Any number",
      ],
      correctAnswer: "0",
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
                      module.id === "scalar_mult_matrix" ? "text-[#0000ff] font-bold" : ""
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
          <h2 className="text-3xl font-black mb-4 mt-[30px]">Scalar Multiplication of a Matrix</h2>
          <p>Authors: Afsah Buraaq, Kartik Garg</p>
          <br /><br />
          <p className="text-2xl font-bold text-indigo-600">Multiplying Each Element by a Number: </p>
          <br />
          <p><u>Raw Idea :</u> Imagine turning up the brightness on a photo—every pixel becomes more intense, but the
shape of the photo doesn’t change. That’s what multiplying a matrix by a scalar does.
Every element gets brighter, duller, or flipped, depending on the number.</p>
          <br />
          <div className="bg-pink-100 p-[20px] rounded-sm">
          <b>Formal Rule:</b>
          <p>Let A be a matrix and k a scalar (a constant number). The scalar multiplication of A by k
is a new matrix k * A obtained by multiplying each element of A by k:</p>
<br />
          <div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`A = \\begin{matrix} a_{11} & a_{12}\\\\ a_{21} & a_{22} \\end{matrix}`) }} />
          <br />
          <div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`kA = \\begin{matrix} k * a_{11} & k * a_{12}\\\\ k * a_{21} & k * a_{22} \\end{matrix}`) }} />
          </div>
          <br /><br /><hr /><br /><br />
          <p className="text-2xl font-bold text-indigo-600">Concept of Scaling: </p>
          <br />
          <p>Multiplying by:</p>
          <ul className="ml-[30px]" style={{listStyleType:"disc"}}>
            <li>A positive number greater than 1 ⇒ Stretches the matrix</li>
            <li>A number between 0 and 1 ⇒ Shrinks the matrix</li>
            <li>A negative number ⇒ Flips signs, and may stretch or shrink</li>
          </ul>
          <br />
          <b>Example: Let k = 4, and </b>
          <div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`A = \\begin{matrix} 2 & -1\\\\ 0 & 3 \\end{matrix}`) }} />
          <br />
          <div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`kA = \\begin{matrix} 4 * 2 & 4 * -1\\\\ 4 * 0 & 4 * 3 \\end{matrix} = \\begin{matrix} 8 & -4\\\\ 0 & 12 \\end{matrix}`) }} />




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
          
        </div>
      </div>
    </>
  );
};

export default Grad_Desc;