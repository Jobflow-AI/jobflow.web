import React from 'react';
import GoogleLoginButton from '../_components/GoogleLoginButton'; // Import your Google Login component
import Link from 'next/link';

const Signup = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border border-gray-300">
        {/* Logo Section */}
        <div className="flex justify-center">
          <img
            src="/logo.svg" 
            alt="Logo"
            className="h-[100px]"
          />
        </div>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-black mb-2 text-center">
          Welcome | Register with us!
        </h2>
        <p className="text-gray-600 mb-6 text-center">You are close to getting a job.</p>

        {/* Google Signup Section */}
        <div className="mb-6">
          <GoogleLoginButton />
        </div>

        {/* OR Divider */}
        <div className="flex items-center justify-center my-4">
          <div className="h-px bg-gray-300 w-full"></div>
          <span className="text-gray-500 px-4 text-sm">OR</span>
          <div className="h-px bg-gray-300 w-full"></div>
        </div>

        {/* Form Section */}
        <form>
          <div className="mb-4">
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            {/* <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 text-gray-800">Remember me</label>
            </div> */}
            <a href="#" className="text-gray-600 hover:text-black">Forgot password?</a>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
          >
            Sign up
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-4 text-gray-600">
          Already have an account? <Link href="/login" className="text-black hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
