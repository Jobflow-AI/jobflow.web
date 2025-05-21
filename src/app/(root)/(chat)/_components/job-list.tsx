"use client"

import type React from "react"

import { motion } from "framer-motion"

interface Job {
  name: string
  role: string
  location: string
  logo: string
}

interface JobListProps {
  jobs: Job[]
  selectedIndex: number
  onSelectJob: (index: number) => void
}

const JobList: React.FC<JobListProps> = ({ jobs, selectedIndex, onSelectJob }) => {
  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <motion.div className="w-full border-r border-zinc-700 overflow-y-auto" variants={listVariants}>
      <div className="p-4 sticky top-0 bg-zinc-800 border-b border-zinc-700">
        <h3 className="text-white font-medium">Available Positions ({jobs.length})</h3>
      </div>

      <motion.ul variants={listVariants} className="divide-y divide-zinc-700">
        {jobs.map((job, index) => (
          <motion.li
            key={index}
            variants={itemVariants}
            className={`p-4 cursor-pointer transition-colors ${
              selectedIndex === index ? "bg-zinc-700" : "hover:bg-zinc-750"
            }`}
            onClick={() => onSelectJob(index)}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                {job.logo ? (
                  <img src={job.logo || "/placeholder.svg"} alt={job.name} className="w-8 h-8 rounded-full" />
                ) : (
                  <span className="text-white font-bold">{job.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h4 className="text-white font-medium">{job.role}</h4>
                <p className="text-zinc-400 text-sm">{job.name}</p>
                <div className="flex items-center mt-1">
                  <span className="text-zinc-500 text-xs">{job.location}</span>
                </div>
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  )
}

export default JobList

