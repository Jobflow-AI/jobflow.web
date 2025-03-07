import React from 'react'
import { ChevronLeft, Bookmark, Share } from 'lucide-react'
import CustomButton from '@/components/ui/custombutton'
import logo from "../../../../../public/logo.png"

const chatHeader = () => {
  return (
    <div className="flex items-center justify-between py-2 px-4">
    <div className="flex items-center gap-2">
      <span className="text-white text-lg font-medium">Name chat</span>
    </div>
    <div className="flex items-center gap-4">
    <div className="mt-auto px-4 pb-4">
      <CustomButton
        icon={logo.src}
        text="Explore Tracker"
        className="text-sm font-semibold cursor-pointer"
        iconclass='w-6 h-6 p-[1px]'
      />
      </div>
    </div>
  </div>
  )
}

export default chatHeader