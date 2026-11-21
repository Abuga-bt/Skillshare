import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

function HeroAnimation() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 360"
      className="w-full h-auto block"
      style={{ maxHeight: 360 }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="heroBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0fdfa" />
          <stop offset="100%" stopColor="#ccfbf1" />
        </linearGradient>
      </defs>
      <rect width="400" height="360" fill="url(#heroBg)" />
      <circle cx="80" cy="70" r="28" fill="#5eead4" opacity="0.5">
        <animate attributeName="cy" values="70;55;70" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="320" cy="90" r="22" fill="#fcd34d" opacity="0.45">
        <animate attributeName="cy" values="90;75;90" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="50" r="16" fill="#a78bfa" opacity="0.4">
        <animate attributeName="cy" values="50;40;50" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-8;0,0" dur="2s" repeatCount="indefinite" />
        <circle cx="100" cy="160" r="30" fill="#14b8a6" />
        <text x="100" y="168" textAnchor="middle" fill="white" fontFamily="system-ui,sans-serif" fontSize="22" fontWeight="700">
          A
        </text>
        <rect x="65" y="200" width="70" height="55" rx="20" fill="#99f6e4" />
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-8;0,0" dur="2.2s" begin="0.3s" repeatCount="indefinite" />
        <circle cx="300" cy="160" r="30" fill="#0d9488" />
        <text x="300" y="168" textAnchor="middle" fill="white" fontFamily="system-ui,sans-serif" fontSize="22" fontWeight="700">
          B
        </text>
        <rect x="265" y="200" width="70" height="55" rx="20" fill="#5eead4" />
      </g>
      <line x1="145" y1="200" x2="255" y2="200" stroke="#0f766e" strokeWidth="3" strokeLinecap="round">
        <animate attributeName="stroke-dasharray" values="0 120;120 0" dur="1.5s" repeatCount="indefinite" />
      </line>
      <polygon points="250,192 265,200 250,208" fill="#0f766e" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-6;0,0" dur="2.4s" repeatCount="indefinite" />
        <rect x="145" y="270" width="110" height="44" rx="12" fill="white" stroke="#99f6e4" strokeWidth="2" />
        <text x="200" y="297" textAnchor="middle" fill="#0f766e" fontFamily="system-ui,sans-serif" fontSize="13" fontWeight="600">
          Skill Exchange
        </text>
      </g>
    </svg>
  );
}

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
              <div className="w-full max-w-md glass rounded-3xl border border-white/50 shadow-lg shadow-teal-900/5 overflow-hidden bg-white/60 p-2">
                <HeroAnimation />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="font-display text-2xl font-bold text-center mb-10 text-stone-800">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Create your profile', desc: 'Sign up, add your community and a short bio so neighbours know who you are.' },
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
