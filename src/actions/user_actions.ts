"use server"
import { revalidateTag } from "next/cache";
import { getCookie } from "./get_cookie";


export const registerUser = async(data: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );
  
      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message || "Registration failed");
      }
  
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, message: `Error in registering user: ${error.message}` };
      } else {
        return { success: false, message: "An unknown error occurred while registering user" };
      }
    }
}

export const loginUser = async(data: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );
  
      const response = await res.json();
      console.log("here is the user" , response)
  
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error in login user: ${error.message}`);
      } else {
        throw new Error(
          "An unknown error occurred while login user"
        );
      }
    }
}


export const getUser = async () => {
    const token = await getCookie("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/get`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `token=${token}`,
          },
          credentials: "include",
          cache: "force-cache",
          next: {
            tags: ["userData"],
          },
        }
      );
  
      const data = await res.json();

      return data;
    } catch (error: unknown) {
      console.log(error)
  };
}

export const updateUser = async (data: any) => {
    const token = await getCookie("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Cookie: `token=${token}`,
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );
  
      const response = await res.json();
      revalidateTag('userData')

      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error in fetching logged in user: ${error.message}`);
      } else {
        throw new Error(
          "An unknown error occurred while fetching logged in user"
        );
      }
    }
  };

export const getYourJobs = async () => {
    const token = await getCookie("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/jobs/get`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `token=${token}`,
          },
          credentials: "include",
          // cache: "force-cache",
          // next: {
          //   tags: ["jobData"],
          // },
        }
      );
  
      const data = await res.json();

      return data;
    } catch (error: any) {
      return { success: false, error: error.message || "Unknown error" };

    }
  };


  export const applyJob = async (jobId: string, status: string) => {
    const token = await getCookie("token");  
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/job/track?jobId=${jobId}&status=${status}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `token=${token}`,
          },
          credentials: "include",
        }
      );
  
      return await res.json();
    } catch (error: any) {
      console.error("Error in applyJob:", error);
      return { success: false, error: error.message || "Unknown error" };
    }
  };

  export const createJob = async (jobDetails: any) => {
    const token = await getCookie("token");  
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/job/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `token=${token}`,
          },
          body: JSON.stringify(jobDetails),
          credentials: "include",
        }
      );
  
      return await res.json();
    } catch (error: any) {
      console.error("Error in applyJob:", error);
      return { success: false, error: error.message || "Unknown error" };
    }
  };
  
  
  export const updateJobStatus = async (jobId: string, status: string) => {
    const token = await getCookie("token");    
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/job/update/status?jobId=${jobId}&status=${status}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Cookie: `token=${token}`,
          },
          credentials: "include",
        }
      );
  
      return await res.json();
    } catch (error: any) {
      console.error("Error in updating status:", error);
      return { success: false, error: error.message || "Unknown error" };
    }
  };
  
  // In your user_actions.ts file, modify the uploadResume function:
  export const uploadResume = async (formData: FormData) => {
    const token = await getCookie("token");
    
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/resume/upload`,
        {
          method: "POST",
          headers: {
            Cookie: `token=${token}`,
          },
          body: formData,
          credentials: "include",
        }
      );
      
      const parsedData = await res.json();
      
      return parsedData;
    } catch (error: any) {
      console.error("Error in uploading resume:", error);
      return { 
        success: false, 
        error: error.message || "Unknown error",
        message: "Failed to upload and parse resume" 
      };
    }
  };
  
  // In your user_actions.ts file, modify the uploadResume function:
  export const saveUserData = async (data: any) => {
    const token = await getCookie("token");
    try {
      console.log(data, "here is data")

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/info/update`,
        {
          method: "POST",
          headers: {
            Cookie: `token=${token}`,
          },
          body: data,
          credentials: "include",
        }
      );
      
      const user = await res.json();
      
      return user;
    } catch (error: any) {
      console.error("Error in updating user:", error);
      return { 
        success: false, 
        error: error.message || "Unknown error",
        message: "Failed to update user information" 
      };
    }
  };
  
  