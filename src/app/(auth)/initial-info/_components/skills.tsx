import React from 'react';
import { Trash2 } from 'lucide-react';

interface SkillsProps {
  skills: string[];
  isEditing: boolean;
  handleInputChange: (section: string, index: number | null, field: string, value: string) => void;
  setResumeData: React.Dispatch<React.SetStateAction<any>>;
  resumeData: any;
}

const Skills = ({ skills, isEditing, handleInputChange, setResumeData, resumeData }: SkillsProps) => {
  return (
    <section className="bg-gray-700 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Skills</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
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
  );
};

export default Skills;