import React from 'react';

interface JobProps {
  job: {
    id: string;
    title: string;
    status: string;
    company?: {
      company_name: string;
      company_logo: string;
    };
    job_link?: string;
    job_salary?: string;
    work_type?: string;
    job_location?: string;
    source?: string;
  };
}

const TaskCard: React.FC<JobProps> = ({ job }) => {
  
  const companyName = job.company?.company_name 
  
  // Default company logo or placeholder
  const renderCompanyLogo = () => {
    if (job.company?.company_logo) {
      return (
        <img 
          src={job.company.company_logo} 
          alt={`${companyName} logo`} 
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    } else {
    
        const firstLetter = companyName ? companyName.charAt(0).toUpperCase() : '?';
      const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-violet-500', 'bg-rose-500', 'bg-amber-500', 'bg-cyan-500'];
      const randomColor = colors[companyName.length % colors.length]; // Deterministic color based on name length
      
      return (
        <div className={`w-8 h-8 rounded-full ${randomColor} flex items-center justify-center text-white font-medium`}>
          {firstLetter}
        </div>
      );
    }
  };



  return (
    <div className="bg-white rounded-lg p-4 mb-3 transition-all hover:shadow-md border border-gray-200 w-full h-full">
 
      {
        <div className="flex justify-end mb-2">
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
            {job.source}
          </span>
        </div>
      }
      
    
      <div className="flex items-center mb-4">
        {renderCompanyLogo()}
        <span className="text-sm font-medium text-gray-600 ml-2">
          {companyName}
        </span>
      </div>
      
     
      <h3 className="font-medium text-gray-800 text-lg mb-4">{job.title}</h3>
     
      <div className="space-y-2 text-sm text-gray-600">
        {job.job_salary && (
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95a1 1 0 001.715 1.029zM6 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm7 5a1 1 0 01-1 1H8a1 1 0 110-2h4a1 1 0 011 1z" clipRule="evenodd" />
            </svg>
            <span>{job.job_salary}</span>
          </div>
        )}
        
        {job.work_type && (
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15a24.98 24.98 0 01-8-1.308z" />
            </svg>
            <span>{job.work_type}</span>
          </div>
        )}
        
        {job.job_location && (
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>{job.job_location}</span>
          </div>
        )}
      </div>
      
 
      <div className="mt-4 pt-3 border-t border-gray-100">
        <a 
          href={job.job_link || "#"} 
          className="inline-flex items-center text-blue-500 text-sm font-medium hover:text-blue-700 hover:underline transition-colors"
        >
          View Job
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default TaskCard;