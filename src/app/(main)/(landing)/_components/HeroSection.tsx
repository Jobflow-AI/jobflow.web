'use client'
import apiClient from '@/apiClient/apiClient';
import GoogleLoginButton from '@/app/(auth)/_components/GoogleLoginButton'
import Image from 'next/image'
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const HeroSection = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinWaitlist = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiClient.post(`/join-waitlist?email=${email}`);

      if (response.status == 201) {
        toast.success("Successfully joined Waitlist")
        setEmail('')
      } 
    } catch (error: any) {
      toast.error(error.response.data.message || "Something went wrong! Try Again")
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <section className="text-center px-6 py-16 lg:bg-hero-image bg-no-repeat bg-right">
        <h1 className="text-4xl font-bold text-black mb-4">
          Simply Manage Your Jobs
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Our platform allows you to find all the jobs from top platforms and manage and track your job applications smoothly.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center max-w-md mx-auto mb-10">
          <input
            type="email"
            placeholder="Enter Your Email Address"
            className="flex-grow p-2 sm:p-3 border border-gray-300 rounded-md sm:rounded-l-md focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            className={`px-4 py-2 sm:px-6 sm:py-3 ${isLoading ? 'bg-gray-600' : 'bg-black'} text-white rounded-md sm:rounded-r-md hover:opacity-90 mt-1 sm:mt-0`}
            onClick={handleJoinWaitlist}
            disabled={isLoading}
          >
            {isLoading ? 'Joining...' : 'Join Waitlist'}
          </button>
        </div>
        <div className="relative w-full max-w-4xl mx-auto">
          <Image
            src="/hero-section.png"
            alt="Hero Image"
            width={100}
            height={100}
            layout="responsive"
          />
        </div>
      </section>
    </>
  )
}

export default HeroSection