"use client"
import { Folder, Search, Plus, Bookmark, MessageSquare, ChevronLeft, Share, Mic } from "lucide-react"
import ChatHeader from "./_components/chatHeader"
import JobSearchResults from "./_components/job-result"
import InitialCard from "./_components/InitialCrd"
import { useState } from "react"

export default function Home() {
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query)
    setIsSearchSubmitted(true)
  }
  return (
    <div className="h-full rounded-3xl overflow-hidden flex">
        <div className="flex-1 w-full flex flex-col">
          {/* Header */}
          <ChatHeader />
          <div className="flex items-center justify-center p-4">
          <div className="w-full max-w-7xl">
           { !isSearchSubmitted ? <InitialCard onSubmit={handleSearchSubmit} /> : <JobSearchResults query={searchQuery} /> }
         </div>
         </div>

        </div>
      </div>
  )
}

