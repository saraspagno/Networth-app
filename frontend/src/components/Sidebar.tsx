import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiSettings, FiUser } from 'react-icons/fi';

const Sidebar: React.FunctionComponent = () => {
  return (
    <div className="h-screen w-56 bg-white shadow-lg flex flex-col py-8 px-4">
      <h2 className="text-2xl font-bold mb-8 text-blue-600">Menu</h2>
      <nav className="flex flex-col gap-4">
        <NavLink to="/home" className={({ isActive }) => isActive ? 'flex items-center gap-2 text-blue-600 font-semibold' : 'flex items-center gap-2 text-gray-700 hover:text-blue-600'}>
          <FiHome /> Home
        </NavLink>
        <NavLink to="/manage" className={({ isActive }) => isActive ? 'flex items-center gap-2 text-blue-600 font-semibold' : 'flex items-center gap-2 text-gray-700 hover:text-blue-600'}>
          <FiSettings /> Manage
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'flex items-center gap-2 text-blue-600 font-semibold' : 'flex items-center gap-2 text-gray-700 hover:text-blue-600'}>
          <FiUser /> Profile
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar; 