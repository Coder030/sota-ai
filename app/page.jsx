import React from 'react';
import Navbar from './components/navbar';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Master AI & ML with High-School Mentors</h2>
        <p className="max-w-2xl mx-auto text-lg">Learn Artificial Intelligence and Machine Learning — taught by students, for students.</p>
        <div className="mt-6">
          <button className="bg-white text-indigo-600 font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition">
            Get Started
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 md:px-20 bg-grey">
        <h3 className="text-3xl font-bold text-center mb-6">Why Choose SOTA - AI?</h3>
        <p className="text-[17px] text-center text-gray-600 mb-10">
          At SOTA - AI, we break down the complex into the doable, guiding you with mentorship that walks your pace.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow p-6">
            <h4 className="font-bold text-[25px] mb-2">Personal Mentorship</h4>
            <p className="text-[17px] text-gray-600">One-on-one guidance from high-schoolers who’ve already walked the path — from basics to building real-world projects.</p>
          </div>
          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow p-6">
            <h4 className="font-bold text-[25px] mb-2">Curated Learning Material</h4>
            <p className="text-[17px] text-gray-600">We hand-pick the best resources from the web — structured into simple, progressive modules. From beginner Python to building neural nets, we’ve got you.</p>
          </div>
          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow p-6">
            <h4 className="font-bold text-[25px] mb-2">Practice Problems & Projects</h4>
            <p className="text-[17px] text-gray-600">Theory is nothing without hands-on practice. Solve challenge problems, complete real mini-projects, and get instant feedback to level up your skills.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
