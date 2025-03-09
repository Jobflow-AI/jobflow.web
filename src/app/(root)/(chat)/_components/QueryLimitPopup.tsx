import React from 'react';
import Link from 'next/link';

interface QueryLimitPopupProps {
  onClose: () => void;
}

const QueryLimitPopup: React.FC<QueryLimitPopupProps> = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-2xl p-6 shadow-lg max-w-md w-full text-center text-white">
        {/* GIF or animated emoji */}
        <img 
          src="https://i.gifer.com/7VE.gif" 
          alt="Sad Emoji" 
          className="w-16 h-16 mx-auto mb-4"
        />

        <h2 className="text-2xl font-bold mb-2">You have reached todays limit!</h2>
        <p className="text-gray-400 mb-4">
          You’ve used all your 5 free queries for today. Don't worry, 
          you can still explore your dashboard for insights!
        </p>

        {/* Button to switch to dashboard */}
        <Link href="/dashboard">
          <button className="bg-white hover:bg-gray-600 text-black font-semibold rounded-lg px-5 py-2">
            Switch to Dashboard Mode
          </button>
        </Link>
      </div>
    </div>
  );
};

export default QueryLimitPopup;
