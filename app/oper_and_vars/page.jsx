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
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { duotoneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { pythonCategories } from "../mathCategories";
import Ide from "../components/ide";



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
          setStatus(docSnap.data().completedModules["oper_and_vars"] || "not started");
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
      let updatedModules = { ...completedModules, ["oper_and_vars"]: newStatus };

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
          <p className="text-[24px] mb-[20px] font-bold text-center">Python Prerequisites</p>
          <hr />
          <div className="mt-[30px]"></div>
          {pythonCategories.map((category) => (
            <div key={category.title} className="border-b mb-4">
              <h4 className="text-lg font-semibold mb-2">{category.title}</h4>
              <ul className="list-none pl-2">
                {category.modules.map((module) => (
                  <li
                    key={module.id}
                    className={`cursor-pointer p-2 hover:text-[#0000ff] rounded mb-2 ${
                      module.id === "oper_and_vars" ? "text-[#0000ff] font-bold" : ""
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
          <h2 className="text-3xl font-black mb-4 mt-[30px]">Arithmetic and Variables. </h2>
          <p>Author: Kartik Garg</p>
          <br /><br />
          <p className="text-3xl font-bold text-indigo-600">Printing</p>
          <br />
          <p>One of the easiest — and most important — things you can tell a computer to do is to display a message.
In Python, you do this using the <code>print()</code> function.
You just place the message inside the parentheses, surrounded by quotation marks.</p> 
<br /><p>Below, we ask the computer to print the message - <code>Hello, world!</code>. </p>
<br />
    <SyntaxHighlighter language="python">
      print("Hello, world!")
    </SyntaxHighlighter>
    <code>Hello, world!</code>
    <br /><br /><hr /><br /><br />
          <p className="text-3xl font-bold text-indigo-600">Operations</p>
          <br />
          <p>We can also print the value of some arithmetic operation (such as addition, subtraction, multiplication, or division).</p>
          <br />

<p>For instance, in the next code cell, the computer adds 10 to 23 and then prints the result, which is 33. Note that unlike when we were simply printing text, we don't use any quotation marks.</p>
<br />
<SyntaxHighlighter language="python">
      print(10 + 23)
    </SyntaxHighlighter>
    <code>33</code>
    <br /><br />
    <p>Similarly, we can perform other operations :</p>
    <br />
    <SyntaxHighlighter language="python">
      {`print(23 - 10)
print(2 * 4)
print(80 / 16)`}
    </SyntaxHighlighter>
    <code>13</code>
    <br />
    <code>8</code>
    <br />
    <code>5.0</code>
    <br />
    <br /><br />
    <p><b>Note : </b> The operator <code>**</code> is for exponentiation.</p>
    <br />
    <p>Eg. </p>
    <SyntaxHighlighter language="python">
      print(2**3)
    </SyntaxHighlighter>
    <code>8</code>
    <br /><br /><hr /><br /><br />
          <p className="text-3xl font-bold text-indigo-600">Variables</p>
          <br />
          <p>To save the results we got for future use, we use variables. We assign a value to the variable in the following format :</p>
          <br />
          <SyntaxHighlighter language="python">
            {
              `x = 2**3 # equal to 8`
            }
          </SyntaxHighlighter>
          <br />
          <p>There are some rules that need to be taken care of while naming variables. </p>
          <ul className="mt-[10px] ml-[30px]" style={{listStyleType:"disc"}}>
            <li><b>Variables names cannot have a space in between: </b>Variable <code>"x y"</code> is not allowed. </li>
            <li><b>They can only consist of letters, numbers, and underscores : </b>Variable <code>"x@y"</code> is not allowed. </li>
            <li><b>They cannot start with a number: </b>Variable <code>"1x"</code> is not allowed. </li>
          </ul>
          <br />
          <p>Now if we print the variable x, </p>
          <SyntaxHighlighter language="python">
            {
              `print(x)`
            }
          </SyntaxHighlighter>
          <code>8</code>
          <br /><br />
          <p>We get the result that we stored earlier</p>
          <br /><br />
          <p>We can also change the value of a variable after we initialise it. </p>
          <br />
          <SyntaxHighlighter language="python">
            {
              `x = 21
print(x)

x = x + 3
print(x)`
            }
          </SyntaxHighlighter>
          <code>21</code>
          <br />
          <code>24</code>
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
        </div>
      </div>
    </>
  );
};

export default Grad_Desc;