import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const LETTER = {
  heart: 'F', grad: 'E', laptop: 'T', music: 'M', tool: 'H',
  palette: 'D', shirt: 'C', star: 'S',
};

function letterFor(skill) {
  if (skill.icon && LETTER[skill.icon]) return LETTER[skill.icon];
  const c = (skill.category || '').toLowerCase();
  if (c.includes('fit') || c.includes('gym')) return 'F';
  if (c.includes('edu') || c.includes('teach')) return 'E';
  if (c.includes('tech') || c.includes('dev')) return 'T';
  if (c.includes('music')) return 'M';
  if (c.includes('home') || c.includes('plumb')) return 'H';
  if (c.includes('design') || c.includes('creat')) return 'D';
  if (c.includes('fashion')) return 'C';
  return (skill.title || 'S').charAt(0).toUpperCase();
}

const ICON_BG = ['bg-rose-50 text-rose-700', 'bg-teal-50 text-teal-700', 'bg-sky-50 text-sky-700', 'bg-amber-50 text-amber-700', 'bg-violet-50 text-violet-700', 'bg-emerald-50 text-emerald-700'];

export default function Browse() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All Categories');
  const [requesting, setRequesting] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (q) params.q = q;
      if (category && category !== 'All Categories') params.category = category;
      setSkills(await api.getSkills(params));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { api.getCategories().then(setCategories).catch(() => {}); }, []);
  useEffect(() => { load(); }, [category]);

  const handleSearch = (e) => { e.preventDefault(); load(); };

  const requestExchange = async (skillId) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setRequesting(skillId);
    try {
      await api.createExchange({ skill_id: skillId, message: 'Hi, I would like to exchange for this skill.' });
      alert('Exchange request sent!');
      navigate('/exchanges');
    } catch (err) {
      alert(err.message);
    } finally {
      setRequesting(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-900 mb-1">Browse Skills</h1>
        <p className="text-stone-400 text-sm">Discover skills in your community and start exchanging</p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <input
            className="input"
            placeholder="Search skills..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select
          className="input sm:w-48"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All Categories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button type="submit" className="btn-teal sm:px-6">Search</button>
      </form>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-stone-100 mb-3" />
              <div className="h-5 bg-stone-100 rounded w-3/4 mb-2" />
              <div className="h-4 bg-stone-50 rounded w-full mb-1" />
              <div className="h-4 bg-stone-50 rounded w-2/3 mb-4" />
              <div className="h-10 bg-stone-50 rounded-xl" />
            </div>
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="card p-14 text-center">
          <p className="text-stone-500 mb-1 font-medium">No skills found</p>
          <p className="text-stone-400 text-sm mb-4">Try a different search or category</p>
          <button onClick={() => { setQ(''); setCategory('All Categories'); }} className="btn-teal-outline text-sm">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((skill, i) => (
            <div key={skill.id} className="card-hover p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-full ${ICON_BG[i % ICON_BG.length]} flex items-center justify-center text-sm font-bold`}>
                  {letterFor(skill)}
                </div>
                <span className="text-xs font-medium bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full">
                  Offering
                </span>
              </div>
              <h3 className="font-semibold text-lg text-stone-900 mb-1 leading-snug">{skill.title}</h3>
              <p className="text-sm text-stone-500 mb-4 line-clamp-2 flex-1 leading-relaxed">{skill.description}</p>
              <div className="flex items-center gap-2.5 mb-4 text-sm">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center text-xs font-semibold shadow-sm">
                  {skill.provider_name?.charAt(0)}
                </span>
                <div>
                  <div className="font-medium text-stone-800 text-sm">{skill.provider_name}</div>
                  {skill.provider_location && (
                    <div className="text-xs text-stone-400">{skill.provider_location}</div>
                  )}
                </div>
              </div>
              <button
                onClick={() => requestExchange(skill.id)}
                disabled={requesting === skill.id}
                className="w-full text-sm py-2.5 rounded-xl bg-stone-50 hover:bg-teal-50 text-stone-600 hover:text-teal-700 border border-stone-100 hover:border-teal-100 transition-all flex items-center justify-center gap-2 font-medium"
              >
                {requesting === skill.id ? 'Sending...' : 'Request Exchange'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
