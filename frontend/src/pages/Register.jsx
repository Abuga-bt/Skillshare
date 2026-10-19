import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', location: '', phone: '', bio: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.register(form);
      login(data.token, data.user);
      navigate('/browse');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card p-8">
        <h1 className="text-2xl font-bold mb-1">Create account</h1>
        <p className="text-gray-400 text-sm font-sans mb-6">Join your local skill-sharing community</p>
        {error && <div className="bg-red-50 text-red-600 text-sm font-sans px-3 py-2 rounded-xl mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3 font-sans">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Full name</label>
            <input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Email</label>
            <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Password</label>
            <input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Location</label>
            <input className="input" placeholder="e.g. Nairobi, Kenya" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Phone</label>
            <input className="input" placeholder="+254..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <button type="submit" className="btn-teal w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Sign up'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400 font-sans">
          Already have an account? <Link to="/login" className="text-teal-600 font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
