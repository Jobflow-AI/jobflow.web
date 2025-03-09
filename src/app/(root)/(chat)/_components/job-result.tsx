"use client"
import { useState } from "react"
import type React from "react"
import { motion } from "framer-motion"
import JobDetail from "./job-details"
import JobList from "./job-list"
import jobData from "@/data/data.json"

interface JobSearchResultsProps {
  query: string
  onClose: () => void // Add onClose prop
}

const JobSearchResults: React.FC<JobSearchResultsProps> = ({ query, onClose }) => {
  const [selectedJobIndex, setSelectedJobIndex] = useState(0)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <motion.div 
      className="bg-zinc-800 rounded-xl shadow-lg overflow-hidden w-full max-w-5xl mx-auto relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <button 
        className="absolute top-2 right-2 text-white  rounded-full p-2"
        onClick={onClose} // Handle close action
      >
        &times; {/* Cross symbol */}
      </button>
      <div className="p-4 bg-zinc-700">
        <h2 className="text-white text-xl font-medium">
          Job Results for: <span className="text-[#b9ff2c]">{query}</span>
        </h2>
      </div>

      <div className="flex flex-col md:flex-row h-[500px] max-h-[70vh] overflow-hidden">
        <div className="border-r border-zinc-700 overflow-y-auto">
          <JobList 
            jobs={jobData.companies} 
            selectedIndex={selectedJobIndex} 
            onSelectJob={setSelectedJobIndex} 
          />
        </div>
        <div className="md:w-2/3 overflow-y-auto">
          <JobDetail job={jobData.companies[selectedJobIndex]} />
        </div>
      </div>
    </motion.div>
  )
}

export default JobSearchResults