import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { FaPaperclip, FaUpload, FaGlobe, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import { useGoogleLogin } from '@react-oauth/google';
import { useAppDispatch } from '@/redux/hooks';
import axios from 'axios';
import { userData } from '@/redux/slices/userSlice';
import toast from 'react-hot-toast';
import { Loader2, SparklesIcon } from 'lucide-react';
import JobSearchResults from './job-result';
import QueryLimitPopup from './QueryLimitPopup'; 
import ChatInput from './chatinput';
import { Button } from '@/components/ui/button';

const QUERY_LIMIT = 2;
const STORAGE_KEY = 'userQueryCount';

const HeroSection = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [queryCount, setQueryCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  useEffect(() => {
    const storedCount = localStorage.getItem(STORAGE_KEY);
    if (storedCount) {
      setQueryCount(parseInt(storedCount, 10));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, queryCount.toString());
  }, [queryCount]);



  const handleCloseResults = () => {
    setShowResults(false);
    setQuery('');
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen  flex flex-col">
      {/* Loader */}
     



      {/* Ray Container with multiple light rays */}
      <div 
          className="fixed inset-0 pointer-events-none select-none"
          style={{
            '--gradient-opacity': '.85',
            '--ray-gradient': 'radial-gradient(rgb(83 255 233 / 85%) 0%, rgba(43, 166, 255, 0) 100%)',
            transition: 'opacity 0.25s linear',
          } as React.CSSProperties}
        >
        {/* Light Ray 1 */}
        <div className="absolute rounded-full" 
          style={{
            background: 'var(--ray-gradient)',
            width: '480px',
            height: '680px',
            transform: 'rotate(80deg)',
            top: '-540px',
            left: '250px',
            filter: 'blur(110px)'
          }}
        />
        {/* Light Ray 2 */}
        <div className="absolute rounded-full" 
          style={{
            background: 'var(--ray-gradient)',
            width: '110px',
            height: '400px',
            transform: 'rotate(-20deg)',
            top: '-280px',
            left: '350px',
            mixBlendMode: 'overlay',
            opacity: '0.6',
            filter: 'blur(60px)'
          }}
        />
        {/* Light Ray 3 */}
        <div className="absolute rounded-full" 
          style={{
            background: 'var(--ray-gradient)',
            width: '400px',
            height: '370px',
            transform: 'rotate(95deg)',
            top: '-350px',
            left: '200px',
            mixBlendMode: 'overlay',
            opacity: '0.6',
            filter: 'blur(21px)'
          }}
        />
        {/* Light Ray 4 */}
        <div className="absolute rounded-full" 
          style={{
            background: 'var(--ray-gradient)',
            position: 'absolute',
            width: '330px',
            height: '370px',
            transform: 'rotate(75deg)',
            top: '-330px',
            left: '50px',
            mixBlendMode: 'overlay',
            opacity: '0.5',
            filter: 'blur(21px)'
          }}
        />
        {/* Light Ray 5 */}
        <div className="absolute rounded-full" 
          style={{
            background: 'var(--ray-gradient)',
            position: 'absolute',
            width: '110px',
            height: '400px',
            transform: 'rotate(-40deg)',
            top: '-280px',
            left: '-10px',
            mixBlendMode: 'overlay',
            opacity: '0.8',
            filter: 'blur(60px)'
          }}
        />
      </div>

      {/* Navbar */}

      {/* Conditional Rendering for Hero Content or Job Search Results */}
      {showResults && queryCount < QUERY_LIMIT ? (
        <JobSearchResults query={query} onClose={handleCloseResults} />
      ) : (
        <div className="flex-1 flex flex-col items-center text-center mt-2 px-4">
      <div className="flex justify-center mt-4 mb-[10%]">
          <Button variant="outline" className="rounded-full bg-black/50 border-gray-700 hover:bg-black/70 text-white">
            <SparklesIcon className="w-4 h-4 mr-2" />
            Introducing Chrome Extension for Contextual AutoFilling 
          </Button>
      </div>
        <div>
        </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Find and apply jobs in seconds.
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl">
            Jobflow is your JobGpt. Start for free today.
          </p>
          <div className='w-[60%]'>
          <ChatInput isLoggedIn={isLoggedIn} />
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
      )}

      {/* Query Limit Popup */}
      {showPopup && <QueryLimitPopup onClose={handleClosePopup} />}
    </div>
  );
};

export default HeroSection;