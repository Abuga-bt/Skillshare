import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

const CATEGORIES = ['Education', 'Home Services', 'Technology', 'Design', 'Music', 'Fashion', 'Creative', 'Fitness', 'Other'];

export default function OfferSkill() {
  const [form, setForm] = useState({ title: '', description: '', category: 'Education' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.createSkill(form);
      navigate('/browse');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Share Your Skills</h1>
      <div className="card p-6">
        {error && <div className="bg-red-50 text-red-600 text-sm font-sans px-3 py-2 rounded-xl mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Skill title</label>
            <input className="input" placeholder="e.g. Web Development" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Category</label>
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Description</label>
            <textarea className="input" rows={4} placeholder="Describe what you offer..."
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <button type="submit" className="btn-teal w-full" disabled={loading}>
            {loading ? 'Posting...' : 'Post Skill'}
          </button>
        </form>
      </div>
    </div>
  );
}
