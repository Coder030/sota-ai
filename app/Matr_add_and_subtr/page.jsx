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
          setStatus(docSnap.data().completedModules["Matr_add_and_subtr"] || "not started");
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
      let updatedModules = { ...completedModules, ["Matr_add_and_subtr"]: newStatus };

      await updateDoc(docRef, { completedModules: updatedModules });
      setCompletedModules(updatedModules);
      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };


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

  const currentQuestion = "";

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
                      module.id === "Matr_add_and_subtr" ? "text-[#0000ff] font-bold" : ""
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
          <h2 className="text-3xl font-black mb-4 mt-[30px]">Matrix Addition and Subtraction</h2>
          <p>Authors: Afsah Buraaq, Kartik Garg</p>
          <br /><br />
          <p className="text-2xl font-bold text-indigo-600">Conditions for Matrix Addition or Subtraction</p>
          <br />
          <p><u>Raw Idea:</u> You can’t add apples and oranges—and you can’t add or subtract matrices unless they’re
the same shape. Think of two grids that must “fit” over each other to be combined.</p>
<br />
          <div className="bg-pink-100 p-[20px] rounded-sm">
<b>Formal Rule:</b>
<p>Two matrices can only be added or subtracted if they have the same dimensions—that is,
the same number of rows and columns.</p>
<p>Let A and B both be matrices of order m × n. Then: </p>
<ul style={{listStyleType:"disc"}} className="ml-[30px]">
  <li>A + B and A − B are defined</li>
  <li>Each element is added or subtracted position by position</li>
</ul>
</div>
<br /><br /><hr /><br /><br />
<p className="text-2xl font-bold text-indigo-600">Adding Corresponding Elements</p>
<br />
<p>You go box by box and add the numbers that are in the same place—like adding the top-left
of one with the top-left of the other, and so on.</p>
<br />
<div className="bg-pink-100 p-[20px] rounded-sm">
<p>Let :</p>
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`A = \\begin{matrix} a_{11} & a_{12}\\\\ a_{21} & a_{22} \\end{matrix}`) }} />
<br />
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`B = \\begin{matrix} b_{11} & b_{12}\\\\ b_{21} & b_{22} \\end{matrix}`) }} />
<br />
<p>Then the sum A + B is:</p>
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`A + B = \\begin{matrix} a_{11} + b_{11} & a_{12} + b_{12}\\\\ a_{21} + b_{21} & a_{22} + b_{22} \\end{matrix}`) }} />
</div>
<br />
<p>Example: </p>
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`A = \\begin{matrix} 2 & 4\\\\ 6 & 8 \\end{matrix}`) }} />
<br />
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`B = \\begin{matrix} 1 & 3\\\\ 5 & 7 \\end{matrix}`) }} />
<br />
<p>Then, </p>
<div className="flex justify-center">
<div className="text-[20px] text-center bg-pink-100 p-[20px] rounded-sm w-[500px]" dangerouslySetInnerHTML={{ __html: renderToString(`A + B = \\begin{matrix} 3 & 7\\\\ 11 & 15 \\end{matrix}`) }} />
</div>
<br /><br /><hr /><br /><br />
<p className="text-2xl font-bold text-indigo-600">Subtraction: Same Method, Different Sign</p>
<br />
<p>Subtraction is just like addition—but instead of combining, you find the difference at each
position.</p>
<br />
<p>Example: </p>
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`A = \\begin{matrix} 9 & 7\\\\ 4 & 6 \\end{matrix}`) }} />
<br />
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`B = \\begin{matrix} 3 & 2\\\\ 1 & 5 \\end{matrix}`) }} />
<br />
<p>Then, </p>
<div className="flex justify-center">
<div className="text-[20px] text-center bg-pink-100 p-[20px] rounded-sm w-[500px]" dangerouslySetInnerHTML={{ __html: renderToString(`A - B = \\begin{matrix} 6 & 5\\\\ 3 & 1 \\end{matrix}`) }} />
</div>
<br/> <br /> <hr /> <br /><br />
<div className="bg-pink-100 p-[20px] rounded-sm">
<b>Question 1: What is X + Y?</b>

<br /><br />
<div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString(`X = \\begin{matrix} 1 & 2\\\\3 & 4 \\end{matrix}, Y = \\begin{matrix} 4 & 3\\\\2 & 1 \\end{matrix}`) }} />
<div className="ml-[20px]">
<p><div className="text-[20px]" dangerouslySetInnerHTML={{ __html: renderToString(`A) \\begin{matrix} 5 & 5\\\\ 5 & 5 \\end{matrix}`) }} /></p>
<br />
<p><div className="text-[20px]" dangerouslySetInnerHTML={{ __html: renderToString(`B) \\begin{matrix} 3 & 5\\\\ 1 & 3 \\end{matrix}`) }} /></p>
<br />
<p><div className="text-[20px]" dangerouslySetInnerHTML={{ __html: renderToString(`C) \\begin{matrix} -3 & -1\\\\ 1 & 3 \\end{matrix}`) }} /></p>
<br />
<p>D) Not Defined</p>
</div>
<br />
<hr />
<br />
<p><b>Answer :</b> A)</p>

</div>
<br /><br /><br />
<hr/>



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