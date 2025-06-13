"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar"; // Assuming Navbar is correctly imported

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
        ${isEven ? "md:self-start md:ml-8" : "md:self-end md:mr-8"} 
        self-center mx-auto // Center cards on smaller screens
        min-h-[150px] flex flex-col justify-between // Ensure consistent height and better spacing
      `}
      onClick={() => router.push(link)}
    >
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>
      {/* You could add a "Learn More" button here for better UX */}
    </div>
  );
});
TopicCard.displayName = "TopicCard";

const TopicsGrid = () => {
  const cardRefs = useRef([]);
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);

  // Recalculate lines on window resize to ensure responsiveness
  useEffect(() => {
    const calculateAndSetLines = () => {
      const newLines = [];
      if (!containerRef.current || cardRefs.current.some(ref => !ref)) {
        setLines([]); // Clear lines if refs are not ready
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();

      for (let i = 0; i < topics.length - 1; i++) { // Iterate based on topics length for robustness
        const from = cardRefs.current[i].getBoundingClientRect();
        const to = cardRefs.current[i + 1].getBoundingClientRect();

        const fromX = from.left + from.width / 2 - containerRect.left;
        const fromY = from.top + from.height / 2 - containerRect.top;
        const toX = to.left + to.width / 2 - containerRect.left;
        const toY = to.top + to.height / 2 - containerRect.top;

        // Determine the horizontal direction based on card positions
        const isEvenFrom = i % 2 === 0;
        const isEvenTo = (i + 1) % 2 === 0;

        let startX = fromX;
        let endX = toX;

        // Adjust horizontal segments based on card parity for better flow
        if (window.innerWidth >= 768) { // Apply complex line logic only for medium screens and up
          if (isEvenFrom) { // Start card is left aligned
            newLines.push({ x1: fromX, y1: fromY, x2: fromX, y2: toY > fromY ? fromY + (toY - fromY) / 2 : fromY - (fromY - toY) / 2 }); // Vertical down/up
            newLines.push({ x1: fromX, y1: toY > fromY ? fromY + (toY - fromY) / 2 : fromY - (fromY - toY) / 2, x2: toX, y2: toY > fromY ? fromY + (toY - fromY) / 2 : fromY - (fromY - toY) / 2 }); // Horizontal
            newLines.push({ x1: toX, y1: toY > fromY ? fromY + (toY - fromY) / 2 : fromY - (fromY - toY) / 2, x2: toX, y2: toY }); // Vertical to next card
          } else { // Start card is right aligned
            newLines.push({ x1: fromX, y1: fromY, x2: fromX, y2: toY > fromY ? fromY + (toY - fromY) / 2 : fromY - (fromY - toY) / 2 }); // Vertical down/up
            newLines.push({ x1: fromX, y1: toY > fromY ? fromY + (toY - fromY) / 2 : fromY - (fromY - toY) / 2, x2: toX, y2: toY > fromY ? fromY + (toY - fromY) / 2 : fromY - (fromY - toY) / 2 }); // Horizontal
            newLines.push({ x1: toX, y1: toY > fromY ? fromY + (toY - fromY) / 2 : fromY - (fromY - toY) / 2, x2: toX, y2: toY }); // Vertical to next card
          }
        } else { // Simpler vertical line for smaller screens
          newLines.push({ x1: fromX, y1: fromY, x2: toX, y2: toY });
        }
      }
      setLines(newLines);
    };

    calculateAndSetLines(); // Initial calculation
    window.addEventListener("resize", calculateAndSetLines); // Recalculate on resize

    // Observe changes in the DOM, specifically for the cards, to recalculate lines
    const observer = new MutationObserver(calculateAndSetLines);
    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true });
    }

    return () => {
      window.removeEventListener("resize", calculateAndSetLines);
      observer.disconnect();
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  // Re-calculate lines when cards might have rendered/re-rendered
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Small delay to ensure all DOM elements are rendered
      const calculateAndSetLines = () => {
        const newLines = [];
        if (!containerRef.current || cardRefs.current.some(ref => !ref)) {
          setLines([]);
          return;
        }

        const containerRect = containerRef.current.getBoundingClientRect();

        for (let i = 0; i < topics.length - 1; i++) {
          const from = cardRefs.current[i].getBoundingClientRect();
          const to = cardRefs.current[i + 1].getBoundingClientRect();

          const fromX = from.left + from.width / 2 - containerRect.left;
          const fromY = from.top + from.height / 2 - containerRect.top;
          const toX = to.left + to.width / 2 - containerRect.left;
          const toY = to.top + to.height / 2 - containerRect.top;

          if (window.innerWidth >= 768) {
            // Complex Z-shaped line for larger screens
            const midY = (fromY + toY) / 2;
            newLines.push({ x1: fromX, y1: fromY, x2: fromX, y2: midY }); // Vertical from source
            newLines.push({ x1: fromX, y1: midY, x2: toX, y2: midY });     // Horizontal across
            newLines.push({ x1: toX, y1: midY, x2: toX, y2: toY });       // Vertical to destination
          } else {
            // Simple straight line for smaller screens
            newLines.push({ x1: fromX, y1: fromY, x2: toX, y2: toY });
          }
        }
        setLines(newLines);
      };
      calculateAndSetLines();
    }, 100); // A small delay to allow cards to render

    return () => clearTimeout(timeoutId);
  }, [topics]); // Re-run when topics data changes

  return (
    <>
      <Navbar />
      <h1 className="text-4xl font-extrabold mt-[60px] mb-8 text-center">

AI-ML Guide's sections :

</h1>

<p className="max-w-3xl mx-auto text-center text-gray-700 mb-12 text-[20px]">

This guide will help you build a strong foundation in AI and ML, covering essential concepts step by step. Explore each section to deepen your understanding and apply knowledge to real-world projects.

</p>

        {/* 🧱 CONTAINER that scrolls */}
        <div ref={containerRef} className="relative max-w-6xl mx-auto"> {/* Constrain width and center */}
          {/* 📐 SVG lines that scroll with content */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible"> {/* overflow-visible might be needed */}
            {lines.map((line, i) => (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="gray"
                strokeWidth="2"
                className="transition-all duration-300 ease-out" // Smooth line transitions
              />
            ))}
          </svg>

          {/* 🎴 Topic Cards */}
          <div className="relative flex flex-col items-center space-y-20 p-8 px-[5%] md:px-[10%] lg:px-[15%] z-10">
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
    </>
  );
};

export default TopicsGrid;