import Image from 'next/image'
import React from 'react'
import logo from '../../../../../public/logo.png';


const Navbar = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <div className="flex justify-between items-center w-full mx-auto px-6 py-4">
      <div className="flex items-center">
        <Image src={logo} alt="Lovable Logo" width={35} height={45} className='rounded-lg'/>
        <span className="ml-2 text-white font-semibold text-lg">Jobflow</span>
      </div>
      <nav className="hidden md:flex space-x-6">
        {['Support', 'Careers', 'Blog', 'Launched', 'Changelog', 'Learn'].map((item) => (
          <a key={item} href="#" className="text-gray-400 hover:text-white text-sm">
            {item}
          </a>
        ))}
      </nav>
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <button className="bg-white text-black rounded-lg px-4 py-2 text-sm font-medium">
            Explore Tracker
          </button>
        ) : (
          <>
            <button className="text-gray-400 hover:text-white text-sm">Sign in</button>
            <button className="bg-white text-black rounded-lg px-4 py-2 text-sm font-medium">Sign up</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;