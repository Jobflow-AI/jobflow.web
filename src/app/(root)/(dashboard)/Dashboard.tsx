"use client";

import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shared/CustomCard";
import { getJobData } from "@/actions/data_actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Loader from "@/components/shared/Loader";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";

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

  // Load more jobs
  const loadMoreJobs = () => setPage((prevPage) => prevPage + 1);

  // Render job card
  const renderJobCard = (job: any) => (
    <Card key={job._id} className="relative m-3 p-5 w-[350px] border rounded-lg shadow-md bg-white">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {job.company?.logo !== 'n/a' && <img
            src={job.company?.logo}
            alt={`${job.company?.name} logo`}
            className="w-10 h-10 rounded-full object-cover"
          />}
          <div>
            <CardTitle className="text-lg font-bold">{job.company?.name || "No Company Name"}</CardTitle>
            <CardDescription className="text-sm text-gray-500">{job.title || "No Title"}</CardDescription>
          </div>
        </div>
        <span className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
          {job.source || "Remote"}
        </span>
      </CardHeader>

      <CardContent className="mt-3">
        <div className="flex flex-col space-y-2 text-sm text-gray-600">
          <p>
            Salary: <span className="font-medium">{job.job_salary || "Not Available"}</span>
          </p>
          <p>
            Work Type: <span className="font-medium">{job.work_type || "Remote"}</span>
          </p>
          <p>
            Location: <span className="font-medium">{job.job_location.slice(0, 150) || "Not available"}</span>
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between mt-4">
        <a
          href="#"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:underline"
        >
          View Job
        </a>
        <a href={job.job_link} target="_blank" >
        <button className="bg-blue-500 text-white py-1 px-3 text-xs rounded-lg hover:bg-blue-600">
        Apply
        </button>
        </a>
      </CardFooter>
    </Card>
  );

  return (
    <div className="p-4">
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
              {jobs.map(renderJobCard)}
            </div>
          ) : (
            <p className="text-center text-gray-500">No jobs available.</p>
          )}
        </TabsContent>

        {jobPortals.map((portal) => (
          <TabsContent key={portal} value={portal}>
            {selectedPortal === portal && jobs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map(renderJobCard)}
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
