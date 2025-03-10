import React from 'react';

interface SummaryProps {
  summary: string;
  isEditing: boolean;
  handleInputChange: (section: string, index: number | null, field: string, value: string) => void;
}

const Summary = ({ summary, isEditing, handleInputChange }: SummaryProps) => {
  return (
    <section className="bg-gray-700 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Professional Summary</h3>
      <textarea 
        value={summary} 
        onChange={(e) => handleInputChange('summary', null, 'summary', e.target.value)}
        disabled={!isEditing}
        rows={4}
        className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white"
      />
    </section>
  );
};

export default Summary;