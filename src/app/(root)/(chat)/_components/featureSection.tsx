import React, { useState } from 'react';
import { FaHubspot, FaSlack, FaDropbox, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import { SiWebflow, SiMailchimp, SiZoom } from 'react-icons/si';

const FeatureSection = () => {
  const [activeTab, setActiveTab] = useState('Tracker');

  return (
    <div className="bg-black text-white py-4">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Empower Your Future with Intelligent Automation</h1>
        <p className="text-lg text-gray-400 mb-8">
          Revolutionize your daily tasks and streamline communication with AI-driven automation built for efficiency
        </p>
        <img src="/landing2.png" alt="Feature Image" className="mx-auto mb-8" />
        <div className="flex justify-center gap-4 mb-12">
          <button className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition">
            Try Now
          </button>
          <button className="px-6 py-3 bg-gray-800 text-white rounded-full font-semibold hover:bg-gray-700 transition">
            Learn More
          </button>
        </div>
     
        <div className="flex justify-center gap-8 m-14  ">
          <FaHubspot className="h-8 w-8 text-white" />
          <SiWebflow className="h-8 w-8 text-white" />
          <FaSlack className="h-8 w-8 text-white" />
          <SiMailchimp className="h-8 w-8 text-white" />
          <FaDropbox className="h-8 w-8 text-white" />
          <SiZoom className="h-8 w-8 text-white" />
        </div>
        {/* New Feature Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Discover the Features That Make JobFlow So Easy to Use</h2>
            <div className="flex justify-center gap-8 mb-12">
              <button
                className={`text-lg font-semibold ${activeTab === 'Tracker' ? 'text-white border-b-2 border-black' : 'text-gray-500'}`}
                onClick={() => setActiveTab('Tracker')}
              >
                Tracker
              </button>
              <button
                className={`text-lg font-semibold ${activeTab === 'Extension' ? 'text-white border-b-2 border-black' : 'text-gray-500'}`}
                onClick={() => setActiveTab('Extension')}
              >
                Extension
              </button>
            </div>
            <div className="flex justify-between items-center">
              {activeTab === 'Tracker' ? (
                <>
                  <div className="max-w-md">
                    <h3 className="text-xl font-bold mb-4">Tracker Features</h3>
                    <p className="text-lg mb-4">✔️ Tracker: Allows you to track used Kanban board types of design. You can toggle between both tabs to manage your workflow efficiently.</p>
                    <p className="text-lg">✔️ Kanban Boards: Agile and DevOps teams can use flexible Kanban boards to visualize workflows, limit work-in-progress, and maximize efficiency.</p>
                  </div>
                  <img src="/tracker2.png" alt="Kanban Board" className="w-1/2 rounded-2xl shadow-lg" />
                </>
              ) : (
                <>
                  <div className="max-w-md">
                    <h3 className="text-xl font-bold mb-4">Extension Features</h3>
                    <p className="text-lg mb-4">✔️ Extension: Enhance your workflow with powerful extensions that integrate seamlessly with your existing tools.</p>
                    <p className="text-lg">✔️ Custom Integrations: Build custom integrations to tailor the experience to your specific needs.</p>
                  </div>
                  <img src="/extension.png" alt="Extension Image" className="w-1/2 rounded-2xl shadow-lg" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h4 className="text-lg font-bold mb-4">Follow me:</h4>
          <div className="flex justify-center gap-6 mb-4">
            <FaTwitter className="h-8 w-8 text-white hover:text-gray-400 transition" />
            <FaLinkedin className="h-8 w-8 text-white hover:text-gray-400 transition" />
            <FaGithub className="h-8 w-8 text-white hover:text-gray-400 transition" />
          </div>
          <p className="text-sm text-orange-500">All rights reserved to JobFlow.</p>
        </div>
      </footer>
    </div>
  );
};

export default FeatureSection;