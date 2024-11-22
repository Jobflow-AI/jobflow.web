import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from "./CustomCard";

export const renderJobCard = (job: any) => (
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