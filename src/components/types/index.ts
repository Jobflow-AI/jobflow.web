type JobStatus = {
    label: string;
    value: number;
  };
  
export interface IUser {
    id: string; // UUID
    name: string;
    email: string; // unique
    password?: string; // optional
    job_statuses: JobStatus[]; // array of job statuses
    bookmarked_jobs: string[]; // array of job IDs
    jobs: TrackedJob[]; // array of TrackedJob objects
    userJobs: UserJob[]; // array of UserJob objects
    created_at: Date; // DateTime
  };
  
type TrackedJob = {
    id: string; // UUID
    status: string; // default "applied"
    userId: string; // UUID
    jobId: string; // UUID
  };
  
type UserJob = {
    id: string; // UUID
    title: string;
    job_link?: string; // optional
    job_type?: string; // optional
    apply_link?: string; // optional
    job_location?: string; // optional
    job_salary?: string; // optional
    job_description?: string; // optional
    skills_required?: string; // optional
    source?: string; // optional
    source_logo?: string; // optional
    posted?: Date; // optional, default now()
    status: string; // default "applied"
    userId: string; // UUID
    companyId?: string; // optional, UUID
  };


  export interface Task {
    id: string;
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    date: string;
    assignees: User[];
  }
  
  export interface User {
    id: string;
    name: string;
    avatar: string;
  }
  
  export interface Column {
    id: string;
    title: string;
    count: number;
    tasks: Task[];
  }
  
  export interface Tag {
    id: string;
    name: string;
    color: string;
  }