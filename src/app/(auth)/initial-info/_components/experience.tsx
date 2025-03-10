import React from 'react';

interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ExperienceProps {
  experience: ExperienceItem[];
  isEditing: boolean;
  handleInputChange: (section: string, index: number | null, field: string, value: string) => void;
}

const Experience = ({ experience, isEditing, handleInputChange }: ExperienceProps) => {
  return (
    <section className="bg-gray-700 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Work Experience</h3>
      {experience.map((exp, index) => (
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
  );
};

export default Experience;