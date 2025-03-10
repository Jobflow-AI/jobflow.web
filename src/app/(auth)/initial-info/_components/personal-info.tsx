import React from 'react';

interface PersonalInfoProps {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    links: { type: string; url: string }[];
  };
  isEditing: boolean;
  handleInputChange: (section: string, index: number | null, field: string, value: string) => void;
}

const PersonalInfo = ({ personalInfo, isEditing, handleInputChange }: PersonalInfoProps) => {
  return (
    <section className="bg-gray-700 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 mb-1">Full Name</label>
          <input 
            type="text" 
            value={personalInfo.name} 
            onChange={(e) => handleInputChange('personalInfo', null, 'name', e.target.value)}
            disabled={!isEditing}
            className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Email</label>
          <input 
            type="email" 
            value={personalInfo.email} 
            onChange={(e) => handleInputChange('personalInfo', null, 'email', e.target.value)}
            disabled={!isEditing}
            className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Phone</label>
          <input 
            type="text" 
            value={personalInfo.phone} 
            onChange={(e) => handleInputChange('personalInfo', null, 'phone', e.target.value)}
            disabled={!isEditing}
            className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Location</label>
          <input 
            type="text" 
            value={personalInfo.location} 
            onChange={(e) => handleInputChange('personalInfo', null, 'location', e.target.value)}
            disabled={!isEditing}
            className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white"
          />
        </div>
      </div>
      
      <div className="mt-4">
        <label className="block text-gray-400 mb-1">Links</label>
        {personalInfo.links.map((link, index) => (
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
  );
};

export default PersonalInfo;