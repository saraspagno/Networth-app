import React from 'react';
import Sidebar from '../components/Sidebar';

const Manage: React.FunctionComponent = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-4xl font-bold">Manage Page</h1>
      </div>
    </div>
  );
};

export default Manage; 