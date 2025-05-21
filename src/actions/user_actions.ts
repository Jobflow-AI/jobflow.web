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
            "Authorization": `Bearer ${token}`,          },
          credentials: "include",
          // cache: "force-cache",
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
            "Authorization": `Bearer ${token}`,
          },
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

export const addUserJobStatuses = async (data: any) => {
    const token = await getCookie("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/jobstatus/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
  
      const response = await res.json();
      revalidateTag('userData');
      
      // Add user data to response
      const userResponse = await getUser();
      return { 
        ...response,
        user: userResponse.user 
      };
      
    } catch (error: unknown) {
      console.error("Error adding job status:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
};

// Apply the same pattern to update and delete functions
export const updateUserJobStatuses = async (id: string, data: any) => {
    const token = await getCookie("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/jobstatus/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
  
      const response = await res.json();
      revalidateTag('userData');
      
      // Add fresh user data
      const userResponse = await getUser();
      return { 
        ...response,
        user: userResponse.user 
      };
      
    } catch (error: unknown) {
      console.error("Error updating job status:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
};

export const deleteUserJobStatuses = async (id: string) => {
    const token = await getCookie("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/jobstatus/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
  
      const response = await res.json();
      revalidateTag('userData');
      
      // Get updated user data
      const userResponse = await getUser();
      return { 
        ...response,
        user: userResponse.user 
      };
      
    } catch (error: unknown) {
      console.error("Error deleting job status:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
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
            "Authorization": `Bearer ${token}`,
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
            "Authorization": `Bearer ${token}`,
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
  
  
  export const updateJobStatus = async (jobId: string, status: string) => {
    const token = await getCookie("token");    
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/job/update/status?jobId=${jobId}&status=${status}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
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
    console.log(token, "here is the token")
    console.log(formData, "here is the form data")
    
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/resume/upload`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
          credentials: "include",
        }
      );
      
      const parsedData = await res.json();
      console.log(parsedData, "here is the parsed data")
      
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
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(data),
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
  
  