import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPaperclip, FaUpload, FaGlobe, FaBars, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa'; // Import social media icons
import { useGoogleLogin } from '@react-oauth/google'; // Import useGoogleLogin
import { useAppDispatch } from '@/redux/hooks';
import axios from 'axios';
import { userData } from '@/redux/slices/userSlice';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react'; // Import a loader icon
import JobSearchResults from './job-result'; // Import JobSearchResults

const HeroSection = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(''); // State for query
  const [showResults, setShowResults] = useState(false); // State to control visibility of JobSearchResults

  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      setIsLoading(true);
      try {
        const res = await axios.post(
          "/api/google/auth",
          {
            access_token: credentialResponse.access_token,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        dispatch(userData(res.data.user));
        toast.success("Login success");
      } catch (error: any) {
        console.error("Axios error:", error);
        toast.error("Google login failed!");
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error: any) => {
      console.error("Google login error:", error);
      toast.error("Google login failed!");
    },
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!isLoggedIn) {
        login();
      } else {
        setQuery(inputRef.current?.value || ''); // Set the query from input
        setShowResults(true); // Show the JobSearchResults component
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#160e0e] text-white flex flex-col">
      {/* Loader */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loader2 className="w-10 h-10 animate-spin text-white" />
        </div>
      )}

      {/* Ray Container - Top */}
      <div 
        className="fixed inset-0 pointer-events-none select-none"
        style={{
          '--gradient-opacity': '.85',
          '--ray-gradient': 'radial-gradient(rgb(83 255 233 / 85%) 0%, rgba(43, 166, 255, 0) 100%), radial-gradient(rgb(83 255 233 / 85%) 0%, rgba(43, 166, 255, 0) 100%)',
          transition: 'opacity 0.25s linear',
        } as React.CSSProperties}
      />

      {/* Ray Container with multiple light rays */}
      <div 
        className="fixed inset-0 pointer-events-none select-none"
        style={{
          '--gradient-opacity': '.85',
          '--ray-gradient': 'radial-gradient(rgba(83, 196, 255, var(--gradient-opacity)) 0%, rgba(43, 166, 255, 0) 100%)',
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
      <div className="flex justify-between items-center w-full mx-auto px-6 py-4">
        <div className="flex items-center">
          <Image src='/logo.png' alt="Lovable Logo" width={35} height={45} className='rounded-lg'/>
          <span className="ml-2 text-white font-semibold text-lg">Jobflow</span>
        </div>
        <div className="flex items-center space-x-4">
          <a href="https://x.com/jobflow_in" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-white text-lg cursor-pointer hover:text-gray-400" />
          </a>
          <a href="https://www.linkedin.com/company/jobflow-in" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-white text-lg cursor-pointer hover:text-gray-400" />
          </a>
          <a href="https://github.com/jobflow-ai" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-white text-lg cursor-pointer hover:text-gray-400" />
          </a>
          
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

      {/* Conditional Rendering for Hero Content or Job Search Results */}
      {showResults ? (
        <JobSearchResults query={query} />
      ) : (
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
              ref={inputRef}
              placeholder="Search for jobs..."
              className="bg-transparent border-none text-white text-lg w-full placeholder-gray-500 focus:outline-none focus:ring-0"
              style={{ boxShadow: 'none' }}
              onKeyDown={handleKeyDown}
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
      )}
    </div>
  );
};

export default HeroSection;
