import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ skills: 0, members: 0, exchanges: 0 });

  useEffect(() => {
    api.getStats().then(setStats).catch(() => {});
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-orange-50">
        <div className="max-w-4xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-sm font-sans font-medium px-4 py-1.5 rounded-full mb-6 border border-teal-100">
            <span></span> Community-Powered Skill Exchange
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
            Share What You Know,<br />
            <span className="text-teal-600">Learn What You Need</span>
          </h1>

          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8 font-sans">
            Connect with neighbors, exchange skills, and build a stronger community through collaborative learning and mutual support.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-14">
            <Link to="/browse" className="btn-teal flex items-center gap-2">
               Explore Skills
            </Link>
            <Link to={isAuthenticated ? '/offer' : '/register'} className="btn-teal-outline flex items-center gap-2">
              Share Your Skills →
            </Link>
          </div>

          <div className="flex justify-center gap-12 md:gap-20">
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.skills || 6}+</div>
              <div className="text-sm text-gray-400 font-sans mt-1">Skills Shared</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.members || 8}</div>
              <div className="text-sm text-gray-400 font-sans mt-1">Community Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.exchanges || 4}</div>
              <div className="text-sm text-gray-400 font-sans mt-1">Exchanges Made</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
