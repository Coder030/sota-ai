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



import Confetti from 'react-confetti-boom';

const guideCategories = [
  {
    title:"Calculus in AI and ML",
    modules: [
      {id: "diff_calc_part_deriv", title:"Differential Calculus and Partial Derivatives", description: "Differential calculus enables AI/ML models to optimize functions, compute gradients, and enhance learning efficiency, while Partial derivatives measure how a function changes with respect to one variable"},
      {id: "gradients_desc", title:"Gradients and Gradient Descent", description: "Gradient descent is a numerical method for iteratively minimizing a function by repeatedly taking steps in the direction of the negative gradient. "},
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
  
  return (
    <><Navbar />
    
    <div className="min-h-screen bg- text-gray-800 flex ">
      

      {/* Sidebar Navigation */}
      <div className="w-[350px] fixed top-0 left-0 h-screen overflow-y-auto bg-white shadow-md p-4 z-10">
        <p className="text-[24px] mb-[20px] font-bold text-center">Mathematical Prerequisites</p>
<hr />
<div className="mt-[30px]"></div>
  {guideCategories.map((category) => (
    <div key={category.title} className="border-b mb-4">
      <h4 className="text-lg font-semibold mb-2">{category.title}</h4>
      <ul className="list-none pl-2">
        {category.modules.map((module) => (
          <li key={module.id} className={`cursor-pointer p-2 hover:text-[#0000ff] rounded mb-2 ${
            module.id === "gradients_desc" ? "text-[#0000ff] font-bold" : ""
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

        <h2 className="text-3xl font-black mb-4 mt-[30px]">Analogy</h2>
        <p  className="text-lg">Imagine that you are standing at some point on a hill, and your goal is to get to the lowest point possible. So, you take small steps, always downhill.</p>
        <br /><br />
        <div className="flex justify-center">
        <Image src={img1} width={400} height={400} alt="slope"/>
        </div>
        <br /><br />

        <p  className="text-lg mb-[30px]">That’s exactly what <b>gradient descent</b> does. It helps the machine learning model learn by <b>minimizing error</b>, one small step at a time.</p>
        <hr/>
        <h2 className="text-3xl font-black mb-4 mt-[30px]">Intuition</h2>
        <p className="text-lg">At the heart of machine learning is this idea: "We have a model, and we want to <b>make it better by minimizing its mistakes."</b> These "mistakes" are measured using a <b>loss function</b>  — a formula that tells us <i>how far off</i> our predictions are from the correct answers. </p>
        <br />
        <p className="text-lg">So the goal becomes:</p>
        <p className="text-lg">Find value of the model's parameters (like weights* and bias*), that minimizes the loss function.</p>
        <br />
        <p className="text-lg">But how do we know <b>which direction to change the weights</b> in order to reduce the loss? That’s where <b>gradients</b> come in.</p>
        <p></p>
        <br />
        <br />
        <br />
        <div className="flex justify-center">
        <div className="bg-[#b3b3b5] w-[500px] h-[1px]"></div></div>
        <br /><br /><br />
        <div class="text-base text-gray-800 space-y-4 ">
  <p><span className="font-semibold">Weights and Biases:</span></p>

  <p>
    In machine learning, we use an equation (called the <span class="font-semibold">loss function</span>) to measure how well our model is predicting the target values. 
    To improve the model, we adjust the <span className="font-semibold">coefficients</span> of the input variables — these are called  
    <span class="font-semibold"> weights</span>. A weight controls 
    <span class="italic"> how much influence</span> each input has on the final prediction. 
    The larger the weight, the more that input matters.
  </p>

  <p>
    The <span class="font-semibold">bias</span> is like the equation’s 
    <span class="italic"> starting point</span> — it lets the model make non-zero predictions even when all inputs are zero. 
    You can think of it as the intercept in a straight-line equation.
  </p>

  <p><span class="font-semibold">Example:</span></p>

  <p>
    Suppose we are predicting a student's test score based on four factors:
  </p>

  <ul class="list-disc list-inside space-y-1">
    <li>Study hours (x₁)</li>
    <li>Sleep hours (x₂)</li>
    <li>Attendance (x₃)</li>
    <li>Previous grades (x₄)</li>
  </ul>

  <p>The prediction model can be written as:</p>

  <p class="font-mono text-gray-700">
    ŷ = w₁·x₁ + w₂·x₂ + w₃·x₃ + w₄·x₄ + b
  </p>

  <p>
    Here, <span class="font-semibold">w₁, w₂, w₃, w₄</span> are the weights showing how important each factor is, 
    and <span class="font-semibold">b</span> is the bias that shifts the whole prediction up or down.
  </p>
</div>
<br /><br />
        <hr />
        <br /><br />
        <p className="text-lg">Think of a simple U-shaped curve like: </p>
        <br />
        <div className="text-lg flex justify-center" dangerouslySetInnerHTML={{ __html: renderToString("f(w) = (w-3)^2") }} />
        <br />
        <p className="text-lg">
  Suppose we set the weight <code>w</code> to 5 — that means we're starting high up on the curve. But we know the lowest point (the minimum) is at <code>w = 0</code>, so our goal is to slide down toward it (The slope at any point on the curve tells us how steep the descent is.) In calculus, this slope is what we call the <strong>derivative</strong> — something you’ve already seen earlier.
</p>
<br />
<div className="flex justify-center">
<Image src={img2} width={400} height={400} alt="slope"/></div>
<br /><br />
<hr />
<br /><br />
        <h2 className="text-3xl font-black mb-4">Gradients</h2>
        <p className="text-lg">The gradient is just a way to bundle all the partial derivatives together. It’s a vector (an arrow) pointing in the direction of the steepest <b><i>increase</i></b> in loss.</p>
        <p className="text-lg">So if:</p>
        <br />
        <ul style={{listStyleType:"disc"}}>
          <li><div className="text-[20px]" dangerouslySetInnerHTML={{ __html: renderToString("\\frac{\\partial L}{\\partial w_1} = 6") }} /></li>
          <br />
          <li><div className="text-[20px]" dangerouslySetInnerHTML={{ __html: renderToString("\\frac{\\partial L}{\\partial w_2} = 4") }} /></li>
        </ul>
        <br />
        <p className="text-lg">Then the gradient is : [6,4]. </p>
        <br />
         <p className="text-lg">This means: If you increase w₁ a little, the loss increases a lot. If you increase w₂ a little, the loss also increases, but slightly less. So, to minimize the loss, you want to go in the <b>opposite direction of the gradient.</b></p>
         <br /><br />
         <hr />
         <br /><br />
        <h2 className="text-3xl font-black mb-4">Gradient Descent</h2>
        <p className="text-lg">If you have a current weight value w, and you know the derivative (the gradient that is in the increasing direction), then you update like this:</p>
        <br />
        <div className="text-[20px] text-center" dangerouslySetInnerHTML={{ __html: renderToString("w = w - \\alpha * \\frac{\\partial L}{\\partial w}") }} />
        <br />
        <p className="text-lg">Where w is the weight, and α is the learning rate, a small positive number (like 0.01) that controls how <i>big a step</i> you take. So, each weight decreases in the opposite direction of the gradient (that's why the negative sign) multiplied by a constant value - the learning rate.</p>
        <br /><br />
        <div className="flex justify-center">
        <p className="border-[2px] p-[40px] px-[50px] w-[800px] text-lg" style={{
    clipPath:
      "polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)",
  }}>At this stage, many might wonder: if we use a constant learning rate—meaning each step we take is of the same size—there's a chance the model could overshoot the minimum point of the function. To address this issue, researchers have developed techniques known as adaptive learning rates, which we'll explore in a later module.</p></div>
  <br /><br />
  <p className="text-lg">An example of Gradient Descent at work is below:
</p>
<div className="flex justify-center">
<Image src={img3} width={600} height={600} alt="slope"/></div>
<br /><br />






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

export default DiffCalcPage;