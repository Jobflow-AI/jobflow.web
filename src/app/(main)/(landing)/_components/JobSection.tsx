'use client'
import { getJobData } from '@/actions/data_actions';
import { renderJobCard } from '@/components/shared/jobCard';
import React, { useEffect, useState } from 'react'

const JobSection = () => {

    const [jobs, setJobs] = useState([]);

    useEffect(() => {
      const fetchJobs = async () => {
        const jobData = await getJobData();
        console.log(jobData, "here is la")
        setJobs(jobData.jobs);
      };
      fetchJobs();
    }, []);

  return (
     <>
           <section className="px-4 sm:px-6 py-16 pt-36 bg-white">
            <div className='mb-12'>
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Explore Available Jobs
            </h2>
            <p className='text-center text-xs sm:text-sm text-slate-500'>
                Hello Find Latest Jobs from all job platfrom
            </p>
            </div>
            
            <div className="max-w-6xl min-h-[400px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
              {/* Job Cards */}
              <div className="relative group h-full flex items-center justify-center">
                {jobs.slice(0, 1).map((job, index) => (
                  <div
                    key={index}
                    className=" transition-transform duration-300 ease-in-out transform group-hover:scale-110"
                    style={{ top: `${index * 10}px`, left: `${index * 10}px` }}
                  >
                    {renderJobCard(job)}
                  </div>
                ))}
              </div>
              {/* Text Content */}
              <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Discover Jobs Across All Platforms
          </h3>
          <ul className="space-y-4 text-gray-700">
            <li>
              <span className="font-bold">✓ Comprehensive Listings:</span> We scrape jobs from all major platforms to provide you with a wide range of opportunities.
            </li>
            <li>
              <span className="font-bold">✓ Tailored Recommendations:</span> Our system suggests jobs based on your skills and interests, ensuring you find the perfect match.
            </li>
            <li>
              <span className="font-bold">✓ Stay Updated:</span> Receive notifications about the latest job openings in your field, so you never miss an opportunity.
            </li>
          </ul>
        </div>
            </div>
      </section>
     </>
)
}

export default JobSection