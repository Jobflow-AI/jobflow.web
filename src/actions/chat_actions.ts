'use server'

import type { Job } from "@/types/job"
import { getCookie } from "./get_cookie";

interface JobsResponse {
  jobs: Job[]
}

export const fetchJobs = async (chatdata: any) => {
  console.log("Sending API request with data:", chatdata);
  const token = await getCookie("token");
  
  try {    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({
        question: chatdata,
      }),
    })
    
    console.log("API response status:", response);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }
    
    const data = await response.json()
    console.log("API response data received:", data);
    return data
  } catch (error) {
    console.error("Error fetching jobs:", error)
    throw error; // Re-throw to handle in the component
  }
}