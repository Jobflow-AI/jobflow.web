import type { Job } from "@/types/job"

interface JobsResponse {
  jobs: Job[]
}

export const fetchJobs = async (chatdata: any) => {
  console.log("Sending API request with data:", chatdata);
  
  try {
    const apiUrl = "http://127.0.0.1:5000/api/chat?mock=true"
    
    console.log("API URL:", apiUrl);
    
    const response = await fetch("http://127.0.0.1:5000/api/chat?mock=true", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include credentials for cross-origin requests
      mode: "cors", // Explicitly set CORS mode
      body: JSON.stringify({
        question: chatdata,
      }),
    })
    
    console.log("API response status:", response.status);
    
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