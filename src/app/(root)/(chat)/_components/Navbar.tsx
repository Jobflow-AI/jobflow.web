import Image from 'next/image'
import React from 'react'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';


const Navbar = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <div className="flex justify-between items-center w-full mx-auto px-6 py-4">
        <div className="flex items-center">
          <Image src='/logo.png' alt="Lovable Logo" width={35} height={45} className='rounded-lg'/>
          <span className="ml-2 text-white dark:text-white font-semibold text-lg">Jobflow</span> {/* Ensure text is white in dark mode */}
        </div>
        <div className="flex items-center space-x-4">
          <a href="https://x.com/jobflow_in" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-white dark:text-white text-lg cursor-pointer hover:text-gray-400" /> {/* Ensure icon is white in dark mode */}
          </a>
          <a href="https://www.linkedin.com/company/jobflow-in" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-white dark:text-white text-lg cursor-pointer hover:text-gray-400" /> {/* Ensure icon is white in dark mode */}
          </a>
          <a href="https://github.com/jobflow-ai" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-white dark:text-white text-lg cursor-pointer hover:text-gray-400" /> {/* Ensure icon is white in dark mode */}
          </a>
          
          {isLoggedIn ? (
            <button className="bg-white text-black dark:text-white rounded-lg px-3 py-1 text-sm font-medium">
              Explore Tracker
            </button>
          ) : (
            <>
              <Link href="/login">
                <button className="text-gray-400 dark:text-white hover:text-white text-sm border-2 border-gray-500 rounded-lg py-1 px-3">Sign in</button>
              </Link>
              <Link href="/signup">
                <button className="bg-white text-black dark:text-white rounded-lg px-3 py-1 text-sm font-medium">Sign up</button>
              </Link>
            </>
          )}
        </div>
      </div>

  );
};

export default Navbar;