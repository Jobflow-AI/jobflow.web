'use server'

import { getCookie } from "./get_cookie";

export const scrapeAndCreateJobs = async() => {
    try {
      console.log("inside scrapte")
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
  
      const data = await res.json();
  
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error Scraping: ${error.message}`);
      } else {
        throw new Error(
          "An unknown error occurred while scraping"
        );
      }
    }
}


export const getJobData = async(page=1, portal='', title='') => {
    // const token = await getCookie("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/get?page=${page}&portal=${portal}&title=${title}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
          cache: "no-cache",
          next: {
            tags: ["jobData"],
          },
        }
      );
  
      console.log('here')
      const data = await res.json();
      console.log("here is the jobs" ,data)
  
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error in fetching job data: ${error.message}`);
      } else {
        throw new Error(
          "An unknown error occurred while fetching job data"
        );
      }
    }
}

export const getJobById = async(jobId: string) => {
   console.log(jobId, "here")
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/get/id?jobId=${jobId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-cache",
          next: {
            tags: ["jobData"],
          },
        }
      );
  
      const data = await res.json();
  
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error in fetching job data: ${error.message}`);
      } else {
        throw new Error(
          "An unknown error occurred while fetching job data"
        );
      }
    }
}

export const scrapeJob = async(portal: string, url: string) => {
    // const token = await getCookie("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/scrape?portal=${portal}&url=${url}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
  
      const data = await res.json();
  
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error in fetching job data: ${error.message}`);
      } else {
        throw new Error(
          "An unknown error occurred while fetching job data"
        );
      }
    }
}

export const getCompaniesList = async() => {
    // const token = await getCookie("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/get/company/list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
          next: {
            tags: ["companyData"],
          },
        }
      );
  
      const data = await res.json();
  
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error in fetching job data: ${error.message}`);
      } else {
        throw new Error(
          "An unknown error occurred while fetching job data"
        );
      }
    }
}