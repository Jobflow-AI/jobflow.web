'use client'

import { useAppSelector } from '@/redux/hooks';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { HiOutlineHome } from "react-icons/hi";
import { MdOutlineViewKanban } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoAnalyticsOutline } from "react-icons/io5";
import { usePathname } from 'next/navigation';



const Sidebar = () => {
  const user = useAppSelector(state => state.user.user);
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center justify-between h-full text-white ml-6 py-4">
      {/* Logo at the top */}
      <Link href={'/'} className="flex items-center">
        <Image src='/logo.png' alt="Jobflow Logo" width={35} height={35} className='rounded-lg'/>
      </Link>
      
      {/* Navigation items in the middle */}
      {user && <>
        <div className="flex flex-col items-center flex-grow justify-center">
          <div className='flex gap-8 flex-col text-gray-200'>
            <Link href="/" className="flex flex-col items-center w-12">
              <div className={`flex flex-col items-center rounded-2xl p-2 w-full hover:bg-zinc-800 transition-colors ${
                pathname === '/' ? 'bg-zinc-800 text-white' : 'text-gray-200'
              }`}>
                <HiOutlineHome className="h-5 w-5 mb-1" />
                <span className="text-xs">Home</span>
              </div>
            </Link>

            <Link href="/dashboard" className="flex flex-col items-center w-12">
              <div className={`flex flex-col items-center rounded-2xl p-2 w-full hover:bg-zinc-800 transition-colors ${
                pathname === '/dashboard' ? 'bg-zinc-800 text-white' : 'text-gray-200'
              }`}>
                <LuLayoutDashboard className="h-5 w-5 mb-1" />
                <span className="text-xs">Jobs</span>
              </div>
            </Link>

            <Link href="/tracker" className="flex flex-col items-center w-12">
              <div className={`flex flex-col items-center rounded-2xl p-2 w-full hover:bg-zinc-800 transition-colors ${
                pathname === '/tracker' ? 'bg-zinc-800 text-white' : 'text-gray-200'
              }`}>
                <MdOutlineViewKanban className="h-5 w-5 mb-1" />
                <span className="text-xs">Tracker</span>
              </div>
            </Link>

            <Link href="/analytics" className="flex flex-col items-center w-12">
              <div className={`flex flex-col items-center rounded-2xl p-2 w-full hover:bg-zinc-800 transition-colors ${
                pathname === '/analytics' ? 'bg-zinc-800 text-white' : 'text-gray-200'
              }`}>
                <IoAnalyticsOutline className="h-5 w-5 mb-1" />
                <span className="text-xs">Analytics</span>
              </div>
            </Link>
          </div>
        </div>
      </>}
    </div>
  );
};

export default Sidebar;