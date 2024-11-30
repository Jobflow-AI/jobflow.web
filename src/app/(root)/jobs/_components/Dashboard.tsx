"use client";

import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import { getJobById, getJobData } from "@/actions/data_actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Loader from "@/components/shared/Loader";
import { renderJobCard } from "@/components/shared/jobCard";
import AppliedJobsModal from "./appliedJobs";

// Job portals
const jobPortals = [
  "ycombinator",
  "linkedin",
  "simplyhired",
  "indeed",
  "naukri",
  "internshala",
  "upwork",
  "foundit",
  "freelancer",
  "glassdoor",
];

export default function Dashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedJobId, setAppliedJobId] = useState('')
  const [appliedJob, setAppliedJob] = useState()

  // Fetch jobs from API
  const fetchJobs = async (page: number, portal: string, query: string) => {
    setLoading(true);
    try {
      const data = await getJobData(page, portal, query);
      if (Array.isArray(data?.jobs)) {
        setJobs((prevJobs) =>
          page === 1 ? data.jobs : [...prevJobs, ...data.jobs]
        );
      } else {
        console.error("Unexpected data format", data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetch jobs to limit API calls during search
  const debouncedFetchJobs = useCallback(
    debounce((page: number, portal: string, query: string) => {
      fetchJobs(page, portal, query);
    }, 300),
    []
  );

  // Fetch jobs whenever filters or search change
  useEffect(() => {
    debouncedFetchJobs(page, selectedPortal, searchQuery);
  }, [page, selectedPortal, searchQuery, debouncedFetchJobs]);

  useEffect(() => {
  ( async () => {
    if(appliedJobId) {
      const data = await getJobById(appliedJobId)
      setAppliedJob(data?.job)
    }
  }
)()
  }, [appliedJobId])
  // Load more jobs
  const loadMoreJobs = () => setPage((prevPage) => prevPage + 1);



  return (
    <div className="p-4">
      <AppliedJobsModal jobs={jobs} />
      {loading && (
        <div className="flex justify-center items-center h-32">
          <Loader />
        </div>
      )}

      {/* Tabs for job portals */}
      <Tabs
        defaultValue=""
        onValueChange={(value) => {
          setSelectedPortal(value);
          setPage(1);
          setJobs([]);
        }}
      >
        <TabsList>
          <TabsTrigger value="">All</TabsTrigger>
          {jobPortals.map((portal) => (
            <TabsTrigger key={portal} value={portal}>
              {portal.charAt(0).toUpperCase() + portal.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Search Input */}
        <div className="m-4">
          <Input
            type="text"
            placeholder="Search by job title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
              setJobs([]);
            }}
            className="w-full max-w-md mx-auto"
          />
        </div>

        {/* Render job cards */}
        <TabsContent value="">
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => renderJobCard(job))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No jobs available.</p>
          )}
        </TabsContent>

        {jobPortals.map((portal) => (
          <TabsContent key={portal} value={portal}>
            {selectedPortal === portal && jobs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => renderJobCard(job, setAppliedJobId))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No jobs available.</p>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Load more button */}
      <div className="mt-4 text-center">
        <button
          onClick={loadMoreJobs}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
}
