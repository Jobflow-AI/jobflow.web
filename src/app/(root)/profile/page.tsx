'use client';
import React from 'react';

const Profile = () => {
  return (
    <div className="min-h-screen lg:w-3/4 w-full p-6 mt-9">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between space-x-6">
         <div className=' flex items-center space-x-6'>
          {/* Profile Picture */}
          <img
            src="/assets/default-profile.png" // Dummy profile picture path
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
          </div>

          <div className='w-[75%]'>
          {/* User Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-800">Ahmed Ali Hussain</h2>
            <p className="text-gray-500">
              Male | Elshiekh Zayed, Giza | Accountant | 12 Dec 1992 (38 years)
            </p>
            {/* <div className="flex space-x-4 mt-2">
              <div className="bg-red-100 text-red-600 px-3 py-1 rounded-md">Alcohol</div>
              <div className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-md">Smoker</div>
            </div> */}
          </div>

          {/* Health Stats */}
          <div className="grid grid-cols-4 p-3 mt-5 w-[70%]  gap-2">
            {[
              { label: 'Applied Jobs', value: '22.4', trend: '▲ 10' },
              { label: 'Rejected', value: '92 kg', trend: '▼ 10 kg' },
              { label: 'Revert Back', value: '175 cm' },
              { label: 'Not shortlisted', value: '124/80', trend: '▲ 10' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center border border-x-2 rounded-md">
                <p className="text-gray-500">{stat.label}</p>
                <p className="text-lg font-semibold text-gray-800">{stat.value}</p>
                {stat.trend && (
                  <p
                    className={`text-sm ${
                      stat.trend.startsWith('▲') ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {stat.trend}
                  </p>
                )}
              </div>
            ))}
          </div>

        

          </div>
          
      {/* Edit Button */}
      <div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Edit</button>
          </div>
          <div>
         
          </div>

        </div>

        

        {/* Timeline and Medical History */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Timeline</h3>
            <ul className="space-y-4">
              {[
                { date: 'Dec 2023', event: 'Pre-diabetic', a1c: '8.2' },
                { date: 'Jan 2022', event: 'Type 2 Diabetes', a1c: '7.9' },
                { date: 'Jul 2021', event: 'Thyroid Disorder', a1c: '7.6' },
              ].map((item, idx) => (
                <li key={idx} className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm">
                    {item.date.split(' ')[0]}
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-800">{item.event}</p>
                    <p className="text-gray-500 text-sm">A1c: {item.a1c}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical History</h3>
            <ul className="space-y-2">
              {[
                { label: 'Chronic Disease', value: 'Hypertension, Obesity' },
                { label: 'Surgery', value: 'Appendectomy' },
                { label: 'Diabetes Emergencies', value: 'Diabetic Ketoacidosis' },
              ].map((item, idx) => (
                <li key={idx} className="flex justify-between text-gray-600">
                  <span>{item.label}</span>
                  <span className="font-medium text-gray-800">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Medications and Diet */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Medications</h3>
            <ul className="divide-y divide-gray-200">
              {[
                { name: 'Metformin', status: 'Adherent', dosage: '500 mg' },
                { name: 'Insulin', status: 'Not adherent', dosage: '10 IU' },
              ].map((med, idx) => (
                <li key={idx} className="py-3 flex justify-between items-center">
                  <span>{med.name}</span>
                  <span className="text-sm text-gray-500">{med.dosage}</span>
                  <span
                    className={`text-sm ${
                      med.status === 'Adherent'
                        ? 'text-green-600'
                        : med.status === 'Not adherent'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {med.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Diet</h3>
            <ul className="space-y-2">
              {[
                { label: 'Water', value: '10 Cups/day' },
                { label: 'Coffee', value: '2 Cups/day' },
                { label: 'Carbs', value: 'Daily Avg 3 servings' },
              ].map((item, idx) => (
                <li key={idx} className="flex justify-between text-gray-600">
                  <span>{item.label}</span>
                  <span className="font-medium text-gray-800">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
