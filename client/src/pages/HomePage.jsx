import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">
      {/* Floating gradient blobs */}
      <div className="absolute w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-[pulse_6s_ease-in-out_infinite] top-10 left-10"></div>
      <div className="absolute w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-[pulse_6s_ease-in-out_infinite] bottom-10 right-10"></div>

      {/* Main Card */}
      <div className="relative z-10 max-w-2xl w-full text-center px-8 py-14 rounded-2xl bg-white/30 backdrop-blur-xl shadow-2xl border border-white/40">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-blue-800 drop-shadow-lg">
          Make a Difference Today
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-700">
          Empower meaningful causes with your generous donations. Every contribution counts.
        </p>

        {/* CTA Button */}
        <div className="mt-8">
          <Link
            to="/donate"
            className="inline-block px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl shadow-lg transform hover:scale-105 hover:shadow-2xl transition duration-300 ease-in-out"
          >
            Donate Now
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-800">
          <div className="p-4 bg-white/40 rounded-lg shadow-md hover:shadow-xl transition duration-300">
            <h2 className="text-3xl font-bold text-blue-700">500+</h2>
            <p className="text-sm">Lives Impacted</p>
          </div>
          <div className="p-4 bg-white/40 rounded-lg shadow-md hover:shadow-xl transition duration-300">
            <h2 className="text-3xl font-bold text-blue-700">₹10L+</h2>
            <p className="text-sm">Funds Raised</p>
          </div>
          <div className="p-4 bg-white/40 rounded-lg shadow-md hover:shadow-xl transition duration-300">
            <h2 className="text-3xl font-bold text-blue-700">50+</h2>
            <p className="text-sm">Active Campaigns</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
