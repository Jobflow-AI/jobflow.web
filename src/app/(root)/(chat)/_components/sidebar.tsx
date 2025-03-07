'use client';
import React, { useContext } from 'react';
import { Folder, PlusIcon } from 'lucide-react';
import { Search, MessageSquare, ChevronDown, Plus } from 'lucide-react';
import Image from 'next/image';
import logo from "../../../../../public/logo.png";
import Data from "../../../../data/data.json";
import CustomButton from '@/components/ui/custombutton';
import { Zap } from "lucide-react";
import slider from "../../../../../public/slider.svg";
import { AppContext } from '../layout';

const Sidebar = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useContext(AppContext);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <>
      {/* Floating slider icon when sidebar is collapsed */}
      <div 
        className={`fixed top-8 left-8 z-50 bg-zinc-800 p-2 rounded-full shadow-lg cursor-pointer hover:bg-zinc-700 transition-all duration-500 ease-in-out ${
          isSidebarCollapsed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      >
        <Image 
          src={slider} 
          alt="Open Sidebar" 
          className="icon-xl-heavy font-light w-6 h-6" 
        />
      </div>

      {/* Main sidebar with transition */}
      <div 
        className={`fixed left-0 top-0 md:w-[300px] w-[300px] shadow-[5px_0_20px_rgba(82,82,82,0.5)] h-screen bg-zinc-900 rounded-r-xl flex flex-col transition-all duration-500 ease-in-out z-40 p-4 ${
          isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* My Chats header */}
        <div className="p-2">
          <div className="p-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image 
                src={slider} 
                alt="Close Sidebar" 
                className="icon-xl-heavy font-light cursor-pointer hover:opacity-70 transition-opacity" 
                onClick={toggleSidebar}
              />
              <span className="text-zinc-200 font-medium">Chats</span>
            </div>
            <PlusIcon className="text-zinc-300" />
          </div>
        </div>

        {/* Search */}
        <div className="px-4 mb-2">
          <div className="bg-white rounded-md flex items-center px-3 py-1">
            <Search className="w-4 h-4 text-zinc-600 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent border-none text-zinc-600 text-sm w-full focus:outline-none"
            />
          </div>
        </div>

        {/* Chats */}
        <div className="px-2 mx-2 my-4 overflow-y-auto">
          <div className="space-y-2">
            <div className="overflow-hidden flex flex-col gap-10">
              {Object.entries(Data.jobs[0]).map(([category, jobs]) => (
                <div className='flex flex-col gap-4' key={category}>
                  <h2 className="text-zinc-300 font-semibold text-sm capitalize whitespace-nowrap">{category}</h2>
                  <div className="flex flex-col gap-4">
                    {jobs.map((job) => (
                      <div key={job.id} className="w-full cursor-pointer hover:text-white transition-colors">
                        <span className="text-zinc-400 text-base block whitespace-nowrap">{job.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* New chat button */}
        <div className="mt-auto px-4 pb-4">
          <CustomButton
            icon={<Zap className="text-black w-3 h-3" />}
            text="Akshata Solapurkar"
            className="text-sm font-semibold"
            iconclass='p-2'
          />
        </div>
      </div>

      {/* Overlay to close sidebar on mobile when clicking outside */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-500 ${
          isSidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100 md:opacity-0 md:pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />
    </>
  );
};

export default Sidebar;