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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-stone-50 to-amber-50/40" />
        <div className="absolute top-20 right-[15%] w-64 h-64 bg-teal-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-[10%] w-48 h-48 bg-amber-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur text-teal-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-teal-100 shadow-sm">
            Community-Powered Skill Exchange
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] mb-5 text-stone-900">
            Share What You Know,<br />
            <span className="text-teal-600">Learn What You Need</span>
          </h1>

          <p className="text-stone-500 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Connect with neighbours, exchange skills, and build a stronger community through collaborative learning and mutual support.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <Link to="/browse" className="btn-teal flex items-center gap-2 text-base px-6 py-3">
              Explore Skills
            </Link>
            <Link
              to={isAuthenticated ? '/offer' : '/register'}
              className="btn-teal-outline flex items-center gap-2 text-base px-6 py-3"
            >
              Share Your Skills
            </Link>
          </div>

          <div className="inline-flex flex-wrap justify-center gap-10 md:gap-16 bg-white/70 backdrop-blur rounded-2xl border border-white px-8 py-6 shadow-sm">
            {[
              { n: `${stats.skills || 6}+`, l: 'Skills Shared' },
              { n: stats.members || 8, l: 'Community Members' },
              { n: stats.exchanges || 4, l: 'Exchanges Made' },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-3xl font-bold text-stone-900">{s.n}</div>
                <div className="text-sm text-stone-400 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="font-display text-2xl font-bold text-center mb-10 text-stone-800">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Create your profile', desc: 'Sign up, add your location and a short bio so neighbours know who you are.' },
            { step: '2', title: 'Offer or find skills', desc: 'List what you can do — tutoring, plumbing, design — or search for what you need.' },
            { step: '3', title: 'Request and exchange', desc: 'Send an exchange request, chat when accepted, share contact, and leave a review.' },
          ].map((item) => (
            <div key={item.title} className="card-hover p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 font-bold flex items-center justify-center mx-auto mb-3">
                {item.step}
              </div>
              <h3 className="font-semibold text-lg mb-2 text-stone-800">{item.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
