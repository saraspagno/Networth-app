import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../types/firebase';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);
  if (loading) return <LoadingSpinner className="my-8" />;
  return user ? children : <Navigate to="/login" replace />;
}
