import React from 'react';
import Sidebar from '../components/Sidebar';
import { auth } from '../types/firebase';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { useAuthState } from 'react-firebase-hooks/auth';

const Profile: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center w-full max-w-sm">
          <div className="bg-blue-100 rounded-full p-4 mb-4">
            <FiUser className="text-5xl text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Profile</h2>
          <p className="text-gray-600 mb-6">{user?.email || 'User email'}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 transition font-semibold"
          >
            <FiLogOut className="text-lg" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 