import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const ICONS = {
   
};

function iconFor(skill) {
  if (skill.icon && ICONS[skill.icon]) return ICONS[skill.icon];
  const c = (skill.category || '').toLowerCase();
  if (c.includes('fit') || c.includes('gym')) return ;
  if (c.includes('edu') || c.includes('teach')) return ;
  if (c.includes('tech') || c.includes('dev')) return ;
  if (c.includes('music')) return ;
  if (c.includes('home') || c.includes('plumb')) return ;
  if (c.includes('design') || c.includes('creat')) return ;
  if (c.includes('fashion')) return ;
  return 
}

const ICON_BG = ['bg-pink-50', 'bg-teal-50', 'bg-blue-50', 'bg-amber-50', 'bg-purple-50'];

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
  const [msg, setMsg] = useState('');

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
      await api.createExchange({ skill_id: skillId, message: msg || 'Hi, I would like to exchange for this skill.' });
      setMsg('');
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
      <h1 className="text-3xl font-bold mb-1">Browse Skills</h1>
      <p className="text-gray-400 font-sans text-sm mb-8">Discover skills in your community and start exchanging</p>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>
          <input className="input pl-10" placeholder="Search skills..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="input sm:w-44" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All Categories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </form>

      {loading ? (
        <p className="font-sans text-gray-400">Loading...</p>
      ) : skills.length === 0 ? (
        <div className="card p-12 text-center text-gray-400 font-sans">No skills found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((skill, i) => (
            <div key={skill.id} className="card p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-full ${ICON_BG[i % ICON_BG.length]} flex items-center justify-center text-lg`}>
                  {iconFor(skill)}
                </div>
                <span className="font-sans text-xs font-medium bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full">
                  Offering
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1">{skill.title}</h3>
              <p className="text-sm text-gray-500 font-sans mb-4 line-clamp-2 flex-1">{skill.description}</p>
              <div className="flex items-center gap-2 mb-4 text-sm font-sans text-gray-600">
                <span className="w-7 h-7 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-xs font-semibold">
                  {skill.provider_name?.charAt(0)}
                </span>
                <div>
                  <div className="font-medium text-gray-800">{skill.provider_name}</div>
                  {skill.provider_location && (
                    <div className="text-xs text-gray-400"> {skill.provider_location}</div>
                  )}
                </div>
              </div>
              <button
                onClick={() => requestExchange(skill.id)}
                disabled={requesting === skill.id}
                className="w-full font-sans text-sm py-2.5 rounded-xl bg-gray-50 hover:bg-teal-50 text-gray-600 hover:text-teal-700 border border-gray-100 transition flex items-center justify-center gap-2"
              >
                ⇄ {requesting === skill.id ? 'Sending...' : 'Request Exchange'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
