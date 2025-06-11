"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { db, auth, doc, getDoc, updateDoc, onAuthStateChanged } from "../firebase";
import { useRouter } from "next/navigation";
import Select from 'react-select'
import img1 from "./img1.png"
import Image from "next/image";
import 'katex/dist/katex.min.css';
import { renderToString } from 'katex';
import "./style.css"
import Confetti from "react-confetti"; 

const guideCategories = [
  {
    title:"Calculus in AI and ML",
    modules: [
      {id: "diff_calc_part_deriv", title:"Differential Calculus and Partial Derivatives", description: "Differential calculus enables AI/ML models to optimize functions, compute gradients, and enhance learning efficiency."},
      {id: "gradients_desc", title:"Gradients and Gradient Descent", description: "Partial derivatives measure how a function changes with respect to one variable, while gradients guide optimization in AI/ML models."},
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


const DiffCalcPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [completedModules, setCompletedModules] = useState({});
  const [status, setStatus] = useState("");

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
  { rule: 'Multiplication by constant', function: 'c × f(x)', derivative: "c × \\frac{d}{dx}f(x)" },
  { rule: 'Power Rule', function: 'f(x^n)', derivative: "n × (x^{n-1})" },
  { rule: 'Sum Rule', function: 'f(x) + g(x)', derivative: "\\frac{d}{dx}f(x) + \\frac{d}{dx}g(x)" },
  { rule: 'Difference Rule', function: 'f(x) - g(x)', derivative: "\\frac{d}{dx}f(x) - \\frac{d}{dx}g(x)" },
  { rule: 'Product Rule', function: 'f(x) × g(x)', derivative: "f × \\frac{d}{dx}g(x)  +\\frac{d}{dx}f(x) × g(x)" },
  { rule: 'Quotient Rule', function: '\\frac{f(x)}{g(x)}', derivative: "\\frac{\\frac{d}{dx}f(x) × g(x) - f × \\frac{d}{dx}g(x)}{g^2}" },
  { rule: 'Reciprocal Rule', function: '\\frac{1}{f(x)}', derivative: "\\frac{-\\frac{d}{dx}f(x)}{ f^2}" },
  { rule: 'Chain Rule', function: '\\frac{dy}{dx}', derivative: "\\frac{dy}{du} × \\frac{du}{dx}" },
];
  return (
    <><Navbar />
    
    <div className="min-h-screen bg- text-gray-800 flex">
      

      {/* Sidebar Navigation */}
      <div className="min-w-[350px] bg-white shadow-md p-4 min-h-screen">
  {guideCategories.map((category) => (
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
      <div className="flex-grow p-6 mx-[100px]">
        <h2 className="text-3xl font-black mb-4 mt-[30px]">Differential Calculus</h2>
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
𝑓
(
𝑥
+
Δ
𝑥
)
−
𝑓
(
𝑥
)
 represents the variation in the function's value, while 
Δ
𝑥
 denotes the small change in the input, helping to determine the rate at which the function changes.</p>
 <br />
 <p className="text-lg">Below are some rules regarding derivatives:
</p>
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
        <div className="mt-6 flex items-center justify-center">
          <label className="font-semibold text-gray-700 mr-[10px]">Module Progress : </label>
          <Select options={[ { value: 'not started', label: 'Not Started' },
  { value: 'completed', label: 'Completed' },
  { value: 'skipped', label: 'Skipped' }]} onChange={(value) => updateModuleStatus(value.value)} className="w-[200px]"/>
          {/* <select
            value={status}
            onChange={(e) => updateModuleStatus(e.target.value)}
            className="p-2 border rounded-md mt-2"
          >
            <option value="not started">Not Started</option>
            <option value="completed">Completed</option>
            <option value="skipped">Skipped</option>
          </select> */}
        </div>
      </div>
    </div>
    </>

  );
};

export default DiffCalcPage;