import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../types/firebase';
import { useAssets } from '../hooks/useAssets';
import { DisplayAssetsProvider } from '../contexts/DisplayAssetsContext';
import LoadingSpinner from './LoadingSpinner';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const [user] = useAuthState(auth);
  const { assets, loading } = useAssets(user);

  if (loading) {
    return <LoadingSpinner className="min-h-screen" />;
  }

  return (
    <DisplayAssetsProvider assets={assets}>
      {children}
    </DisplayAssetsProvider>
  );
};

export default AuthenticatedLayout; 