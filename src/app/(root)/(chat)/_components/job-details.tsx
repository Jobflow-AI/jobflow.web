"use client"

import type React from "react"
import { useContext, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { ApplyPanelContext } from "../layout"

interface Job {
  name: string
  description: string
  recruiter: string
  applyKey: string
  role: string
  responsibilities: string[]
  skills: string[]
  compensation: string
  location: string
  logo: string
  applyLink: string
}

interface JobDetailProps {
  job: Job
}

const JobDetail: React.FC<JobDetailProps> = ({ job }) => {
  const { setIsApplyPanelOpen } = useContext(ApplyPanelContext);
  
  // Animation variants
  const detailVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.5,
      },
    },
  }

  return (
    <motion.div
      className="w-full overflow-y-auto p-6"
      variants={detailVariants}
      initial="hidden"
      animate="visible"
      key={job.applyKey} // Re-animate when job changes
    >
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-zinc-700 rounded-lg flex items-center justify-center mr-4">
          {job.logo ? (
            <img src={job.logo || "/placeholder.svg"} alt={job.name} className="w-12 h-12" />
          ) : (
            <span className="text-white text-2xl font-bold">{job.name.charAt(0)}</span>
          )}
        </div>
        <div>
          <h2 className="text-white text-2xl font-bold">{job.role}</h2>
          <p className="text-zinc-400">
            {job.name} • {job.location}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-white text-lg font-medium mb-2">About the Role</h3>
        <p className="text-zinc-400">{job.description}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-white text-lg font-medium mb-2">Responsibilities</h3>
        <ul className="list-disc pl-5 text-zinc-400">
          {job.responsibilities.map((responsibility, index) => (
            <li key={index} className="mb-1">
              {responsibility}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-white text-lg font-medium mb-2">Required Skills</h3>
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill, index) => (
            <span key={index} className="bg-zinc-700 text-zinc-300 px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-white text-lg font-medium mb-2">Compensation</h3>
        <p className="text-[#b9ff2c] font-medium">{job.compensation}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-white text-lg font-medium mb-2">Recruiter</h3>
        <p className="text-zinc-400">{job.recruiter}</p>
      </div>

      <div className="mt-8">
        <button
          onClick={() => setIsApplyPanelOpen(true)}
          className="bg-[#b9ff2c] text-zinc-800 font-medium px-6 py-3 rounded-lg inline-flex items-center hover:bg-opacity-90 transition-colors"
        >
          Apply Now <ArrowUpRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

export default JobDetail

