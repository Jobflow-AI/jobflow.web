import React from 'react';

interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
}

interface EducationProps {
  education: EducationItem[];
  isEditing: boolean;
  handleInputChange: (section: string, index: number | null, field: string, value: string) => void;
}

const Education = ({ education, isEditing, handleInputChange }: EducationProps) => {
  return (
    <section className="bg-gray-700 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Education</h3>
      {education.map((edu, index) => (
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
  );
};

export default Education;