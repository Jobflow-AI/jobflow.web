export interface Company {
    about: string | null
    company_link: string | null
    company_logo: string | null
    company_name: string
    description: string | null
    id: string
    jobs: any[] | null
    socials: any[] | null
    trackedJobs: any[] | null
  }
  
  export interface Job {
    apply_link: string | null
    company: Company
    companyId: string
    created_at: string
    experience: string | null
    experience_max: string | null
    experience_min: string | null
    id: string
    job_description: string | null
    job_id: string
    job_link: string
    job_location: string
    salary_min: string
    salary_max: string
    job_salary: string   
    job_type: string
    posted: string
    skills_required: string
    source: string
    source_logo: string | null
    title: string
  }
  
  