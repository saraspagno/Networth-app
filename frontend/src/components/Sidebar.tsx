import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiSettings, FiUser, FiMenu, FiChevronLeft } from 'react-icons/fi';
import { useSidebar } from '../contexts/SidebarContext';

const Sidebar: React.FunctionComponent = () => {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <div className={`min-h-screen bg-white shadow-lg flex flex-col py-8 overflow-y-auto transition-all duration-300 ease-in-out ${
      isOpen ? 'w-56 px-4' : 'w-16 px-2'
    }`}>
      {/* Header with toggle button */}
      <div className="flex items-center justify-between mb-8">
        {isOpen && <h2 className="text-2xl font-bold text-blue-600">Menu</h2>}
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            isOpen ? 'ml-auto' : 'mx-auto'
          }`}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? <FiChevronLeft size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-4">
        <NavLink 
          to="/home" 
          className={({ isActive }) => 
            `flex items-center gap-2 transition-colors ${
              isActive 
                ? 'text-blue-600 font-semibold' 
                : 'text-gray-700 hover:text-blue-600'
            } ${
              isOpen ? 'px-2 py-2 rounded-lg hover:bg-gray-100' : 'justify-center p-2 rounded-lg hover:bg-gray-100'
            }`
          }
          title={!isOpen ? 'Home' : undefined}
        >
          <FiHome size={20} />
          {isOpen && <span>Home</span>}
        </NavLink>
        
        <NavLink 
          to="/manage" 
          className={({ isActive }) => 
            `flex items-center gap-2 transition-colors ${
              isActive 
                ? 'text-blue-600 font-semibold' 
                : 'text-gray-700 hover:text-blue-600'
            } ${
              isOpen ? 'px-2 py-2 rounded-lg hover:bg-gray-100' : 'justify-center p-2 rounded-lg hover:bg-gray-100'
            }`
          }
          title={!isOpen ? 'Manage' : undefined}
        >
          <FiSettings size={20} />
          {isOpen && <span>Manage</span>}
        </NavLink>
        
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `flex items-center gap-2 transition-colors ${
              isActive 
                ? 'text-blue-600 font-semibold' 
                : 'text-gray-700 hover:text-blue-600'
            } ${
              isOpen ? 'px-2 py-2 rounded-lg hover:bg-gray-100' : 'justify-center p-2 rounded-lg hover:bg-gray-100'
            }`
          }
          title={!isOpen ? 'Profile' : undefined}
        >
          <FiUser size={20} />
          {isOpen && <span>Profile</span>}
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar; 