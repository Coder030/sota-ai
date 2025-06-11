"use client";

import React, { useEffect, useRef, useState } from "react";
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

const TopicCard = React.forwardRef(({ title, description, link, isEven }, ref) => {
  const router = useRouter();
  return (
    <div
      ref={ref}
      className={`
        relative w-72 p-6 bg-white rounded-lg shadow-md hover:shadow-lg 
        transition-transform hover:scale-105 hover:cursor-pointer 
        ${isEven ? "self-start ml-8" : "self-end mr-8"}
      `}
      onClick={() => router.push(link)}
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
});
TopicCard.displayName = "TopicCard";

const TopicsGrid = () => {
  const cardRefs = useRef([]);
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const newLines = [];

    const containerRect = containerRef.current.getBoundingClientRect();

    for (let i = 0; i < cardRefs.current.length - 1; i++) {
      const from = cardRefs.current[i].getBoundingClientRect();
      const to = cardRefs.current[i + 1].getBoundingClientRect();

      const fromX = from.left + from.width / 2 - containerRect.left;
      const fromY = from.top + from.height / 2 - containerRect.top;
      const toX = to.left + to.width / 2 - containerRect.left;
      const toY = to.top + to.height / 2 - containerRect.top;

      const midY = (fromY + toY) / 2;

      // Vertical down from source card
      newLines.push({ x1: fromX, y1: fromY, x2: fromX, y2: midY });

      // Horizontal across to destination X
      newLines.push({ x1: fromX, y1: midY, x2: toX, y2: midY });

      // Vertical down to destination card center
      newLines.push({ x1: toX, y1: midY, x2: toX, y2: toY });
    }

    setLines(newLines);
  }, []);

  return (
    <>
      <Navbar />
      <div>
        <h1 className="text-4xl font-extrabold mt-[60px] mb-8 text-center">
          AI-ML Guide's sections :
        </h1>
        <p className="max-w-3xl mx-auto text-center text-gray-700 mb-12 text-[20px]">
          This guide will help you build a strong foundation in AI and ML, covering essential concepts step by step. Explore each section to deepen your understanding and apply knowledge to real-world projects.
        </p>

        {/* 🧱 CONTAINER that scrolls */}
        <div ref={containerRef} className="relative">
          {/* 📐 SVG lines that scroll with content */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            {lines.map((line, i) => (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="gray"
                strokeWidth="2"
              />
            ))}
          </svg>

          {/* 🎴 Topic Cards */}
          <div className="relative flex flex-col items-center space-y-20 p-8 px-[10%] z-10">
            {topics.map((topic, index) => {
              const isEven = index % 2 === 0;
              return (
                <TopicCard
                  key={index}
                  {...topic}
                  isEven={isEven}
                  ref={(el) => (cardRefs.current[index] = el)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopicsGrid;
