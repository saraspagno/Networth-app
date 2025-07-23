import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Manage from './pages/Manage';
import Profile from './pages/Profile';
import RequireAuth from './components/RequireAuth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './types/firebase';
import { useAssets } from './hooks/useAssets';
import { DisplayAssetsProvider } from './contexts/DisplayAssetsContext';
import LoadingSpinner from './components/LoadingSpinner';

const AuthenticatedApp = () => {
  const [user] = useAuthState(auth);
  const { assets, loading } = useAssets(user);

  if (loading) {
    return <LoadingSpinner className="min-h-screen" />;
  }

  return (
    <DisplayAssetsProvider assets={assets}>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/manage" element={<Manage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </DisplayAssetsProvider>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={<RequireAuth><AuthenticatedApp /></RequireAuth>} />
      </Routes>
    </Router>
  );
}

export default App; 