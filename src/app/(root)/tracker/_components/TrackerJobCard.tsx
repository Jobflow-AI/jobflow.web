import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Job } from '@/types/job'; // Import the Job type

const cardColors = [
  'bg-[#7DD1E3]',
  'bg-[#F6C67B]',
  'bg-[#B18BDD]',
  'bg-[#353345]'
];

// Change the function signature to accept job directly
export const renderJobCard = (job: any) => {
  console.log(job, "here is the job")
  const randomColor = cardColors[Math.floor(Math.random() * cardColors.length)];
  
  return (
    <div className={`rounded-3xl p-4 shadow-sm mb-3 ${randomColor} text-[#1F1D2B]`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {job?.company?.company_logo && (
            <img
              src={job.company.company_logo}
              alt={job.company.company_name}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <div>
            <h3 className="text-sm font-medium">{job.title}</h3>
            <span className="text-xs opacity-80">{job.company.company_name}</span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 opacity-60" />
      </div>
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex gap-2">
          <span className="text-xs bg-black/10 px-2 py-1 rounded">
            {job.source}
          </span>
          <span className="text-xs bg-black/10 px-2 py-1 rounded">
            {job.job_type}
          </span>
        </div>
        <span className="text-xs font-medium">
          {job.job_salary || 'Salary not disclosed'}
        </span>
      </div>
    </div>
  );
};