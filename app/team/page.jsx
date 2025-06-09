import React from 'react'
import Navbar from '../components/navbar'
import Link from 'next/link'
import Image from 'next/image'

const teamMembers = [
  {
    name: "Kartik Garg",
    photo: "../favicon.ico",
    kaggle: "https://www.kaggle.com/bigochampion",
    linkedin: "https://www.linkedin.com/in/kartik-garg-b02938305/",
    github: "https://github.com/Coder030",
  },
  {
    name: "Savyasachi",
    photo: "../favicon.ico",
    kaggle: "https://www.kaggle.com/",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    name: "Aarav Sharma",
    photo: "../favicon.ico",
    kaggle: "https://www.kaggle.com/",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
]

function Team() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="max-w-7xl mx-auto px-[120px]">
        <h1 className="text-4xl font-extrabold text-indigo-600 mt-[60px] mb-8 text-center">
          Meet Our Team
        </h1>

        <p className="max-w-3xl mx-auto text-center text-gray-700 mb-12 text-[20px]">
          The minds behind SOTA - AI: A bunch of high schoolers, building SOTA AI from the ground up.
        </p>
        <br /><br />
        {/* Founders */}
        <p className='font-bold text-[30px]'>Our Team :</p>
        <br /><br />
        <div className="flex flex-wrap gap-[5px]">
          {teamMembers.map((founder, index) => (
            <div key={index} className="group w-fit p-4 px-[30px] rounded-2xl bg-white hover:shadow-lg transition-all duration-300 pb-0 mr-[20px]">
              <div className="flex flex-col items-center justify-center h-full">
                <img
                  src={founder.photo}
                  alt={founder.name}
                  className="w-25 h-25 rounded-full mb-3 mt-2"
                />
                <h2 className="text-[25px] font-semibold text-center mb-[5px]">{founder.name}</h2>

                {/* Hover Info Below Name */}
                <div className="flex flex-col items-center mt-4 transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto h-[60px]">
                  <div className="flex items-center gap-3">
                    {/* LinkedIn Icon */}
                    <a href={founder.linkedin} target="_blank" rel="noopener noreferrer">
                      <img src="/linkedin.png" alt="LinkedIn" className="w-8 h-8" />
                    </a>

                    {/* GitHub Icon */}
                    <a href={founder.github} target="_blank" rel="noopener noreferrer">
                      <img src="/github.png" alt="GitHub" className="w-8 h-8" />
                    </a>

                    <a href={founder.kaggle} target="_blank" rel="noopener noreferrer">
                      <img src="/kaggle.png" alt="LinkedIn" className="w-8 h-8" />
                    </a>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        <br />
      </section>
    </div>
  );
}

export default Team;
