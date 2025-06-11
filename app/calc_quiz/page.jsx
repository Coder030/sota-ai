"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { db, auth, doc, getDoc, updateDoc, onAuthStateChanged, setDoc } from "../firebase";
import { useRouter } from "next/navigation";
import Select from 'react-select';
import 'katex/dist/katex.min.css';
import { TiTick } from "react-icons/ti";

const guideCategories = [
  {
    title:"Calculus in AI and ML",
    modules: [
      {id: "diff_calc_part_deriv", title:"Differential Calculus and Partial Derivatives", description: "Differential calculus enables AI/ML models to optimize functions, compute gradients, and enhance learning efficiency, while Partial derivatives measure how a function changes with respect to one variable"},
      {id: "gradients_desc", title:"Gradients and Gradient Descent", description: "Gradient descent is a numerical method for iteratively minimizing a function by repeatedly taking steps in the direction of the negative gradient. "},
      {id: "calc_quiz", title:"Problems and Quizzes", description: "Solve problems and take quizzes to test your knowledge!"},
    ]
  },
  {
    title: "Statistics",
    modules: [
      { id: "normal_distr", title: "Normal Distributions", description: "Lorem, ipsum dolor sit amet consectetur adipisicing." },
      { id: "mean_median_mode", title: "Mean, median, mode", description: "Lorem, ipsum dolor sit amet consectetur adipisicing." },
      { id: "quantiles", title: "Quantiles", description: "Lorem, ipsum dolor sit amet consectetur adipisicing." },
    ],
  },
  {
    title: "Matrix",
    modules: [
      { id: "eigenvals", title: "Eigenvalues", description: "Lorem, ipsum dolor sit amet consectetur adipisicing." },
      { id: "determinant", title: "Determinant", description: "Lorem, ipsum dolor sit amet consectetur adipisicing." },
    ],
  },
];

const problemsData = [
  {
    title: "Problem 1: Derivatives (Power Rule)",
    question: "Given the function: f(x) = 4x³ – 2x² + 7x – 5\n\nFind the derivative of f(x) with respect to x.",
    hint: "Use the power rule: d/dx(xⁿ) = n·xⁿ⁻¹",
    answer: "f’(x) = 12x² – 4x + 7",
  },
  {
    title: "Problem 2: Partial Derivatives",
    question: "Given: f(x,y) = x²y + 3xy² + y\n\nFind ∂f/∂x and ∂f/∂y",
    hint: "Differentiate w.r.t one variable holding the other constant.",
    answer: "∂f/∂x = 2xy + 3y²,   ∂f/∂y = x² + 6xy + 1",
  },
  {
    title: "Problem 3: Gradient Interpretation",
    question: "Suppose ∂L/∂w₁ = –8 and ∂L/∂w₂ = 5.\n\nWhich direction to move? Write update eqns with α = 0.01.",
    hint: "Move opposite to the gradient: w := w – α·∂L/∂w",
    answer: "w₁ := w₁ – 0.01·(–8) = w₁ + 0.08; w₂ := w₂ – 0.01·(5) = w₂ – 0.05",
  },
  {
    title: "Problem 4: Chain Rule Application",
    question: "Suppose y = (3x² + 2)⁵\n\nFind dy/dx.",
    hint: "dy/dx = 5·(3x²+2)⁴ · (d/dx of 3x²+2)",
    answer: "dy/dx = 5·(3x²+2)⁴ · 6x = 30x·(3x²+2)⁴",
  },
];

const quizData = [
  {
    type: 'mcq',
    q: "The derivative of f(x)=x⁴ is:",
    options: ["4x³", "3x²", "4x²", "x³"],
    correct: "4x³",
  },
  {
    type: 'mcq',
    q: "Which best describes a gradient?",
    options: [
      "The highest value of a function",
      "The value of a function at x=0",
      "A vector of partial derivatives",
      "The slope of a straight line"
    ],
    correct: "A vector of partial derivatives",
  },
  {
    type: 'tf',
    q: "The gradient always points in the direction of steepest descent.",
    correct: false,
  },
  {
    type: 'tf',
    q: "In gradient descent, the learning rate determines how fast we move towards the minimum.",
    correct: true,
  },
  {
    type: 'tf',
    q: "Partial derivatives consider the change in all variables at once.",
    correct: false,
  },
];

const DiffCalcPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [completedModules, setCompletedModules] = useState({});
  const [status, setStatus] = useState("");
 const [hintVisible, setHintVisible] = useState(Array(problemsData.length).fill(false));
const [answerVisible, setAnswerVisible] = useState(Array(problemsData.length).fill(false));
const [answers, setAnswers] = useState(Array(quizData.length).fill(null));

  const [quizIndex, setQuizIndex] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      if (authUser) {
        const docRef = doc(db, "users", authUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCompletedModules(docSnap.data().completedModules || {});
          setStatus(docSnap.data().completedModules["calc_quiz"] || "not started");
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
      const updated = { ...completedModules, ["calc_quiz"]: newStatus };
      await updateDoc(docRef, { completedModules: updated });
      setCompletedModules(updated);
      setStatus(newStatus);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuizAnswer = (value) => {
    const tmp = [...answers];
    tmp[quizIndex] = value;
    setAnswers(tmp);
  };

  const handleNext = () => quizIndex < quizData.length - 1 && setQuizIndex(quizIndex + 1);
  const handlePrev = () => quizIndex > 0 && setQuizIndex(quizIndex - 1);

  const handleSubmit = () => {
    let sc = 0;
    quizData.forEach((q, idx) => {
      if (answers[idx] === q.correct) sc++;
    });
    setScore(sc);
    setShowScore(true);
    updateModuleStatus("completed");
  };

  const currentQuiz = quizData[quizIndex];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-gray-800 flex">
        {/* Sidebar */}
        <div className="w-[350px] fixed top-0 left-0 h-screen overflow-y-auto bg-white shadow-md p-4 z-10">
          <p className="text-[24px] mb-[20px] font-bold text-center">Mathematical Prerequisites</p><hr /><div className="mt-[30px]" />
          {guideCategories.map((cat) => (
            <div key={cat.title} className="border-b mb-4">
              <h4 className="text-lg font-semibold mb-2">{cat.title}</h4>
              <ul className="pl-2">
                {cat.modules.map((m) => (
                  <li key={m.id} className={`cursor-pointer p-2 hover:text-blue-600 mb-2 ${m.id === "calc_quiz" ? "text-blue-600 font-bold" : ""}`}
                      onClick={() => router.push(`/${m.id}`)}>
                    {m.title}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-grow p-6 ml-[400px]">
          <h2 className="text-3xl font-black mb-4 mt-[30px]">Problems</h2>
          {problemsData.map((p, i) => (
            <div key={i} className="mb-6 p-4 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
              <p className="whitespace-pre-line">{p.question}</p>
              <div className="mt-2">
                <button className="mr-2 text-blue-600" onClick={() => {
                  setHintVisible(h => { h[i] = true; return [...h]; });
                }}>Show Hint</button>
                {hintVisible[i] && <span className="ml-2 text-gray-600">{p.hint}</span>}
              </div>
              <div className="mt-2">
                <button className="mr-2 text-green-600" onClick={() => {
                  setAnswerVisible(a => { a[i] = true; return [...a]; });
                }}>Show Answer</button>
                {answerVisible[i] && <span className="ml-2 text-gray-800 font-medium">{p.answer}</span>}
              </div>
            </div>
          ))}

          <h2 className="text-3xl font-black mb-4 mt-[60px]">Quiz</h2>
          {!showScore ? (
            <div className="p-6 border rounded-lg max-w-xl">
              <p className="mb-4 font-medium">Question {quizIndex + 1} of {quizData.length}</p>
              <p className="mb-4">{currentQuiz.q}</p>
              <div className="mb-4">
                {currentQuiz.type === 'mcq' ? (
                  currentQuiz.options.map((opt, idx) => (
                    <div key={idx} className="mb-2">
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name={`q-${quizIndex}`}
                          value={opt}
                          checked={answers[quizIndex] === opt}
                          onChange={() => handleQuizAnswer(opt)}
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    </div>
                  ))
                ) : (
                  ['True', 'False'].map((tf) => (
                    <div key={tf} className="mb-2">
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name={`q-${quizIndex}`}
                          value={tf}
                          checked={answers[quizIndex] === (tf === 'True')}
                          onChange={() => handleQuizAnswer(tf === 'True')}
                          className="mr-2"
                        />
                        {tf}
                      </label>
                    </div>
                  ))
                )}
              </div>
              <div className="flex justify-between">
                <button disabled={quizIndex === 0} onClick={handlePrev} className="px-4 py-2 bg-gray-200 rounded">Previous</button>
                {quizIndex < quizData.length - 1 ? (
                  <button onClick={handleNext} className="px-4 py-2 bg-blue-500 text-white rounded">Next</button>
                ) : (
                  <button onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded">Submit</button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 border rounded-lg max-w-sm text-center">
              <h3 className="text-2xl mb-4">Your Score</h3>
              <p className="text-xl font-semibold">{score} / {quizData.length}</p>
            </div>
          )}
          <br /><br /><br />
          <hr />
          <div className="flex justify-center items-center mt-[70px] mb-[80px]">
            <label className="font-semibold text-gray-700 mr-[10px] text-[30px]">Module Progress :</label>
            <Select
              options={[
                { value: "not started", label: "Not Started" },
                { value: "completed", label: "Completed" },
                { value: "skipped", label: "Skipped" }
              ]}
              onChange={(v) => updateModuleStatus(v.value)}
              className="w-[200px]"
              menuPlacement="top"
            />
            {status === "completed" && <TiTick size="3em" className="ml-4 text-green-600" />}
          </div>
        </div>
      </div>
    </>
  );
};

export default DiffCalcPage;
