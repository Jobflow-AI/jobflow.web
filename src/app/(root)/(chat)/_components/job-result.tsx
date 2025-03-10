import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import type { Job } from '@/types/job';

interface JobSearchResultsProps {
  query: string;
  onClose: () => void;
  apiData: any;
  isLoading?: boolean;
}

const JobSearchResults = ({ query, onClose, apiData, isLoading = false }: JobSearchResultsProps) => {
  useEffect(() => {
    console.log("JobSearchResults mounted with apiData:", apiData);
  }, [apiData]);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-zinc-800 rounded-xl p-6 mt-16">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Results for "{query}"</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-400">Loading job results...</p>
        </div>
      </div>
    );
  }

  if (!apiData || !apiData.jobs || apiData.jobs.length === 0) {
    console.log("No job data available");
    return (
      <div className="w-full max-w-4xl mx-auto bg-zinc-800 rounded-xl p-6 mt-16">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Results for "{query}"</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-400">No job listings found. Try a different search.</p>
        </div>
      </div>
    );
  }

  console.log("Rendering job results:", apiData.jobs.length);

  return (
    <div className="w-full max-w-4xl mx-auto bg-zinc-800 rounded-xl p-6 mt-16">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Results for "{query}"</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>
      
      <div className="space-y-4">
        {apiData.jobs.map((job: Job) => (
          <div key={job.id} className="bg-zinc-700 rounded-lg p-4 hover:bg-zinc-600 transition-colors">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium text-white">{job.title}</h3>
              <span className="text-[#53ffe9] font-medium">{job.job_salary}</span>
            </div>
            <div className="flex items-center text-gray-300 text-sm mt-1">
              <span>{job.company.company_name}</span>
              <span className="mx-2">•</span>
              <span>{job.job_location}</span>
              {job.job_type && <span className="ml-2 px-2 py-0.5 bg-zinc-600 rounded text-xs">{job.job_type}</span>}
            </div>
            <p className="text-gray-400 text-sm mt-2 line-clamp-2">{job.job_description}</p>
            <div className="flex justify-between items-center mt-3">
              {/* <div className="flex gap-2">
                {job.tags && job.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-0.5 bg-zinc-600 rounded text-xs text-gray-300">
                    {tag}
                  </span>
                ))}
              </div> */}
              <button className="text-sm text-[#53ffe9] hover:underline">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobSearchResults;