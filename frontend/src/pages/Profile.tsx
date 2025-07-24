import React from 'react';
import Sidebar from '../components/Sidebar';
import { auth } from '../types/firebase';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Card, CardContent, Typography, Button } from '../components/ui';

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
        <Card className="p-6 flex flex-col items-center w-full max-w-sm">
          <CardContent className="flex flex-col items-center">
            <div className="bg-blue-100 rounded-full p-4 mb-4">
              <FiUser className="text-5xl text-blue-500" />
            </div>
            <Typography variant="h2" className="mb-2">
              Profile
            </Typography>
            <Typography variant="body" className="text-gray-600 mb-6">
              {user?.email || 'User email'}
            </Typography>
            <Button
              variant="danger"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <FiLogOut className="text-lg" /> Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile; 