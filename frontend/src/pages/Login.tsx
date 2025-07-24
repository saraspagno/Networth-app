import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from '../types/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Card, CardContent, Typography, Button } from '../components/ui';

const Login: React.FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) navigate('/home');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-8">
        <CardContent className="space-y-6">
          <Typography variant="h2" className="text-center">
            Sign In
          </Typography>
          {error && <Typography variant="body" className="text-red-500 text-center">{error}</Typography>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
            >
              Sign In
            </Button>
          </form>
          <Typography variant="body" className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login; 