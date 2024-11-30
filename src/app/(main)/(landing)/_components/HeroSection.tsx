import GoogleLoginButton from '@/app/(auth)/_components/GoogleLoginButton'
import Image from 'next/image'
import React from 'react'

const HeroSection = () => {
  return (
    <>
    <section className="text-center px-6 py-16 lg:bg-hero-image bg-no-repeat bg-right">
        <h1 className="text-4xl font-bold text-black mb-4">
          Simply Manage Your Jobs
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
        Our platform allows you to find all the jobs from top platforms and manage and track your job applications smoothly.
        </p>

        <div className="flex justify-center items-center max-w-md mx-auto mb-10">
          {/* <GoogleLoginButton className="!rounded-l-md" /> */}
          <input
            type="email"
            placeholder="Enter Your Email Address"
            className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none"
          />
          <button className="px-6 py-3 bg-black text-white rounded-r-md hover:opacity-90">
            Join Waitlist
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