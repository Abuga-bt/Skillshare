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
  const [form, setForm] = useState({ full_name: '', bio: '', location: '', phone: '', avatar: '', lat: null, lng: null });
  const [communities, setCommunities] = useState([]);
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
          avatar: data.avatar || '',
          lat: data.lat ?? null,
          lng: data.lng ?? null,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);
  useEffect(() => { api.getCommunities().then(setCommunities).catch(() => {}); }, []);

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

  const onAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 800000) {
      alert('Image too large. Use a photo under ~800KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const captureGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }));
      },
      () => alert('Could not get GPS. Allow location access.'),
      { timeout: 10000 }
    );
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
  const displayAvatar = isOwn ? form.avatar : profile.avatar;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{isOwn ? 'My Profile' : profile.full_name}</h1>

      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <h2 className="font-semibold text-lg">Profile Details</h2>
          {profile.avg_rating && (
            <div className="flex items-center gap-1 text-sm font-sans">
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={n <= stars ? 'text-amber-500 font-bold' : 'text-gray-200'}>*</span>
              ))}
              <span className="text-gray-500 ml-1">{profile.avg_rating} ({profile.review_count} reviews)</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-teal-600 text-white flex items-center justify-center text-2xl font-sans font-bold shrink-0">
            {displayAvatar ? (
              <img src={displayAvatar} alt="" className="w-full h-full object-cover" />
            ) : (
              profile.full_name?.charAt(0)
            )}
          </div>
          <span className="text-gray-400 font-sans text-sm">{profile.email}</span>
        </div>

        {isOwn ? (
          <form onSubmit={handleSave} className="space-y-4 font-sans">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Photo</label>
              <input type="file" accept="image/*" onChange={onAvatar} className="text-sm" />
              <p className="text-xs text-gray-400 mt-1">Optional. Keep under 800KB.</p>
            </div>
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
                <label className="text-sm text-gray-600 block mb-1">Community</label>
                <select className="input" value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}>
                  <option value="">Select community</option>
                  {communities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Phone</label>
                <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">GPS (optional)</label>
              <p className="text-xs text-gray-400 mb-2">
                Used for approximate distance when browsing outside your community.
              </p>
              <div className="flex flex-wrap gap-2 items-center">
                <button type="button" onClick={captureGps} className="btn-teal-outline text-sm py-1.5">
                  Capture my location
                </button>
                {form.lat != null && (
                  <span className="text-xs text-stone-500">
                    {Number(form.lat).toFixed(4)}, {Number(form.lng).toFixed(4)}
                  </span>
                )}
              </div>
            </div>
            <button type="submit" className="btn-teal" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        ) : (
          <div className="space-y-2 font-sans text-sm text-gray-600">
            <p className="font-medium text-stone-900 text-base">{profile.full_name}</p>
            {profile.bio && <p>{profile.bio}</p>}
            {profile.location && <p>Community: {profile.location}</p>}
          </div>
        )}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">{isOwn ? 'My Skills' : 'Skills'}</h2>
          {isOwn && (
            <button onClick={() => navigate('/offer')} className="btn-teal text-sm py-1.5 px-4">
              + Add Skill
            </button>
          )}
        </div>

        {(!profile.skills || profile.skills.length === 0) ? (
          <p className="text-gray-400 font-sans text-sm text-center py-6">No skills listed yet.</p>
        ) : (
          <div className="space-y-3">
            {profile.skills.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-sm">S</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{s.title}</span>
                    <span className={`font-sans text-xs px-2 py-0.5 rounded-full ${
                      s.type === 'seeking' ? 'bg-amber-50 text-amber-700' : 'bg-teal-50 text-teal-700'
                    }`}>
                      {s.type === 'seeking' ? 'Seeking' : 'Offering'}
                    </span>
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
                  <span className="text-amber-400 text-sm">{r.rating}/5</span>
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
