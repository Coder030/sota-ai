"use client";

import React from "react";
import Navbar from "../components/navbar";
import { Card, CardContent } from "../../components/ui/card";
import Image from "next/image";
import img from "../../public/conn.png";
import { SiTicktick } from "react-icons/si";



const guideCategories = [
  {
    title: "Getting Started",
    modules: [
      { title: "Introduction to AI", description: "Learn the basics of artificial intelligence." },
      { title: "Python for AI", description: "Use Python to build AI models." },
      { title: "Machine Learning Basics", description: "Understand how machines learn from data." },
    ],
  },
  {
    title: "Complete Search",
    modules: [
      { title: "Neural Networks", description: "Dive into deep learning architectures." },
      { title: "Optimization Strategies", description: "Improve AI efficiency using smart techniques." },
    ],
  },
  {
    title: "Sorting & Sets",
    modules: [
      { title: "Data Structures in AI", description: "Using structured data for better AI performance." },
      { title: "Optimizing Algorithms", description: "Learn advanced algorithm techniques." },
      { title: "AI Applications", description: "Real-world implementations of AI." },
    ],
  },
];

const GuidePage = () => {
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

        <div className="space-y-12 ml-[2%] sm:ml-[10%]">
          {guideCategories.map((category, index) => (
            <div key={index} className="flex p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 mr-[100px]">{category.title}</h3>

              <div className="flex flex-col items-start ">
                {category.modules.map((module, idx) => (
                  <div key={idx} className="flex flex-col items-start w-[800px]">
                     <Image src={img} width={5} height={1} alt="line"/>
                    <br />
                    <div className="flex  items-start relative">                    

                    {/* Module Card */}
                    <div className="w-full mr-[30px]">
                      
                        <h4 className="text-xl font-semibold">{module.title}</h4>
                        <p className="text-gray-600">{module.description}</p>
                    </div>
                    <div className="text-[#00FF00] text-[30px]">
                    <SiTicktick />
                    </div>
                    </div>
                    <br />
                   
                  
                  
                  
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GuidePage;
