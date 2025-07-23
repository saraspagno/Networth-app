import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Manage from './pages/Manage';
import Profile from './pages/Profile';
import RequireAuth from './components/RequireAuth';
import AuthenticatedLayout from './components/AuthenticatedLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<RequireAuth><AuthenticatedLayout><Home /></AuthenticatedLayout></RequireAuth>} />
        <Route path="/manage" element={<RequireAuth><AuthenticatedLayout><Manage /></AuthenticatedLayout></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><AuthenticatedLayout><Profile /></AuthenticatedLayout></RequireAuth>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App; 