"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Mic, ArrowRight } from "lucide-react"
import Hand from "../../../../../public/hey.png"
import Hnadanimation from "../../../../../public/handanimation-unscreen.gif"

interface InitialCardProps {
  onSubmit: (query: string) => void
}

const InitialCard: React.FC<InitialCardProps> = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSubmit(inputValue)
    }
  }

  return (
    <div className="flex-1 mt-[10%] overflow-auto p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full shadow-[5px_0_20px_rgba(82,82,82,0.5)] bg-zinc-900 rounded-xl p-8 flex flex-col items-center">
        <Image src={Hnadanimation || "/placeholder.svg"} alt="hand" className="w-[30%]" />
        <h1 className="text-white text-3xl font-medium mb-2">Hunting Job Opportunity?</h1>
        <p className="text-zinc-400 text-center text-sm mb-8">
          🚀 Welcome! Simply enter a few details like job preferences, and let AI generate the perfect job listings for
          you. Remember the detailed the prompt the better the response listing.
        </p>

        {/* Input field */}
        <form onSubmit={handleSubmit} className="w-full relative">
          <div className="bg-white rounded-lg flex items-center p-2 pr-1">
            <div className="w-6 h-6 mr-2">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-zinc-400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M12 20V22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.93 4.93L6.34 6.34"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.66 17.66L19.07 19.07"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M2 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M20 12H22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.93 19.07L6.34 17.66"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.66 6.34L19.07 4.93"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              type="text"
              className="bg-transparent border-none text-zinc-600 text-sm w-full focus:outline-none"
              placeholder="Message JobGPT..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="button" className="text-zinc-500 mx-1">
              <Mic className="w-5 h-5" />
            </button>
            <button type="submit" className="bg-[#b9ff2c] text-white rounded p-1.5">
              <ArrowRight className="w-5 h-5 text-zinc-500" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InitialCard

