'use client'

import React, { useState } from 'react'
import { Edit, Save, AlertCircle } from 'lucide-react'
import { uploadResume, saveUserData } from '@/actions/user_actions'
import { useAppDispatch } from '@/redux/hooks'
import toast from 'react-hot-toast'
import { userData } from '@/redux/slices/userSlice'
import UploadComponent from './_components/upload'
import PersonalInfo from './_components/personal-info'
import Summary from './_components/summary'
import Experience from './_components/experience'
import Education from './_components/education'
import Skills from './_components/skills'
import Projects from './_components/projects'
import { uploadFileToS3 } from '@/actions/s3_actions'; // Import the function

interface ResumeData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    links: { type: string; url: string }[]
  }
  summary: string
  experience: {
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    description: string
  }[]
  education: {
    degree: string
    institution: string
    location: string
    startDate: string
    endDate: string
  }[]
  skills: string[]
  projects: {
    name: string
    description: string
    technologies: string[]
    link?: string
  }[]
}

const Page = () => {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const dispatch = useAppDispatch()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null) // Clear any previous errors
    }
  }

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    
    try {
        // Create FormData here instead of passing File directly
        const formData = new FormData();
        formData.append('resume', file);
        
        // Call the uploadResume action with FormData
        const response = await uploadResume(formData);

        console.log(response, "here is the response");

        if (!response.success) {
            throw new Error(response.message || "Failed to parse resume");
        }

        console.log(file, "here is the file")
        // Use the upload URL from the response to upload the file to S3
        await uploadFileToS3(file, response.upload_url);

        setIsUploading(false);
        setIsParsing(true);

        // After a brief delay to show the parsing state
        setTimeout(() => {
            setIsParsing(false);
            
            // Set the parsed data from the API response
            setResumeData(response.parsed_data);
        }, 1000);
    } catch (err: any) {
        setIsUploading(false);
        setIsParsing(false);
        setError(err.message || "An error occurred while uploading your resume");
        console.error("Resume upload error:", err);
    }
};

  console.log(resumeData,"this is resume data")

  const handleSave = async () => {
    if (!resumeData) return
    
    try {
      // Format the data as needed for your API
      const formData = new FormData();
      formData.append('resume', JSON.stringify(resumeData));
      
      // Call saveUserData instead of updateUser
      const response = await saveUserData(resumeData);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to save resume data")
      }
      dispatch(userData(response.user))
      
      toast.success("Resume data saved successfully!")
    } catch (err: any) {
      toast.error(err.message || "An error occurred while saving your resume data")
      console.error("Resume save error:", err)
    }
  }

  const handleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleInputChange = (section: keyof ResumeData, index: number | null, field: string, value: string) => {
    if (!resumeData) return

    setResumeData(prev => {
      if (!prev) return prev

      const updated = { ...prev }

      if (section === 'personalInfo') {
        if (field.startsWith('links')) {
          const [_, linkIndex, linkField] = field.split('.')
          const linkArray = [...updated.personalInfo.links] // Create a new array to avoid direct mutation
          const idx = parseInt(linkIndex)
          if (linkArray[idx] && (linkField === 'type' || linkField === 'url')) {
            linkArray[idx] = {
              ...linkArray[idx],
              [linkField]: value
            }
            updated.personalInfo.links = linkArray // Assign the new array back
          }
        } else {
          updated.personalInfo = {
            ...updated.personalInfo,
            [field as keyof typeof updated.personalInfo]: value
          }
        }
      } else if (index !== null && Array.isArray(updated[section])) {
        if (section === 'skills') {
          const skillsArray = [...updated.skills];
          skillsArray[index] = value;
          updated.skills = skillsArray;
        } else if (section === 'experience' || section === 'education' || section === 'projects') {
          const sectionArray = updated[section];
          if (Array.isArray(sectionArray) && sectionArray[index]) {
            const updatedItem = { ...sectionArray[index] };
            (updatedItem as any)[field] = value;
            sectionArray[index] = updatedItem;
          }
        }
      }

      return updated
    })
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Resume Parser</h1>
          <p className="text-xl text-gray-300">Upload your resume and we'll extract all the important details</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6 flex items-start">
            <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
            <p className="text-red-100">{error}</p>
          </div>
        )}

        {!resumeData ? (
          <UploadComponent 
            file={file}
            isUploading={isUploading}
            isParsing={isParsing}
            handleFileChange={handleFileChange}
            handleUpload={handleUpload}
          />
        ) : (
          <div className="bg-gray-800 rounded-xl shadow-2xl p-8 mb-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold">Resume Preview</h2>
              <div className="flex space-x-4">
                <button 
                  onClick={handleEdit}
                  className="flex items-center space-x-2 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <Edit size={18} />
                  <span>{isEditing ? 'Done Editing' : 'Edit'}</span>
                </button>
                <button 
                  onClick={handleSave}
                  className="flex items-center space-x-2 py-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 transition-colors"
                >
                  <Save size={18} />
                  <span>Save</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Using the PersonalInfo component */}
              <PersonalInfo 
                personalInfo={resumeData.personalInfo}
                isEditing={isEditing}
                handleInputChange={handleInputChange as (section: string, index: number | null, field: string, value: string) => void}
              />
              
              {/* Using the Summary component */}
              <Summary 
                summary={resumeData.summary}
                isEditing={isEditing}
                handleInputChange={handleInputChange as (section: string, index: number | null, field: string, value: string) => void}
              />
              
              {/* Using the Experience component */}
              <Experience 
                experience={resumeData.experience}
                isEditing={isEditing}
                handleInputChange={handleInputChange as (section: string, index: number | null, field: string, value: string) => void}
              />
              
              {/* Using the Education component */}
              <Education 
                education={resumeData.education}
                isEditing={isEditing}
                handleInputChange={handleInputChange as (section: string, index: number | null, field: string, value: string) => void}
              />
              
              {/* Using the Skills component */}
              <Skills 
                skills={resumeData.skills}
                isEditing={isEditing}
                handleInputChange={handleInputChange as (section: string, index: number | null, field: string, value: string) => void}
                setResumeData={setResumeData}
                resumeData={resumeData}
              />
              
              {/* Using the Projects component */}
              <Projects 
                projects={resumeData.projects}
                isEditing={isEditing}
                handleInputChange={handleInputChange as (section: string, index: number | null, field: string, value: string) => void}
                setResumeData={setResumeData}
                resumeData={resumeData}
              />

              {/* Final action buttons */}
              <div className="flex justify-end mt-8 space-x-4">
                <button 
                  onClick={() => setResumeData(null)}
                  className="py-2 px-6 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="py-2 px-6 rounded-lg bg-green-600 hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Save size={18} />
                  <span>Save and Continue</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page