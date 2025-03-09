import React, { useState, useRef, useEffect } from 'react';
import TypewriterPlaceholder from './typewriter';
import { Upload, Stars, Loader2 } from 'lucide-react';
import { getUser } from '@/actions/user_actions';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { userData } from '@/redux/slices/userSlice';
import toast from 'react-hot-toast';

const ChatInput = ({ isLoggedIn, onSubmit }: { 
  isLoggedIn: boolean;
  onSubmit?: (query: string) => void;
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [queryCount, setQueryCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const router = useRouter();
  const dispatch = useAppDispatch();
  

  const QUERY_LIMIT = 2;
  const STORAGE_KEY = 'userQueryCount';

  const placeholders = [
    "Let me Help you with your job search!",
    "Remote full-stack developer jobs.",
    "AI/ML engineer openings worldwide.",
    "Blockchain developer roles hiring now.",
    "Cybersecurity analyst job listings.",
    "Cloud engineer positions available today.",
    "Type something amazing..."
  ];

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
    
          if (res.status === 200) {
            dispatch(userData(res.data.user));
            toast.success("Login success");
          } else {
            toast.error("Error: Login Failed");
          }
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

  // Fixed handleKeyDown to properly handle contentEditable div
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  // New function to handle both Enter key and button click
  const handleSubmit = () => {
    console.log("button getting clicked")
    if (isLoading) return;
    
    if (!isLoggedIn) {
      setIsLoading(true);
      login();
    } else {
      console.log("button not getting clicked")
      const inputText = inputRef.current?.textContent || '';
      console.log("inputText", inputText)
      if (onSubmit) {
        console.log("lafda")
        onSubmit(inputText);
        // Clear input after submission
        if (inputRef.current) {
          inputRef.current.textContent = '';
        }
        setInputValue('');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#050505] text-white p-4 overflow-hidden">
      <div className="w-full mx-auto z-10 px-4 animate-fade-in">
        {/* Input Container */}
        <div className="relative shadow-sm border border-[#ffffff1a] bg-[#171717cc] backdrop-blur rounded-lg p-4 transition-all duration-300 hover:border-[#ffffff33]">
          <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
            <svg className="absolute bottom-0 right-0 w-full h-full">
              <defs>
                <linearGradient id="line-gradient" x1="70%" y1="70%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#53ffe9d9" stopOpacity="0%" />
                  <stop offset="40%" stopColor="#53ffe9d9" stopOpacity="80%" />
                  <stop offset="50%" stopColor="#53ffe9d9" stopOpacity="80%" />
                  <stop offset="100%" stopColor="#53ffe9d9" stopOpacity="0%" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="transparent" stroke="url(#line-gradient)" strokeWidth="1" rx="8" />
            </svg>
          </div>

          {/* Combined input and placeholder container */}
          <div className="relative min-h-[40px]">
            {/* Only show placeholder when not typing */}
            {!isTyping && !inputValue && (
              <div className="absolute inset-0 py-2">
                <TypewriterPlaceholder 
                  placeholders={placeholders}
                  className="text-md sm:text-lg"
                  cursorClassName="bg-[#53ffe9d9]"
                />
              </div>
            )}
            
            {/* Actual input field - positioned in the same place */}
            <div 
              className="min-h-[40px] py-2 text-md sm:text-lg outline-none w-full bg-transparent"
              contentEditable
              ref={inputRef}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(inputValue.length > 0)}
              onInput={(e) => {
                setInputValue(e.currentTarget.textContent || '');
              }}
              onKeyDown={handleKeyDown}
              style={{ caretColor: "#53ffe9d9" }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between text-sm pt-2">
            <div className="flex gap-2 items-center">
              <button 
                className="flex items-center text-gray-400 hover:text-[#53ffe9d9] rounded-md p-1 transition-colors duration-200"
                onClick={() => {/* Handle upload */}}
                type="button"
              >
                <Upload className="text-xl" />
              </button>
              <button 
                className="flex items-center text-gray-400 opacity-30 cursor-not-allowed rounded-md p-1"
                type="button"
                disabled
              >
                <Stars className="text-xl" />
              </button>
            </div>
            <button
              className="px-4 py-1 bg-[#53ffe9d9] text-black font-medium rounded-md hover:bg-[#53ffe9] transition-colors"
              onClick={handleSubmit}
              // disabled={isLoading}
            >
              {isLoading ? <Loader2/> : 'Send'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Background gradient */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-[#53ffe930] rounded-full filter blur-[100px] opacity-30"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-[#53ffe930] rounded-full filter blur-[100px] opacity-20"></div>
      </div>
    </div>
  );
};

export default ChatInput;