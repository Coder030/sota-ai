"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase";
import { FiMenu, FiX } from "react-icons/fi";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

const topics = [
  "Mathematical Prerequisites",
  "Python Prerequisites",
  "Classical Machine Learning",
  "Deep Learning",
  "Natural Language Processing",
  "Computer Vision",
];

function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [flag, setFlag] = useState(false);
  const [currentName, setCurrentName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(""); // Default topic selection

  const navLinks = [
    { name: "Our Team", path: "/team" },
    { name: "Lectures", path: "/lectures" },
  ];

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFlag(true);
        setCurrentName(user.displayName || user.email.split("@")[0]);
      } else {
        setFlag(false);
        setCurrentName("");
      }
    });

    return () => unsubscribe();
  }, [pathname]);

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleTopicChange = (e) => {
    const topic = e.target.value;
    setSelectedTopic(topic);

    if (topic === "Mathematical Prerequisites") {
      router.push("/math"); // Redirects to /math
    }
  };

  return (
    <header className="relative z-50 bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} login={() => setIsLoginOpen(true)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} signup={() => setIsSignupOpen(true)} />

      {/* Logo */}
      <h1 className="text-2xl font-bold text-indigo-600">
        <Link href="/">SOTA - AI</Link>
      </h1>
      
      {/* Desktop Navbar */}
      <nav className="hidden sm:flex space-x-8 items-center">
        <select className="p-2 border rounded-md text-gray-700" value={selectedTopic} onChange={handleTopicChange}>
      <option value="" disabled>Select your topic</option>
      {topics.map((topic, idx) => (
        <option key={idx} value={topic}>{topic}</option>
      ))}
    </select>
        {navLinks.map(({ name, path }) => (
          <Link
            key={path}
            href={path}
            className={`text-[18px] font-medium transition hover:underline ${
              pathname === path ? "underline text-black" : "text-gray-500"
            }`}
          >
            {name}
          </Link>
        ))}

      

        {/* 🔹 User Authentication */}
        {!flag ? (
          <>
            <button className="text-indigo-600 font-semibold text-[16px] hover:underline" onClick={() => setIsLoginOpen(true)}>
              LOG IN
            </button>
            <button className="ml-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700" onClick={() => setIsSignupOpen(true)}>
              SIGN UP
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 ml-4">
            <div className="bg-indigo-600 text-white rounded-full w-[40px] h-[40px] flex items-center justify-center text-lg">
              {currentName.charAt(0).toUpperCase()}
            </div>
            <p className="text-[16px]">{currentName}</p>
          </div>
        )}
      </nav>

      {/* 🔹 Mobile Menu Toggle */}
      <div className="sm:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX /> : <FiMenu />}
      </div>

      {/* 🔹 Mobile Menu Drawer */}
      {menuOpen && (
        <div className="absolute top-[72px] left-0 w-full bg-white shadow-lg sm:hidden flex flex-col items-center p-4 z-50">
          {navLinks.map(({ name, path }) => (
            <Link
              key={path}
              href={path}
              className={`text-[18px] py-2 w-full text-center ${
                pathname === path ? "text-indigo-600 font-semibold" : "text-gray-700"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {name}
            </Link>
          ))}

          {/* 🔹 Mobile Dropdown */}
          <select
            className="mt-4 p-2 border rounded-md w-full text-gray-700"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            {topics.map((topic, idx) => (
              <option key={idx} value={topic}>{topic}</option>
            ))}
          </select>

          {!flag ? (
            <div className="flex flex-col w-full mt-4 gap-2">
              <button className="text-indigo-600 w-full text-center py-2 rounded hover:underline" onClick={() => setIsLoginOpen(true)}>
                LOG IN
              </button>
              <button className="bg-indigo-600 text-white w-full py-2 rounded-md hover:bg-indigo-700" onClick={() => setIsSignupOpen(true)}>
                SIGN UP
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center mt-4">
              <div className="bg-indigo-600 text-white rounded-full w-[40px] h-[40px] flex items-center justify-center text-lg mb-2">
                {currentName.charAt(0).toUpperCase()}
              </div>
              <p className="text-[16px]">{currentName}</p>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
