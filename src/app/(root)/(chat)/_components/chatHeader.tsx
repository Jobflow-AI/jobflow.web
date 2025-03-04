import React from 'react'
import { ChevronLeft, Bookmark, Share } from 'lucide-react'

const chatHeader = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-zinc-800">
    <div className="flex items-center gap-2">
      <button className="text-zinc-400">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <span className="text-white">Name chat</span>
      <span className="bg-zinc-800 text-xs text-zinc-400 px-2 py-0.5 rounded-md">Chat GPT 4.0</span>
    </div>
    <div className="flex items-center gap-4">
      <button className="text-zinc-400">
        <Bookmark className="w-5 h-5" />
      </button>
      <button className="text-zinc-400">
        <Share className="w-5 h-5" />
      </button>
    </div>
  </div>
  )
}

export default chatHeader