import { Folder, Search, Plus, Bookmark, MessageSquare, ChevronLeft, Share, Mic } from "lucide-react"
import ChatHeader from "./_components/chatHeader"
import InitialCrd from "./_components/InitialCrd"

export default function Home() {
  return (
    <div className="h-full bg-zinc-900 rounded-r-3xl overflow-hidden flex">
        <div className="flex-1 w-full flex flex-col">
          {/* Header */}
          <ChatHeader />
          {/* Chat content */}
          <InitialCrd />

        </div>
      </div>
  )
}

