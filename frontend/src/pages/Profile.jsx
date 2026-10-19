import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: '', bio: '', location: '', phone: '' });
  const isOwn = user?.id === id;

  const load = () => {
    setLoading(true);
    api.getUser(id)
      .then((data) => {
        setProfile(data);
        setForm({
          full_name: data.full_name || '',
          bio: data.bio || '',
          location: data.location || '',
          phone: data.phone || '',
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.updateUser(id, form);
      updateUser(updated);
      setProfile((p) => ({ ...p, ...updated }));
      alert('Profile saved!');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await api.deleteSkill(skillId);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-12 font-sans text-gray-400">Loading...</div>;
  if (!profile) return <div className="max-w-3xl mx-auto px-4 py-12 font-sans text-gray-400">User not found</div>;

  const stars = profile.avg_rating ? Math.round(Number(profile.avg_rating)) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{isOwn ? 'My Profile' : 'Profile'}</h1>

      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <h2 className="font-semibold text-lg">Profile Details</h2>
          {profile.avg_rating && (
            <div className="flex items-center gap-1 text-sm font-sans">
              <span className="text-amber-600 font-medium">{profile.avg_rating}/5</span>
              <span className="text-gray-500">({profile.review_count} reviews)</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-teal-600 text-white flex items-center justify-center text-2xl font-sans font-bold">
            {profile.full_name?.charAt(0)}
          </div>
          <span className="text-gray-400 font-sans text-sm">{profile.email}</span>
        </div>

        {isOwn ? (
          <form onSubmit={handleSave} className="space-y-4 font-sans">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Full Name</label>
              <input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Bio</label>
              <textarea className="input" rows={3} placeholder="Tell the community about yourself..."
                value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Location</label>
                <input className="input" placeholder="City, Country" value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Phone</label>
                <input className="input" placeholder="+254..." value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="w-full btn-teal py-3" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        ) : (
          <div className="font-sans text-sm space-y-2 text-gray-600">
            <p><strong>Name:</strong> {profile.full_name}</p>
            {profile.bio && <p>{profile.bio}</p>}
            {profile.location && <p>{profile.location}</p>}
          </div>
        )}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">{isOwn ? 'My Skills' : 'Skills'}</h2>
          {isOwn && (
            <button onClick={() => navigate('/offer')} className="btn-teal text-sm py-1.5 px-4">
              Add Skill
            </button>
          )}
        </div>

        {(!profile.skills || profile.skills.length === 0) ? (
          <p className="text-gray-400 font-sans text-sm text-center py-6">No skills listed yet.</p>
        ) : (
          <div className="space-y-3">
            {profile.skills.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-sm font-semibold">
                  {s.title?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{s.title}</span>
                    <span className="font-sans text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">Offering</span>
                  </div>
                  <p className="text-xs text-gray-400 font-sans line-clamp-1">{s.description}</p>
                </div>
                {isOwn && (
                  <button onClick={() => handleDeleteSkill(s.id)} className="text-xs text-red-400 hover:text-red-600 font-sans">
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {profile.reviews?.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-3">Reviews</h2>
          <div className="space-y-3">
            {profile.reviews.map((r) => (
              <div key={r.id} className="card p-4">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-sm font-medium">{r.reviewer_name}</span>
                  <span className="text-amber-600 text-sm font-medium">{r.rating}/5</span>
                </div>
                {r.comment && <p className="text-sm text-gray-500 font-sans mt-1">{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
