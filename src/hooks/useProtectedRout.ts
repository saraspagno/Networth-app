import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../types/firebase';

export function useProtectedRout() {
  const [user, loading] = useAuthState(auth);
  return { user, loading };
} 