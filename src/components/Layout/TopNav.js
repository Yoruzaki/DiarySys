import React from 'react';
import { FiBell, FiSearch, FiUser, FiMenu, FiHelpCircle } from 'react-icons/fi';

const TopNav = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-blue-600 focus:outline-none lg:hidden"
          >
            <FiMenu className="h-6 w-6" />
          </button>
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          <button className="text-gray-600 hover:text-blue-600 relative">
            <FiHelpCircle className="h-5 w-5" />
          </button>
          
          <button className="text-gray-600 hover:text-blue-600 relative">
            <FiBell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <FiUser className="h-5 w-5 text-blue-600" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="px-6 py-2 bg-gray-50 border-t border-gray-100 hidden md:block">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Home
              </a>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Production
              </a>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li className="text-gray-500" aria-current="page">
              Batches
            </li>
          </ol>
        </nav>
      </div>
    </header>
  );
};

export default TopNav;