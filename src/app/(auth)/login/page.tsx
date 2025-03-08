'use client'
import React, { useState, useEffect } from 'react';
import GoogleLoginButton from '../_components/GoogleLoginButton'; // Import your Google Login component
import Link from 'next/link';
import { FaGithub, FaGoogle } from 'react-icons/fa';

// Custom hook for typewriter effect
const useTypewriter = (texts: string[], speed: number) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentCharIndex < texts[currentTextIndex].length) {
        setDisplayedText((prev) => prev + texts[currentTextIndex][currentCharIndex]);
        setCurrentCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => {
          setDisplayedText('');
          setCurrentCharIndex(0);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }, 2000); // Pause before starting the next text
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [currentCharIndex, currentTextIndex, texts, speed]);

  return displayedText;
};

const Login = () => {
  const typewriterText = useTypewriter(
    [
      'Empowering your job search with AI.',
      'Your career, reimagined with JobGPT.',
      'Find your dream job effortlessly.',
    ],
    100 // Speed of typing in milliseconds
  );

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Login Form */}
      <div className="flex-[0.60] flex items-center justify-center bg-[#161414] text-white">
        <div className="w-full max-w-md p-8">
          {/* Logo Section */}
          <div className="flex justify-center mb-8">
            <img
              src="/logo.png" 
              alt="Logo"
              className=" h-10 w-10 rounded-lg"
            />
          </div>

          {/* Header */}
          <h2 className="text-xl font-semibold mb-4 text-center">
            Sign in
          </h2>
          <p className="text-gray-400 text-center mb-6">
            Don't have an account? <Link href={'/signup'} className="text-white underline">Create one</Link>
          </p>

          {/* Social Login Buttons */}
          <div className="space-y-4 mb-6">
            <GoogleLoginButton/>
          </div>

          {/* OR Divider */}
          <div className="flex items-center justify-center my-4">
            <div className="h-px bg-gray-600 w-full"></div>
            <span className="text-gray-500 px-4 text-sm">OR</span>
            <div className="h-px bg-gray-600 w-full"></div>
          </div>

          {/* Form Section */}
          <form>
            <div className="mb-4">
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white"
              />
            </div>
            <div className="flex items-center justify-between mb-6">
              <a href="#" className="text-gray-400 hover:text-white">Forgot password?</a>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-white text-black rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="flex-[0.40] bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center animate-gradient">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-4">{typewriterText}</h3>
          <p className="text-gray-500">Your ultimate go-to career companion.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;


