import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      login(data.token, data.user);
      navigate('/browse');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-gray-400 text-sm font-sans mb-6">Log in to continue skill sharing</p>
        {error && <div className="bg-red-50 text-red-600 text-sm font-sans px-3 py-2 rounded-xl mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Email</label>
            <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Password</label>
            <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-teal w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400 font-sans">
          No account? <Link to="/register" className="text-teal-600 font-medium hover:underline">Sign up</Link>
        </p>
        <div className="mt-6 p-3 bg-teal-50 rounded-xl text-xs text-teal-800 font-sans">
          <strong>Demo:</strong> jane@example.com · password123
        </div>
      </div>
    </div>
  );
}
