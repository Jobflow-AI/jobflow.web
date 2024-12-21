import React, { useEffect, useState } from "react";
import { getCompaniesList, scrapeJob } from "@/actions/data_actions"; // Import your action
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { Command, CommandGroup, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Select from 'react-select';
import { useAppSelector } from "@/redux/hooks";
import { Country, State, City } from 'country-state-city';
import { createJob } from "@/actions/user_actions"; // Import the createJob action

const CreateJobModel = ({
  newJob,
  setNewJob,
  setIsModalOpen,
  defaultStatus
}: {
  newJob: any;
  setNewJob: any;
  setIsModalOpen: any;
  defaultStatus?: string
}) => {
  const user = useAppSelector(state => state.user.user)
  const [companies, setCompanies] = useState([]);
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [status, setStatus ] = useState(defaultStatus || "")
  const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [jobSource, setJobSource] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const jobTypes = ["Remote", "On-Site", "Full-time", "Part-time", "Contract", "Internship"];
  const jobSources= ['linkedin', 'ycombinator', 'glassdoor', 'foundit', 'internshala']
  const currencies = ["INR", "USD", "EUR", "GBP"];

  useEffect(() => {
    // Fetch companies list
    ( async () => {
      const {companies} = await getCompaniesList()
      setCompanies(companies)
    } )()
  }, []);

  useEffect(() => {
  (async () => {
     
  })()
  })

  useEffect(() => {
    // Fetch locations list using country-state-city package
    const fetchLocations = () => {
      const cities = City.getAllCities();
      // Limit to the first 50 cities initially
      setLocations(cities.slice(0, 50).map(city => ({ id: city.stateCode, name: city.name })));
    };

    fetchLocations();
  }, []);

  const handleLocationSearch = (searchTerm: string) => {
    const cities = City.getAllCities();
    // Ensure search term is trimmed and not empty
    if (searchTerm.trim()) {
      // Filter cities based on the search term using regex
      const filteredCities = cities.filter(city => 
        new RegExp(searchTerm, 'i').test(city.name)
      );
      setLocations(filteredCities.map(city => ({ id: city.stateCode, name: city.name })));
    } else {
      // Reset to initial list if search term is empty
      setLocations(cities.slice(0, 50).map(city => ({ id: city.stateCode, name: city.name })));
    }
  };

  // console.log(companies)

  const handleStatusChange = (selectedStatuses: string[]) => {
    setStatus(selectedStatuses.join(", "));
    setNewJob({ ...newJob, status: selectedStatuses });
  };

  const handleJobLinkChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setJobLink(link);

    try {
      const response = await scrapeJob(jobSource, link);
      console.log(response, "here is response");

      // Map the response to the form fields
      setNewJob({
        ...newJob,
        title: response.title || newJob.title,
        company: response.company_name || newJob.company,
        location: response.job_location || newJob.location,
        salary: response.job_salary || newJob.salary,
        source: response.source || newJob.source,
      });
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  const handleCreateJob = async () => {
    const formattedJobDetails = {
      title: newJob.title?.toLowerCase(),
      job_link: jobLink || null,
      companyId: newJob.company_id || null,
      job_location: newJob.location?.toLowerCase() || null,
      job_type: newJob.jobType?.toLowerCase() || null,
      job_salary: newJob.salary || null,
      source: jobSource?.toLowerCase() || null,
      posted: newJob.posted || new Date().toISOString(),
      status: status || null
    };

    console.log(formattedJobDetails, "here")

    try {
      const response = await createJob(formattedJobDetails);
      console.log("Response", response);
      if(response.success){
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative max-h-[80vh] overflow-y-auto">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          onClick={() => setIsModalOpen(false)}
        >
          &times;
        </button>

        {/* Title */}
        <h3 className="text-2xl font-semibold mb-6">Create Job</h3>

        {/* Job Source and Link */}
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Job Source
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn("w-full justify-between text-left")}
                >
                  <span className="flex-1 truncate">
                    {jobSource || "Select job source"}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search job source..." />
                  <CommandList>
                    <CommandEmpty>No source found.</CommandEmpty>
                    <CommandGroup>
                      {jobSources.map((source) => (
                        <CommandItem
                          value={source}
                          key={source}
                          onSelect={() => setJobSource(source)}
                          className="cursor-pointer"
                        >
                          {source}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1 relative">
            <label className="block text-sm font-medium text-gray-700">
              Job Link
            </label>
            <Input
              type="text"
              value={jobLink}
              onChange={handleJobLinkChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter job link"
            />
            {isFetching && (
              <div className="absolute right-2 top-2">
                <span className="loader"></span> {/* Add your loader component or CSS here */}
              </div>
            )}
          </div>
        </div>

        {/* Job title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Job title
          </label>
          <Input
            type="text"
            value={newJob.title || ""}
            onChange={(e) => setNewJob({ ...newJob, eventName: e.target.value })}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter Job Title"
          />
        </div>

         {/* Status Selection */}
         <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn("w-full justify-between text-left")}
              >
                <span className="flex-1 truncate">
                  {status || "Select status"}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search status..." />
                <CommandList>
                  <CommandEmpty>No status found.</CommandEmpty>
                  <CommandGroup>
                    {user.job_statuses.map((statusOption: string) => (
                      <CommandItem
                        value={statusOption}
                        key={statusOption}
                        onSelect={() => handleStatusChange([statusOption])}
                        className="cursor-pointer"
                      >
                        {statusOption}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Company Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Company
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn("w-full justify-between text-left")}
              >
                <span className="flex-1 truncate">
                  {selectedCompany || "Select company"}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search company..." />
                <CommandList>
                <CommandItem
                    onSelect={() => setIsCreatingCompany(true)}
                    className="cursor-pointer text-blue-600"
                  >
                    + Create New Company
                  </CommandItem>
                  <CommandEmpty>No company found.</CommandEmpty>
                  <CommandGroup>
                    {companies?.map((company: any) => (
                      <CommandItem
                        value={company.company_name}
                        key={company.id}
                        onSelect={() => {
                          setSelectedCompany(company.company_name);
                          setNewJob({ ...newJob, company: company.company_name, company_id: company.id });
                        }}
                        className="cursor-pointer"
                      >
                        {company.company_name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                 
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* New Company Fields */}
        {isCreatingCompany && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                New Company Name
              </label>
              <Input
                type="text"
                value={newJob.newCompanyName || ""}
                onChange={(e) =>
                  setNewJob({ ...newJob, newCompanyName: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter new company name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Company Logo
              </label>
              <Input
                type="file"
                onChange={(e) =>
                  setNewJob({ ...newJob, companyLogo: e.target.files?.[0] })
                }
                className="mt-1 block w-full text-gray-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Company Description
              </label>
              <textarea
                value={newJob.companyDescription || ""}
                onChange={(e) =>
                  setNewJob({ ...newJob, companyDescription: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter company description"
              />
            </div>
          </>
        )}

        {/* Job description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <Textarea
            value={newJob.description || ""}
            onChange={(e) =>
              setNewJob({ ...newJob, description: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Tell about job"
          />
        </div>

        {/* Location and Job Type */}
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn("w-full justify-between text-left")}
                >
                  <span className="flex-1 truncate">
                    {selectedLocation || "Choose location"}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                <CommandInput 
                    placeholder="Search location..." 
                    onValueChange={(value) => handleLocationSearch(value)} 
                    />
                  <CommandList>
                    <CommandEmpty>No location found.</CommandEmpty>
                    <CommandGroup>
                      {locations?.map((location: any) => (
                        <CommandItem
                          value={location.name}
                          key={location.id}
                          onSelect={() => {
                            setSelectedLocation(location.name);
                            setNewJob({ ...newJob, location: location.name });
                          }}
                          className="cursor-pointer"
                        >
                          {location.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Job Type
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn("w-full justify-between text-left")}
                >
                  <span className="flex-1 truncate">
                    {newJob.jobType || "Select job type"}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search job type..." />
                  <CommandList>
                    <CommandEmpty>No job type found.</CommandEmpty>
                    <CommandGroup>
                      {jobTypes.map((type) => (
                        <CommandItem
                          value={type}
                          key={type}
                          onSelect={() => setNewJob({ ...newJob, jobType: type })}
                          className="cursor-pointer"
                        >
                          {type}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Salary Range */}
        <div className="mb-4 ">
          <label className="block text-sm font-medium text-gray-700">
            Salary Range
          </label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn("flex-1 justify-between text-left")}
                >
                  <span className="flex-1 truncate">
                    {newJob.currency || "INR"}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search currency..." />
                  <CommandList>
                    <CommandEmpty>No currency found.</CommandEmpty>
                    <CommandGroup>
                      {currencies.map((currency) => (
                        <CommandItem
                          value={currency}
                          key={currency}
                          onSelect={() =>
                            setNewJob({ ...newJob, currency: currency })
                          }
                          className="cursor-pointer"
                        >
                          {currency}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Input
              type="number"
              value={newJob.salary || ""}
              onChange={(e) =>
                setNewJob({ ...newJob, salary: e.target.value })
              }
              className="flex-2"
              placeholder="Enter salary"
            />
          </div>
        </div>

        {/* Upload Attachments */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Upload Attachments
          </label>
          <Input
            type="file"
            onChange={(e) =>
              setNewJob({ ...newJob, file: e.target.files?.[0] })
            }
            className="mt-1 block w-full text-gray-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 sticky bottom-0">
          <button
            className="btn-secondary px-4 py-2 text-sm"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm btn-primary"
            onClick={handleCreateJob}
          >
            Track Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateJobModel;