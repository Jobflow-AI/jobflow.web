import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaPaperclip, FaUpload, FaGlobe, FaBars, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa'; // Import social media icons

const HeroSection = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#160e0e] text-white flex flex-col">
      {/* Navbar */}
      <div className="flex justify-between items-center w-full mx-auto px-6 py-4">
        <div className="flex items-center">
          <Image src='/logo.png' alt="Lovable Logo" width={35} height={45} className='rounded-lg'/>
          <span className="ml-2 text-white font-semibold text-lg">Jobflow</span>
        </div>
        <div className="flex items-center space-x-4">
          {/* Social Media Icons */}
          <FaTwitter className="text-white text-lg cursor-pointer hover:text-gray-400" />
          <FaLinkedin className="text-white text-lg cursor-pointer hover:text-gray-400" />
          <FaGithub className="text-white text-lg cursor-pointer hover:text-gray-400" />

          {isLoggedIn ? (
            <button className="bg-white text-black rounded-lg px-3 py-1 text-sm font-medium">
              Explore Tracker
            </button>
          ) : (
            <>
              <Link href="/login">
                <button className="text-gray-400 hover:text-white text-sm border-2 border-gray-500 rounded-lg py-1 px-3">Sign in</button>
              </Link>
              <Link href="/signup">
                <button className="bg-white text-black rounded-lg px-3 py-1 text-sm font-medium">Sign up</button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Hero Content */}
      <div className="flex-1 flex flex-col items-center text-center mt-12 px-4">
        <Image src='/handanimation-unscreen.gif' alt="Lovable Logo" width={250} height={250} className='rounded-lg mb-20'/>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Find and apply jobs in seconds.
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl">
          Jobflow is your JobGpt. Start for free today.
        </p>
        <div className="bg-zinc-800 rounded-lg p-4 flex flex-col items-center justify-between max-w-3xl w-full shadow-lg">
          <textarea
            placeholder="Search for jobs..."
            className="bg-transparent border-none text-white text-lg w-full placeholder-gray-500 focus:outline-none focus:ring-0"
            style={{ boxShadow: 'none' }} // Remove focus styles
          />
          <div className="flex items-end space-x-4">
            <FaPaperclip className="text-white text-lg cursor-pointer hover:text-gray-400" />
            <FaUpload className="text-white text-lg cursor-pointer hover:text-gray-400" />
            <FaGlobe className="text-white text-lg cursor-pointer hover:text-gray-400" />
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {['Recharts dashboard', 'Habit tracker', 'Real estate listings', 'Developer portfolio'].map((item) => (
            <button
              key={item}
              className="bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg px-5 py-2 text-sm font-medium"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
