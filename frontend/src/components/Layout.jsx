import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const nav = (to, label, icon) => {
    const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
    return (
      <Link
        to={to}
        className={`font-sans flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
          active ? 'text-teal-700 font-semibold' : 'text-gray-600 hover:text-teal-700'
        }`}
      >
        <span className="text-base">{icon}</span>
        {label}
      </Link>
    );
  };

  const initial = user?.full_name?.charAt(0)?.toUpperCase() || 'S';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl tracking-tight text-gray-900">
            SkillShare
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav('/browse', 'Browse Skills')}
            {isAuthenticated && nav('/exchanges', 'Exchanges', )}
            {isAuthenticated && nav('/messages', 'Messages', )}
            {nav('/help', 'Help', )}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to={`/profile/${user.id}`} className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center font-sans font-semibold text-sm hover:bg-teal-700 transition">
                  {initial}
                </Link>
                <button onClick={() => { logout(); navigate('/'); }} className="font-sans text-sm text-gray-500 hover:text-gray-800">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="font-sans text-sm text-gray-600 hover:text-teal-700">Login</Link>
                <Link to="/register" className="btn-teal text-sm py-1.5 px-4">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-100 py-5 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-black-400 font-sans">
          SkillShare · Local Community Skill Exchange 
        </div>
      </footer>
    </div>
  );
}
