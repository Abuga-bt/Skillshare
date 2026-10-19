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
        <div className="absolute inset-0 pointer-events-none" />
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-teal-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-[5%] w-56 h-56 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
            <div className="text-center md:text-left order-2 md:order-1">
              <div className="inline-flex items-center gap-2 glass-strong text-teal-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-teal-100/50">
                Community-Powered Skill Exchange
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.15] mb-5 text-stone-900">
                Share What You Know,<br />
                <span className="text-teal-600">Learn What You Need</span>
              </h1>

              <p className="text-stone-500 text-lg max-w-md mx-auto md:mx-0 mb-8 leading-relaxed">
                Connect with neighbours, exchange skills, and build a stronger community through collaborative learning and mutual support.
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-10">
                <Link to="/browse" className="btn-teal text-base px-6 py-3">
                  Explore Skills
                </Link>
                <Link
                  to={isAuthenticated ? '/offer' : '/register'}
                  className="btn-teal-outline text-base px-6 py-3"
                >
                  Share Your Skills
                </Link>
              </div>

              <div className="inline-flex flex-wrap justify-center md:justify-start gap-8 md:gap-12 glass rounded-2xl px-6 py-5 border border-white/50">
                {[
                  { n: `${stats.skills || 6}+`, l: 'Skills Shared' },
                  { n: stats.members || 8, l: 'Community Members' },
                  { n: stats.exchanges || 4, l: 'Exchanges Made' },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-display text-2xl md:text-3xl font-bold text-stone-900">{s.n}</div>
                    <div className="text-xs md:text-sm text-stone-400 mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 md:order-2 flex justify-center">
              <div className="w-full max-w-md aspect-square glass rounded-3xl border border-white/50 shadow-lg shadow-teal-900/5 overflow-hidden flex items-center justify-center p-2">
                <object
                  type="image/svg+xml"
                  data="/skillshare_animation.svg"
                  title="SkillShare animation"
                  className="w-full h-full max-h-[360px]"
                >
                  <img src="/skillshare_animation.svg" alt="SkillShare illustration" className="w-full h-auto" />
                </object>
              </div>
            </div>
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
