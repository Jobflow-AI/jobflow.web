'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';
import { useAppSelector } from '@/redux/hooks';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const user = useAppSelector(state => state.user.user); 
  const [isOnTrackerPage, setIsOnTrackerPage] = useState(false); 
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure this runs only on the client side
      setIsOnTrackerPage(window.location.pathname === '/tracker');
    }
  }, [pathname]); // Update when pathname changes

  return (
    <div className="flex justify-between items-center w-full mx-auto px-6 py-4 sticky top-0">
      <Link href={'/'} className="flex items-center">
        <Image src='/logo.png' alt="Lovable Logo" width={35} height={45} className='rounded-lg'/>
        <span className="ml-2 text-white font-semibold text-lg">Jobflow</span>
      </Link>
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
        
        {user ? (
          <Link href={isOnTrackerPage ? '/dashboard' : '/tracker'} className="bg-white text-black rounded-lg px-3 py-1 text-sm font-medium">
            {isOnTrackerPage ? 'Dashboard' : 'Explore Tracker'}
          </Link>
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
  );
};

export default Navbar;