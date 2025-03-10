import React from 'react';
import { Trash2 } from 'lucide-react';

interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

interface ProjectsProps {
  projects: Project[];
  isEditing: boolean;
  handleInputChange: (section: string, index: number | null, field: string, value: string) => void;
  setResumeData: React.Dispatch<React.SetStateAction<any>>;
  resumeData: any;
}

const Projects = ({ projects, isEditing, handleInputChange, setResumeData, resumeData }: ProjectsProps) => {
  return (
    <section className="bg-gray-700 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Projects</h3>
      {projects.map((project, index) => (
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
  );
};

export default Projects;