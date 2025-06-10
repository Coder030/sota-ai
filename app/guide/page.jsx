"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { db, auth, doc, getDoc, setDoc, updateDoc, onAuthStateChanged } from "../firebase";
import Image from "next/image";
import img from "../../public/conn.png";
import { SiTicktick } from "react-icons/si";

const guideCategories = [
  {
    title: "Getting Started",
    modules: [
      { id: "intro_ai", title: "Introduction to AI", description: "Learn the basics of AI." },
      { id: "python_ai", title: "Python for AI", description: "Use Python to build AI models." },
      { id: "ml_basics", title: "Machine Learning Basics", description: "Understand how machines learn from data." },
    ],
  },
  {
    title: "Lorem Ipsum",
    modules: [
      { id: "neural_networks", title: "Neural Networks", description: "Dive into deep learning architectures." },
      { id: "optimization_strategies", title: "Optimization Strategies", description: "Improve AI efficiency using smart techniques." },
    ],
  },
];

const GuidePage = () => {
  const [user, setUser] = useState(null);
  const [completedModules, setCompletedModules] = useState({});

  // ✅ Handle Authentication & Fetch Progress
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);

      if (authUser) {
        const docRef = doc(db, "users", authUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("HEllo!!!!", docSnap.data())
          setCompletedModules(docSnap.data().completedModules || {});
        } else {
          console.log("HEY!")
          await setDoc(docRef, { completedModules: {} }); // Initialize empty progress
        }
      }
    }, [user]);

    return () => unsubscribe(); // Cleanup auth listener
  }, []);

  // ✅ Mark Module as Completed (Firestore Update)
  const markModuleAsCompleted = async (moduleId) => {
    if (!user) return;

    try {
      const docRef = doc(db, "users", user.uid);
      let updatedModules = { ...completedModules, [moduleId]: true };

      await updateDoc(docRef, { completedModules: updatedModules });
      setCompletedModules(updatedModules);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="z-50">
        <Navbar />
      </header>

      <section className="py-16 px-6 md:px-20">
        <h2 className="text-4xl font-bold text-center mb-8">AI & ML Guide</h2>
        <p className="max-w-2xl mx-auto text-lg mb-12 text-center">
          Follow a structured learning path with modules connected visually.
        </p>

        {user &&<div className="space-y-12 ml-[2%] sm:ml-[10%]">
          {guideCategories.map((category, index) => (
            <div key={index} className="flex p-6 rounded-lg border-b-1">
              <h3 className="text-2xl font-bold mb-4 mr-[60px]">{category.title}</h3>

              <div className="flex flex-col items-start">
                {category.modules.map((module, idx) => (
                  <div key={idx} className="flex flex-col items-start w-[800px]">
                    <div className="flex items-start relative">
                      <div className="w-full mr-[30px]">
                        <h4 className={`text-xl font-semibold ${completedModules[module.id] ? "line-through text-[#979899]" : ""}`}>{module.title}</h4>
                        <p className={`text-gray-600 ${completedModules[module.id] ? "line-through text-[#979899]" : ""}`}>{module.description}</p>
                      </div>
                      <button
                        className={`text-[30px] ${
                          completedModules[module.id] ? "text-green-500" : "text-gray-400"
                        }`}
                      >
                        <SiTicktick />
                      </button>
                    </div>
                    {idx < category.modules.length - 1 && <Image src={img} width={5} height={1} alt="line" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>}
      </section>
    </div>
  );
};

export default GuidePage;
