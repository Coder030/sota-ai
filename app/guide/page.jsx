"use client"

import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";

const topics = [
  {
    title: "Mathematical Prerequisites",
    description: "Understand essential math concepts for machine learning.",
    link: "/math",
  },
  {
    title: "Python Prerequisites",
    description: "Learn the basics of Python needed for ML development.",
    link: "/python-prerequisites",
  },
  {
    title: "Classical Machine Learning",
    description: "Explore algorithms like regression, decision trees, and clustering.",
    link: "/classical-ml",
  },
  {
    title: "Deep Learning",
    description: "Dive into neural networks and deep learning architectures.",
    link: "/deep-learning",
  },
  {
    title: "Natural Language Processing",
    description: "Work with text data and implement language models.",
    link: "/nlp",
  },
  {
    title: "Computer Vision",
    description: "Process and analyze visual data using AI models.",
    link: "/computer-vision",
  },
];

const TopicCard = ({ title, description, link, index }) => {
  const isEven = index % 2 === 0;
  const router = useRouter();
  return (
    <div className={`relative w-72 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-transform hover:scale-105 hover:cursor-pointer
      ${isEven ? "self-start ml-8" : "self-end mr-8"}`
    } onClick={() => {router.push(link)}}>
      {/* <a href={link}> */}
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
      {/* </a> */}
      {/* Diagonal Line using ::after */}
      {index < topics.length - 1 && (
        <div className={`absolute w-50 h-1 bg-gray-400 
          ${isEven ? "right-[-12rem] top-[113%] rotate-[13deg]" : "left-[-12rem] top-[113%] rotate-[-13deg]"}`
        } />
      )}
    </div>
  );
};

const TopicsGrid = () => (
  <>
  <Navbar />
  <div>
    <h1 className="text-4xl font-extrabold mt-[60px] mb-8 text-center">
          AI-ML Guide's sections : 
        </h1>
        <p className="max-w-3xl mx-auto text-center text-gray-700 mb-12 text-[20px]">
          This guide will help you build a strong foundation in AI and ML, covering essential concepts step by step. Explore each section to deepen your understanding and apply knowledge to real-world projects.
        </p>
  <div className="flex flex-col items-center space-y-8 p-8 px-[300px]">
    {topics.map((topic, index) => (
      <TopicCard key={index} {...topic} index={index} />
    ))}
  </div>
  </div>
  </>
);

export default TopicsGrid;
