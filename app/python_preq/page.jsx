"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { db, auth, doc, getDoc, setDoc, updateDoc, onAuthStateChanged } from "../firebase";
import Image from "next/image";
import img from "../../public/conn.png";
import { SiTicktick } from "react-icons/si";
import { Progress } from "../../components/ui/progress"
import { Atom } from "react-loading-indicators";
import { useRouter } from "next/navigation";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";
import { pythonCategories } from "../mathCategories";

const GuidePage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [completedModules, setCompletedModules] = useState({});
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
    setUser(authUser);

    if (authUser) {
      const docRef = doc(db, "users", authUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCompletedModules(docSnap.data().completedModules || {});
      } else {
        await setDoc(docRef, { completedModules: {} }); // Initialize empty progress
      }
    }
    setLoading(false); // ✅ Set loading to false when Firestore fetch is done
  });

  return () => unsubscribe();
}, []);
useEffect(() => {
  if(!user){
    setIsLoginOpen(true);
  }
}, [user])
useEffect(() => {
  if(user){
    setIsLoginOpen(false);
  }
}, [user])

  // ✅ Count completed modules per sub-topic (Statistics, Matrix)
  const countCompletedInCategory = (category) => {
    const total = category.modules.length;
    const completed = category.modules.filter(module => completedModules[module.id] === "completed").length;
    console.log(category.title, total)
    return (completed * 100)/total;
  };

  console.log(countCompletedInCategory({
    title:"Calculus in AI and ML",
    modules: [
      {id: "diff_calc_part_deriv", title:"Differential Calculus and Partial Derivatives", description: "Differential calculus enables AI/ML models to optimize functions, compute gradients, and enhance learning efficiency, while Partial derivatives measure how a function changes with respect to one variable"},
      {id: "gradients_desc", title:"Gradients and Gradient Descent", description: "Gradient descent is a numerical method for iteratively minimizing a function by repeatedly taking steps in the direction of the negative gradient. "},
    ]
  },))
  const countTotalCompleted = () => {
    var all = 0;
    var sum = 0;
    var sum2 = 0;
    pythonCategories.map((topic) => {
      const category = topic;
      const completed = category.modules.filter(module => completedModules[module.id] == "completed").length;
      const skipped = category.modules.filter(module => completedModules[module.id] == "skipped").length
      sum = sum + completed;
      sum2 = sum2 + skipped;
      all = all + category.modules.length;
    })
    return [sum, sum2, all];
  }

  const completedPercentage = (countTotalCompleted()[0] / countTotalCompleted()[2]) * 100
  return (
  <div className="min-h-screen bg-gray-50 text-gray-800">
    <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} login={() => setIsLoginOpen(true)}  className="relative flex z-50"/>
    <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}  signup={() => {setIsSignupOpen(true)}} className="relative flex z-50"/>
    <header className="z-50">
      <Navbar />
    </header>

    <section className="">
      <div className="bg-blue-700 p-6 mb-[80px] pb-[60px]">
      <h2 className="text-[40px] font-extrabold text-center mb-3 text-white mt-[30px]">Python Prerequisites</h2>
      <div className="flex justify-center mb-8">
      <p className="text-[#dbdbdb] w-[800px] text-center ">Python is a powerful, beginner-friendly programming language used in everything from web development to AI.
Its clean syntax and vast libraries make it perfect for fast, efficient coding.</p></div>
      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-black mb-[20px] text-center">Modules Progress</h2>
    <br />
      

      {!loading && <div className="mt-4 text-gray-700 font-medium flex justify-center">
        <div className="flex flex-col items-center mr-[30px]"> 
          <p className="bg-[#9cf7b4] w-[70px] h-[70px] rounded-[100%] text-[#0a8a2b] text-[30px] font-bold flex items-center justify-center">{countTotalCompleted()[0]} </p> 
          <p className="text-[#0a8a2b] font-bold">COMPLETED</p> 
          
        </div>
        <div className="flex flex-col items-center mr-[30px]"> 
          <p className="bg-blue-50 w-[70px] h-[70px] rounded-[100%] text-blue-800 text-[30px] font-bold flex items-center justify-center">{countTotalCompleted()[1]} </p> 
          
          <p className=" text-blue-800 font-bold text-center">SKIPPED</p> 
          
        </div>
        <div className="flex flex-col items-center"> 
          <p className="bg-[#e3e3e3] w-[70px] h-[70px] rounded-[100%] text-[#000] text-[30px] font-bold flex items-center justify-center">{countTotalCompleted()[2] - countTotalCompleted()[0] - countTotalCompleted()[1]} </p> 
          <p className=" text-[#000] font-bold">NOT STARTED</p> 
          
        </div>
      </div>}
      {loading && 
        <div className="flex justify-center">
        <Atom color="black" size="medium" text="" textColor="" />
        </div>
      }
      <br /> <br /> 
      <div className="w-full bg-gray-200 rounded-lg overflow-hidden">
        <div
          className="bg-green-500 text-xs font-medium text-white text-center p-1"
          style={{ width: `${completedPercentage}%` }}
        >
        </div>
      </div>
    </div>
    </div>

      {user && !loading && (
        <div className="max-w-7xl mx-auto flex flex-col gap-10 px-4"> {/* Added max-w-7xl mx-auto and px-4 for padding */}
          {pythonCategories.map((category, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center md:items-start pb-[50px] border-b-1 justify-center"> {/* Centered content */}
              
              {/* 🔹 Topic Titles Aligned on the Left (or top in small screens) */}
              <div className="w-full md:w-[250px] flex-shrink-0 text-center md:text-left mb-4 md:mb-0"> {/* Adjusted for centering */}
                <h3 className={`text-2xl font-bold mb-4 ${countCompletedInCategory(category) === 100 ? "line-through text-[#979899]" : ""}`}>
                  {category.title}
                </h3>
                <Progress value={countCompletedInCategory(category)} className="w-full" />
              </div>

              {/* 🔹 Modules are aligned on the same vertical line */}
              <div className="flex flex-col items-center md:items-start flex-grow md:ml-[5%] w-full"> {/* Adjusted for centering */}
                {category.modules.map((module, idx) => (
                  <div key={idx} className="w-full flex flex-col items-center"> {/* Wrap each module with a div for centering */}
                    <div className="flex flex-col md:flex-row items-center w-full max-w-[800px] space-x-0 md:space-x-4 mb-4"> {/* Adjusted max-w and spacing */}
                      <div className="w-full hover:shadow-md cursor-pointer p-6 rounded-md text-center md:text-left" onClick={() => {
                        router.push(`/${module.id}`)
                      }}>
                        <div className="flex items-center gap-1 justify-center md:justify-start"> {/* Centered for smaller screens */}
                        <h4 className={`text-xl font-semibold ${completedModules[module.id] == "completed" ? "line-through text-[#979899]" : ""}`}>
                          {module.title} 
                        </h4>
                        {completedModules[module.id] == "skipped" && <p>(Skipped)</p>}
                        </div>
                        <p className={`text-gray-600 ${completedModules[module.id] == "completed" ? "line-through text-[#979899]" : ""}`}>
                          {module.description}
                        </p>
                      </div>
                      <button className={`text-[30px] flex-shrink-0 mt-2 md:mt-0 ${completedModules[module.id] == "completed" ? "text-green-500" : "text-gray-400"}`}> {/* Adjusted button positioning */}
                        <SiTicktick />
                      </button>
                    </div>
                    {idx < category.modules.length - 1 && <Image src={img} width={5} height={1} alt="line" className="my-2" />} {/* Added margin */}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      
    </section>
  </div>
);

};

export default GuidePage;