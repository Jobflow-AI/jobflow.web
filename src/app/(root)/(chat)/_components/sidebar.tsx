import React from 'react'
import { Folder } from 'lucide-react'
import { Search, MessageSquare,ChevronDown, Plus } from 'lucide-react'
import Image from 'next/image'
import logo from "../../../../../public/logo.png"
import Data from "../../../../data/data.json"


const sidebar = () => {
  return (
    <div className="w-90 bg-zinc-900 rounded-l-3xl flex flex-col">
          {/* My Chats header */}
          <div className="p-4">
            <div className="bg-zinc-800 rounded-full p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 relative">
                  <Image src={logo} alt="logo"/>
                </div>
                <span className="text-white font-medium">History</span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 mb-2">
            <div className="bg-zinc-800 rounded-md flex items-center px-3 py-2">
              <Search className="w-4 h-4 text-zinc-400 mr-2" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent border-none text-zinc-300 text-sm w-full focus:outline-none"
              />
            </div>
          </div>


          {/* Chats */}
          <div className="px-4 mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-zinc-400 text-sm">Chats</span>
              <button className="text-zinc-400">
                <ChevronDown/>
              </button>
            </div>

            <div className="space-y-2">
      {Data.jobs.map((job) => (
        <div key={job.id} className="bg-zinc-800 rounded-md p-2 flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-zinc-400" />
              <span className="text-zinc-300 text-sm">{job.name}</span>
            </div>
            <p className="text-zinc-500 text-xs ml-6">{job.description}</p>
          </div>
        </div>
      ))}
    </div>
          </div>

          {/* New chat button */}
          <div className="mt-auto px-4 pb-4">
            <button className="bg-green-500 hover:bg-green-600 text-white rounded-full py-2 px-4 w-full flex items-center justify-between">
              <span>New chat</span>
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
  )
}

export default sidebar