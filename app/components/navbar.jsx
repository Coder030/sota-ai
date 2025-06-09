"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function Navbar() {
  const pathname = usePathname()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Team', path: '/team' },
    { name: 'Guide', path: '/guide' },
    { name: 'Lectures', path: '/lectures' },
  ]

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-indigo-600">
        <Link href="/">
          SOTA - AI
        </Link>
      </h1>
      <nav className="space-x-8">
        {navLinks.map(({ name, path }) => {
          const isActive = pathname === path
          return (
            <Link
              key={path}
              href={path}
              className={`text-[20px] hover:underline ${isActive ? 'underline' : ''}`}
            >
              {name}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}

export default Navbar
