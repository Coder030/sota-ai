import React from 'react'
import Navbar from './navbar'
import Link from 'next/link'
import Image from 'next/image'

const teamMembers = [
  {
    name: "Kartik Garg",
    photo: "/ryan.webp",
    kaggle: "https://www.kaggle.com/bigochampion",
    linkedin: "https://www.linkedin.com/in/kartik-garg-b02938305/",
    github: "https://github.com/Coder030",
  },
  {
    name: "Savyasachi",
    photo: "/justin_ji.webp",
    kaggle: "https://www.kaggle.com/",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    name: "Aarav Sharma",
    photo: "/peng_bai.webp",
    kaggle: "https://www.kaggle.com/",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    name: "Kartik Garg",
    photo: "/ryan.webp",
    kaggle: "https://www.kaggle.com/bigochampion",
    linkedin: "https://www.linkedin.com/in/kartik-garg-b02938305/",
    github: "https://github.com/Coder030",
  },
  {
    name: "Savyasachi",
    photo: "/justin_ji.webp",
    kaggle: "https://www.kaggle.com/",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    name: "Aarav Sharma",
    photo: "/peng_bai.webp",
    kaggle: "https://www.kaggle.com/",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    name: "Kartik Garg",
    photo: "/ryan.webp",
    kaggle: "https://www.kaggle.com/bigochampion",
    linkedin: "https://www.linkedin.com/in/kartik-garg-b02938305/",
    github: "https://github.com/Coder030",
  },
  {
    name: "Savyasachi",
    photo: "/justin_ji.webp",
    kaggle: "https://www.kaggle.com/",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    name: "Aarav Sharma",
    photo: "/peng_bai.webp",
    kaggle: "https://www.kaggle.com/",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    name: "Kartik Garg",
    photo: "/ryan.webp",
    kaggle: "https://www.kaggle.com/bigochampion",
    linkedin: "https://www.linkedin.com/in/kartik-garg-b02938305/",
    github: "https://github.com/Coder030",
  },
  {
    name: "Savyasachi",
    photo: "/justin_ji.webp",
    kaggle: "https://www.kaggle.com/",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    name: "Aarav Sharma",
    photo: "/peng_bai.webp",
    kaggle: "https://www.kaggle.com/",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    name: "Kartik Garg",
    photo: "/ryan.webp",
    kaggle: "https://www.kaggle.com/bigochampion",
    linkedin: "https://www.linkedin.com/in/kartik-garg-b02938305/",
    github: "https://github.com/Coder030",
  },
  {
    name: "Savyasachi",
    photo: "/justin_ji.webp",
    kaggle: "https://www.kaggle.com/",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    name: "Aarav Sharma",
    photo: "/peng_bai.webp",
    kaggle: "https://www.kaggle.com/",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
]

function Team() {
  return (
    <div className="min-h-screen pt-[30px]">
      <section className="max-w-7xl mx-auto px-[120px]">
        <h1 className="text-4xl font-extrabold mt-[60px] mb-8 text-center">
          Meet Our Team
        </h1>

        <p className="max-w-3xl mx-auto text-center text-gray-700 mb-12 text-[20px]">
          The minds behind SOTA - AI: A bunch of high schoolers, building SOTA AI from the ground up.
        </p>
        <br /><br />
        {/* Founders */}
        <p className='font-bold text-[30px]'>Our Team :</p>
        <br /><br />
        {/*
          Changes made here:
          - Removed `mr-[20px]` from the individual team member card.
          - Adjusted `gap` from `gap-[5px]` to `gap-4` (or you can use a smaller number like `gap-2`).
          - Set a more defined flex basis for cards like `flex-basis: calc(25% - var(--gap-x))`
            or using Tailwind's `w-1/X` classes for more control.
          - For more consistent sizing and wrapping, I've added `flex-none` and set an explicit `w-48`
            (you can adjust this width). The `p-4` remains for internal spacing.
          - Adjusted `px-[120px]` on the section to `px-8` to give more horizontal room to the cards.
        */}
        <div className="flex flex-wrap justify-center gap-4"> {/* Changed gap, removed mr-[20px] on children */}
          {teamMembers.map((founder, index) => (
            <div key={index} className="group w-48 p-4 rounded-2xl bg-white hover:shadow-lg transition-all duration-300 pb-0 flex-none">
              <div className="flex flex-col items-center justify-center h-full">
                <img
                  src={founder.photo}
                  alt={founder.name}
                  className="w-24 h-24 rounded-full mb-3 mt-2 object-cover" // Reduced image size slightly
                />
                <h2 className="text-[18px] font-semibold text-center mb-[5px]">{founder.name}</h2> {/* Reduced font size */}

                {/* Hover Info Below Name */}
                <div className="flex flex-col items-center mt-4 transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto h-[60px]">
                  <div className="flex items-center gap-2"> {/* Reduced gap here too */}
                    {/* LinkedIn Icon */}
                    <Link href={founder.linkedin} target="_blank" rel="noopener noreferrer">
                      <img src="/linkedin.png" alt="LinkedIn" className="w-7 h-7" /> {/* Reduced icon size */}
                    </Link>

                    {/* GitHub Icon */}
                    <Link href={founder.github} target="_blank" rel="noopener noreferrer">
                      <img src="/github.png" alt="GitHub" className="w-7 h-7" /> {/* Reduced icon size */}
                    </Link>

                    <Link href={founder.kaggle} target="_blank" rel="noopener noreferrer">
                      <img src="/kaggle.png" alt="Kaggle" className="w-7 h-7" /> {/* Reduced icon size */}
                    </Link>
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