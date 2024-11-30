'use client'
import Image from 'next/image';
import React, { useState } from 'react';

const TabSection = () => {
  const [activeTab, setActiveTab] = useState('tracker');

  return (
    <section className="px-6 py-16 bg-white">
      <h2 className="text-center text-3xl font-bold text-gray-900 mb-12">
        Discover the Features That Make JobFlow So Easy to Use
      </h2>

      <div className="max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="flex justify-center space-x-8 mb-8">
          <button
            className={`px-6 py-2 font-medium border-b-4 ${
              activeTab === 'tracker'
                ? 'text-gray-900 border-black'
                : 'text-gray-600 border-transparent'
            }`}
            onClick={() => setActiveTab('tracker')}
          >
            Tracker
          </button>
          <button
            className={`px-6 py-2 font-medium border-b-4 ${
              activeTab === 'extension'
                ? 'text-gray-900 border-black'
                : 'text-gray-600 border-transparent'
            }`}
            onClick={() => setActiveTab('extension')}
          >
            Extension
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div>
            {activeTab === 'tracker' ? (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Tracker Features
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <li>
                    <span className="font-bold">✓ Tracker:</span> Allows you to
                    track used Kanban board types of design. You can toggle
                    between both tabs to manage your workflow efficiently.
                  </li>
                  <li>
                    <span className="font-bold">✓ Kanban Boards:</span> Agile
                    and DevOps teams can use flexible Kanban boards to visualize
                    workflows, limit work-in-progress, and maximize efficiency.
                  </li>
                </ul>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Extension Features
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <li>
                    <span className="font-bold">✓ Browser Extension:</span>{' '}
                    Seamlessly integrates with your browser for quick access to
                    JobFlow tools.
                  </li>
                  <li>
                    <span className="font-bold">✓ Real-time Updates:</span>{' '}
                    Stay updated with real-time notifications and workflow
                    changes.
                  </li>
                  <li>
                    <span className="font-bold">✓ Customization:</span> Tailor
                    the extension to suit your team's needs and preferences.
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Image Content */}
          <div className="relative">
            <Image
              src={
                activeTab === 'tracker'
                  ? '/feature-board.png'
                  : '/extension-feature.png'
              }
              alt={activeTab === 'tracker' ? 'Tracker Features' : 'Extension Features'}
              width={1000}
              height={800}
              layout="responsive"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TabSection;
