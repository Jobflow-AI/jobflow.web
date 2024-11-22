import Link from 'next/link';
import React from 'react';

const Navbar = ({ user }: any) => {
  return (
    <nav className="bg-white shadow-md sticky top-0 left-0 w-full z-50 h-16">
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Left Section: Logo */}
        <div className="flex items-center space-x-2">
          <img 
            src="/logo.png" // Replace with the path to your logo
            alt="Company Logo" 
            className="h-[60px]"
          />
          <span className="text-xl font-semibold text-black">Find Your Job</span>
        </div>

        {/* Right Section */}
        {user ? (
          // Profile Icon when user is logged in
          <Link href={'/profile'} className="flex items-center space-x-4">
            <img
              src={user.profileImage || "/assets/default-profile.png"} // Default image if no profileImage
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
              title="Profile"
            />
            <span className="text-sm text-black font-medium">
              {user.name || "User"}
            </span>
          </Link>
        ) : (
          // Start Tracking Your Jobs button
          <Link href={'/signup'}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
          >
            Start Tracking Your Jobs
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
