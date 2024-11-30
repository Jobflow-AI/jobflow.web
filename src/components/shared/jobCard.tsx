import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from "./CustomCard";

export const renderJobCard = (job: any, setAppliedJobId?: any, viewMode?: boolean) => {

    const handleApplyClick = () => {
        const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
        if (!appliedJobs.includes(job.id)) {
          appliedJobs.push(job.id);
          localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
          if(setAppliedJobId)  setAppliedJobId(job.id)
       
        }
      };

      return (
        <Card
          key={job._id}
          className="relative p-5 w-full overflow-auto max-w-[350px] border rounded-lg shadow-md bg-white"
        >
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex flex-col md:flex-row items-center space-x-3">
              {job.company?.logo !== 'n/a' && (
                <img
                  src={job.company?.company_logo}
                  alt={`${job.company?.company_name} logo`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <CardTitle className="text-lg font-bold">
                  {job.company?.company_name || "No Company Name"}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  {job.title || "No Title"}
                </CardDescription>
              </div>
            </div>
            <span className="mt-2 sm:mt-0 sm:absolute sm:top-3 sm:right-3 bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
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
      
          <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4">
            {viewMode ? (
              <a
                href={job.job_link}
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                View Job
              </a>
            ) : (
              <a href={job.job_link}>
                <button
                  onClick={handleApplyClick}
                  className="bg-blue-500 text-white py-1 px-3 text-xs rounded-lg hover:bg-blue-600 mt-2 sm:mt-0"
                >
                  Apply
                </button>
              </a>
            )}
          </CardFooter>
        </Card>
      );
};