'use client'
import { applyJob } from "@/actions/user_actions";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const AppliedJobsModal = ({ jobs }: { jobs: any[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);

  useEffect(() => {
    const jobIds = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
    if (jobIds.length > 0) {
      const matchedJobs = jobs.filter((job) => jobIds.includes(job.id));
      setAppliedJobs(matchedJobs);
      setIsOpen(true);
    }
  }, [jobs]);

  const handleApply = async (jobId: string) => {
    const data = await applyJob(jobId, "applied"); // Pass jobId here
    console.log(data, "here is data");
    if (data.success) {
      toast.success(data?.message || "Job added to tracker");
      setIsOpen(false);
      localStorage.removeItem("appliedJobs");
    } else {
      toast.error(data?.error || "An error occurred while applying for the job");
    }
  };
  

  const handleClose = () => {
    setIsOpen(false);
    localStorage.removeItem("appliedJobs");
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-bold mb-3">Jobs You Applied To</h2>
        {appliedJobs.map((job) => (
          <div key={job._id} className="mb-3">
            <p className="font-medium">{job.title}</p>
            <p className="text-sm text-gray-600">{job.company?.name}</p>
            <p className="text-sm text-gray-600">{job.job_location}</p>
            <div className="flex flex-col justify-center items-center mt-2">
              <strong>Did you apply?</strong>
              <div className="flex">
              <button onClick={() => handleApply(job?.id)} className="bg-blue-500 text-white text-xs px-3 py-1 m-2 rounded-lg">
                Yes
              </button>
              <button onClick={handleClose} className="bg-gray-500 text-white text-xs px-3 py-1 m-2 rounded-lg">
                No
              </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null;
};

export default AppliedJobsModal;
