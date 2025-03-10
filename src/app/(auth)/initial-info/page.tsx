'use client'

import React, { useState } from 'react'
import { Upload, FileType, Edit, Save, Trash2, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { uploadResume, saveUserData } from '@/actions/user_actions'
import { updateUser } from '@/actions/user_actions'

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


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null) // Clear any previous errors
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)
    
    try {
      // Create FormData here instead of passing File directly
      const formData = new FormData();
      formData.append('resume', file);
      
      // Call the uploadResume action with FormData
      const response = await uploadResume(formData)

      console.log(response, "here is the repnsose")
      
      setIsUploading(false)
      setIsParsing(true)
      
      if (!response.success) {
        throw new Error(response.message || "Failed to parse resume")
      }
      
      // After a brief delay to show the parsing state
      setTimeout(() => {
        setIsParsing(false)
        
        // Set the parsed data from the API response
        setResumeData(response.parsed_data)
      }, 1000)
    } catch (err: any) {
      setIsUploading(false)
      setIsParsing(false)
      setError(err.message || "An error occurred while uploading your resume")
      console.error("Resume upload error:", err)
    }
  }

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
      
      alert("Resume data saved successfully!")
    } catch (err: any) {
      setError(err.message || "An error occurred while saving your resume data")
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
          <div className="bg-gray-800 rounded-xl shadow-2xl p-8 mb-8">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
                <Upload size={40} className="text-blue-400" />
              </div>
              
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">Upload Your Resume</h2>
                <p className="text-gray-400 mb-6">Supported formats: PDF, DOCX, TXT</p>
              </div>
              
              <label className="relative cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                <span>Choose File</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.docx,.txt" 
                  onChange={handleFileChange}
                  disabled={isUploading || isParsing}
                />
              </label>
              
              {file && (
                <div className="flex items-center space-x-2 text-gray-300">
                  <FileType size={20} />
                  <span>{file.name}</span>
                </div>
              )}
              
              <button
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  file ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                onClick={handleUpload}
                disabled={!file || isUploading || isParsing}
              >
                {isUploading ? 'Uploading...' : isParsing ? 'Parsing...' : 'Upload & Parse Resume'}
              </button>
            </div>
          </div>
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
              {/* Personal Information */}
              <section className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={resumeData.personalInfo.name} 
                      onChange={(e) => handleInputChange('personalInfo', null, 'name', e.target.value)}
                      disabled={!isEditing}
                      className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={resumeData.personalInfo.email} 
                      onChange={(e) => handleInputChange('personalInfo', null, 'email', e.target.value)}
                      disabled={!isEditing}
                      className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Phone</label>
                    <input 
                      type="text" 
                      value={resumeData.personalInfo.phone} 
                      onChange={(e) => handleInputChange('personalInfo', null, 'phone', e.target.value)}
                      disabled={!isEditing}
                      className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Location</label>
                    <input 
                      type="text" 
                      value={resumeData.personalInfo.location} 
                      onChange={(e) => handleInputChange('personalInfo', null, 'location', e.target.value)}
                      disabled={!isEditing}
                      className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-gray-400 mb-1">Links</label>
                  {resumeData.personalInfo.links.map((link, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input 
                        type="text" 
                        value={link.type} 
                        onChange={(e) => handleInputChange('personalInfo', null, `links.${index}.type`, e.target.value)}
                        disabled={!isEditing}
                        className="w-1/4 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white"
                      />
                      <input 
                        type="url" 
                        value={link.url} 
                        onChange={(e) => handleInputChange('personalInfo', null, `links.${index}.url`, e.target.value)}
                        disabled={!isEditing}
                        className="w-3/4 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white"
                      />
                    </div>
                  ))}
                </div>
              </section>
              
              {/* Summary */}
              <section className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Professional Summary</h3>
                <textarea 
                  value={resumeData.summary} 
                  onChange={(e) => handleInputChange('summary', null, 'summary', e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white"
                />
              </section>
              
              {/* Experience */}
              <section className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Work Experience</h3>
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="mb-6 p-4 bg-gray-800 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-400 mb-1">Job Title</label>
                        <input 
                          type="text" 
                          value={exp.title} 
                          onChange={(e) => handleInputChange('experience', index, 'title', e.target.value)}
                          disabled={!isEditing}
                          className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-1">Company</label>
                        <input 
                          type="text" 
                          value={exp.company} 
                          onChange={(e) => handleInputChange('experience', index, 'company', e.target.value)}
                          disabled={!isEditing}
                          className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-1">Company</label>
                        <input 
                          type="text" 
                          value={exp.company} 
                          onChange={(e) => handleInputChange('experience', index, 'company', e.target.value)}
                          disabled={!isEditing}
                          className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* Experience section - fixing the duplicate company field and adding missing fields */}
<section className="bg-gray-700 rounded-lg p-6">
  <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Work Experience</h3>
  {resumeData.experience.map((exp, index) => (
    <div key={index} className="mb-6 p-4 bg-gray-800 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-400 mb-1">Job Title</label>
          <input 
            type="text" 
            value={exp.title} 
            onChange={(e) => handleInputChange('experience', index, 'title', e.target.value)}
            disabled={!isEditing}
            className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Company</label>
          <input 
            type="text" 
            value={exp.company} 
            onChange={(e) => handleInputChange('experience', index, 'company', e.target.value)}
            disabled={!isEditing}
            className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Location</label>
          <input 
            type="text" 
            value={exp.location} 
            onChange={(e) => handleInputChange('experience', index, 'location', e.target.value)}
            disabled={!isEditing}
            className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-gray-400 mb-1">Start Date</label>
            <input 
              type="text" 
              value={exp.startDate} 
              onChange={(e) => handleInputChange('experience', index, 'startDate', e.target.value)}
              disabled={!isEditing}
              className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">End Date</label>
            <input 
              type="text" 
              value={exp.endDate} 
              onChange={(e) => handleInputChange('experience', index, 'endDate', e.target.value)}
              disabled={!isEditing}
              className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-gray-400 mb-1">Description</label>
        <textarea 
          value={exp.description} 
          onChange={(e) => handleInputChange('experience', index, 'description', e.target.value)}
          disabled={!isEditing}
          rows={3}
          className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"
        />
      </div>
    </div>
  ))}
</section>

{/* Education */}
<section className="bg-gray-700 rounded-lg p-6">
  <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Education</h3>
  {resumeData.education.map((edu, index) => (
    <div key={index} className="mb-6 p-4 bg-gray-800 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-400 mb-1">Degree</label>
          <input 
            type="text" 
            value={edu.degree} 
            onChange={(e) => handleInputChange('education', index, 'degree', e.target.value)}
            disabled={!isEditing}
            className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Institution</label>
          <input 
            type="text" 
            value={edu.institution} 
            onChange={(e) => handleInputChange('education', index, 'institution', e.target.value)}
            disabled={!isEditing}
            className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Location</label>
          <input 
            type="text" 
            value={edu.location} 
            onChange={(e) => handleInputChange('education', index, 'location', e.target.value)}
            disabled={!isEditing}
            className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-gray-400 mb-1">Start Year</label>
            <input 
              type="text" 
              value={edu.startDate} 
              onChange={(e) => handleInputChange('education', index, 'startDate', e.target.value)}
              disabled={!isEditing}
              className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">End Year</label>
            <input 
              type="text" 
              value={edu.endDate} 
              onChange={(e) => handleInputChange('education', index, 'endDate', e.target.value)}
              disabled={!isEditing}
              className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  ))}
</section>

{/* Skills */}
<section className="bg-gray-700 rounded-lg p-6">
  <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Skills</h3>
  <div className="flex flex-wrap gap-2">
    {resumeData.skills.map((skill, index) => (
      <div key={index} className="bg-gray-800 rounded-lg px-3 py-2 flex items-center">
        {isEditing ? (
          <input
            type="text"
            value={skill}
            onChange={(e) => handleInputChange('skills', index, '', e.target.value)}
            className="bg-gray-900 border border-gray-600 rounded-md py-1 px-2 text-white text-sm w-full"
          />
        ) : (
          <span>{skill}</span>
        )}
        {isEditing && (
          <button 
            className="ml-2 text-gray-400 hover:text-red-500"
            onClick={() => {
              if (!resumeData) return;
              const updatedSkills = [...resumeData.skills];
              updatedSkills.splice(index, 1);
              setResumeData({...resumeData, skills: updatedSkills});
            }}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    ))}
    {isEditing && (
      <button 
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2 text-sm"
        onClick={() => {
          if (!resumeData) return;
          setResumeData({...resumeData, skills: [...resumeData.skills, "New Skill"]});
        }}
      >
        + Add Skill
      </button>
    )}
  </div>
</section>

{/* Projects */}
<section className="bg-gray-700 rounded-lg p-6">
  <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Projects</h3>
  {resumeData.projects.map((project, index) => (
    <div key={index} className="mb-6 p-4 bg-gray-800 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-gray-400 mb-1">Project Name</label>
          <input 
            type="text" 
            value={project.name} 
            onChange={(e) => handleInputChange('projects', index, 'name', e.target.value)}
            disabled={!isEditing}
            className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-400 mb-1">Description</label>
          <textarea 
            value={project.description} 
            onChange={(e) => handleInputChange('projects', index, 'description', e.target.value)}
            disabled={!isEditing}
            rows={2}
            className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-400 mb-1">Project Link</label>
          <input 
            type="url" 
            value={project.link || ''} 
            onChange={(e) => handleInputChange('projects', index, 'link', e.target.value)}
            disabled={!isEditing}
            className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-400 mb-1">Technologies Used</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.technologies.map((tech, techIndex) => (
              <div key={techIndex} className="bg-gray-900 rounded-lg px-3 py-1 flex items-center">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={tech}
                      onChange={(e) => {
                        const updatedTechnologies = [...project.technologies];
                        updatedTechnologies[techIndex] = e.target.value;
                        handleInputChange('projects', index, 'technologies', JSON.stringify(updatedTechnologies));
                      }}
                      className="bg-gray-900 border-none text-white text-sm w-full"
                    />
                    <button 
                      className="ml-2 text-gray-400 hover:text-red-500"
                      onClick={() => {
                        const updatedTechnologies = [...project.technologies];
                        updatedTechnologies.splice(techIndex, 1);
                        handleInputChange('projects', index, 'technologies', JSON.stringify(updatedTechnologies));
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                ) : (
                  <span className="text-sm">{tech}</span>
                )}
              </div>
            ))}
            {isEditing && (
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-2 py-1 text-xs"
                onClick={() => {
                  const updatedTechnologies = [...project.technologies, "New Tech"];
                  handleInputChange('projects', index, 'technologies', JSON.stringify(updatedTechnologies));
                }}
              >
                + Add
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  ))}
  {isEditing && (
    <button 
      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 mt-2"
      onClick={() => {
        if (!resumeData) return;
        const newProject = {
          name: "New Project",
          description: "Project description",
          technologies: ["Tech 1", "Tech 2"],
          link: ""
        };
        setResumeData({...resumeData, projects: [...resumeData.projects, newProject]});
      }}
    >
      + Add Project
    </button>
  )}
</section>

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