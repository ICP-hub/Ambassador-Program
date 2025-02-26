import React from 'react';

function NoContest() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="text-center space-y-6 transform transition-all duration-300">
        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
          No Contest Data Available
        </h1>
        <p className="text-gray-300 text-lg max-w-md mx-auto opacity-0 animate-fadeIn">
          It seems there's nothing to show right now. Check back later for updates!
        </p>
      </div>

      {/* Custom CSS for animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}

export default NoContest;