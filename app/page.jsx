"use client";

import React from "react";
import { useRef, useState, useEffect} from "react";
import Navbar from "./components/navbar";
import Link from "next/link";
import { useEmblaAutoplay } from "@/lib/useEmblaAutoplay";
import { IoPersonSharp } from "react-icons/io5";
import { FaBookOpen, FaPenAlt, FaLaptopCode, FaRocket, FaLightbulb } from "react-icons/fa";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SignupModal from "./components/SignupModal";

import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import LoginModal from "./components/LoginModal";

function RotatingSphere() {
  const sphereRef = useRef()

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.008 // Only Y-axis rotation
    }
  })

  return (
    <mesh ref={sphereRef} position={[0, 1.1, 0]}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial color="#c2c2c2" wireframe opacity={0.2} transparent />
    </mesh>
  )
}


const cards = [
  {
    icon: <IoPersonSharp />,
    title: "Personal Mentorship",
    text: "1-on-1 guidance from peers who’ve already mastered the basics.",
  },
  {
    icon: <FaBookOpen />,
    title: "Curated Material",
    text: "Hand-picked, student-friendly content for every learning level.",
  },
  {
    icon: <FaPenAlt />,
    title: "Projects & Practice",
    text: "Mini-projects and problems that build real skills step-by-step.",
  },
  {
    icon: <FaLaptopCode />,
    title: "Code Along",
    text: "Write, run, and test code live as you learn the concepts.",
  },
  {
    icon: <FaRocket />,
    title: "Fast-Paced Tracks",
    text: "Get bootcamp-style learning without the bootcamp burnout.",
  },
  {
    icon: <FaLightbulb />,
    title: "Beginner to Builder",
    text: "From zero to AI — we help you build your first working model.",
  },
  {
    icon: <FaBookOpen />,
    title: "Learning that Sticks",
    text: "Every lesson ends with a quiz, recap, or challenge.",
  },
  {
    icon: <FaPenAlt />,
    title: "Built by Students",
    text: "Made by high-schoolers who know what actually works.",
  },
];


import { usePathname, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase"; 

const HomePage = () => {
  const router = useRouter()
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [flag, setFlag] = useState(false);

   useEffect(() => {
      const auth = getAuth(app);
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setFlag(true);
        } else {
          setFlag(false);
        }
      });
  
      return () => unsubscribe();
    });
  const autoplay = useEmblaAutoplay();
  return (
    <>
    <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 2, 5]} />
          <RotatingSphere />
        </Canvas>
      </div>
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="z-50">

      <Navbar />
      </header>
      {/* Hero Section */}
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} login={() => setIsLoginOpen(true)}  className="relative flex z-50"/>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}  signup={() => {setIsSignupOpen(true)}} className="relative flex z-50"/>
      <section className="text-center py-30 bg-gradient-to-r from-white to-grey text-black border-b-1">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          A Highschooler's Guide to AI - ML
        </h2>
        <p className="max-w-2xl mx-auto text-lg mb-6">
          Learn Artificial Intelligence and Machine Learning — taught by
          students, for students.
        </p>
        {!flag && <div className="relative z-49">
            <button
              className="bg-black text-white font-semibold px-6 py-2 rounded-full transition"
              onClick={() => setIsSignupOpen(true)}
            >
              Get Started
            </button>
          </div>}
      </section>

      {/* About Section */}
      <section className="py-16 px-6 md:px-20 bg-grey">
        <h3 className="text-3xl font-bold text-center mb-6">
          Why Choose SOTA - AI?
        </h3>
        <p className="text-[17px] text-center text-gray-600 mb-10">
          At SOTA - AI, we break down the complex into the doable, guiding you
          with mentorship that walks your pace.
        </p>
        <div className="flex justify-center">
          <Carousel
            opts={{ align: "start" }}
            plugins={[autoplay]}
            className="w-fit"
          >
            <CarouselContent>
              {cards.map((card, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center text-center p-6  h-[150px]">
                        <div className="text-2xl mb-3">
                        {card.icon} 
                        </div>
                        <h4 className="text-[23px] font-semibold mb-2">
                          {card.title}
                        </h4>
                        <p className="text-sm text-gray-600">{card.text}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    </div>
    </>
  );
};

export default HomePage;
