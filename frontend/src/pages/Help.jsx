import { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ = [
  { q: 'How do I contact someone about their skill?', a: 'Browse skills and click Request Exchange. Once the provider accepts, you can message them and share contact details.' },
  { q: 'Can I offer multiple skills?', a: 'Yes. Go to your profile and click Add Skill, or use Share Your Skills from the home page.' },
  { q: 'How do reviews and ratings work?', a: 'After an exchange is marked completed, either party can leave a star rating and written review on the other person’s profile.' },
  { q: "What if an exchange doesn't work out?", a: 'You can decline a pending request. For accepted exchanges that fall through, communicate via messages and mark as needed.' },
  { q: 'How do I edit or delete a skill?', a: 'Open your profile, find the skill under My Skills, and click Delete. To edit, delete and re-add with updated details.' },
];

export default function Help() {
  const [open, setOpen] = useState(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">How Can We Help?</h1>
        <p className="text-gray-400 font-sans text-sm">Find answers to common questions and learn how to make the most of SkillShare</p>
      </div>

      <h2 className="text-center font-bold text-lg mb-6">Quick Links</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { icon: '1', title: 'Getting Started', desc: 'Create your profile and list your first skill', to: '/register' },
          { icon: '2', title: 'Browse Skills', desc: 'Explore what the community has to offer', to: '/browse' },
          { icon: '3', title: 'Messages', desc: 'Connect with other community members', to: '/messages' },
          { icon: '4', title: 'Community Guidelines', desc: 'Learn about our community standards', to: '/help' },
        ].map((item) => (
          <Link key={item.title} to={item.to} className="card p-5 text-center hover:shadow-md transition">
            <div className="text-2xl mb-2 text-teal-500">{item.icon}</div>
            <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
            <p className="text-xs text-gray-400 font-sans">{item.desc}</p>
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        {FAQ.map((item, i) => (
          <div key={i} className="card overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left font-sans text-sm font-medium hover:bg-gray-50 transition"
            >
              {item.q}
              <span className="text-gray-400">{open === i ? '-' : '+'}</span>
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-sm text-gray-500 font-sans border-t border-gray-50 pt-3">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 card p-5 font-sans text-sm text-gray-500">
        <strong className="text-gray-700">Demo accounts</strong> — password: <code className="bg-gray-100 px-1 rounded">password123</code>
        <ul className="mt-2 space-y-0.5">
          <li>jane@example.com · david@example.com · amina@example.com</li>
          <li>brian@example.com · grace@example.com · ashley@example.com</li>
        </ul>
      </div>
    </div>
  );
}
