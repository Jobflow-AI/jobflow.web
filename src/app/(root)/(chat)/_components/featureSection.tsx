import React from 'react';

const FeatureSection = () => {
  return (
    <div className="bg-zinc-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Feature 1</h3>
            <p className="text-gray-400">Description of feature 1.</p>
          </div>
          <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Feature 2</h3>
            <p className="text-gray-400">Description of feature 2.</p>
          </div>
          <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Feature 3</h3>
            <p className="text-gray-400">Description of feature 3.</p>
          </div>
          {/* Add more features as needed */}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;