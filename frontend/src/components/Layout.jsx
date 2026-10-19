import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnread(0);
      return;
    }
    const load = () => {
      api.getUnreadCount()
        .then((d) => setUnread(d.count || 0))
        .catch(() => {});
    };
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [isAuthenticated, location.pathname]);

  const nav = (to, label, badge) => {
    const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
    return (
      <Link
        to={to}
        onClick={() => setMenuOpen(false)}
        className={`relative flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors ${
          active ? 'text-teal-700 font-semibold bg-teal-50' : 'text-stone-600 hover:text-teal-700 hover:bg-stone-50'
        }`}
      >
        {label}
        {badge > 0 && (
          <span className="ml-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </Link>
    );
  };

  const initial = user?.full_name?.charAt(0)?.toUpperCase() || 'S';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/90 backdrop-blur-md border-b border-stone-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-display font-bold text-xl tracking-tight text-stone-900">
            Skill<span className="text-teal-600">Share</span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {nav('/browse', 'Browse Skills')}
            {isAuthenticated && nav('/exchanges', 'Exchanges')}
            {isAuthenticated && nav('/messages', 'Messages', unread)}
            {nav('/help', 'Help')}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={`/profile/${user.id}`}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center font-semibold text-sm shadow-sm hover:shadow ring-2 ring-white hover:ring-teal-100 transition"
                  title={user.full_name}
                >
                  {initial}
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="hidden sm:block text-sm text-stone-400 hover:text-stone-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-stone-600 hover:text-teal-700 px-2">Login</Link>
                <Link to="/register" className="btn-teal text-sm py-1.5 px-4">Sign Up</Link>
              </>
            )}
            <button
              className="md:hidden relative p-2 text-stone-600 hover:bg-stone-100 rounded-lg text-sm font-medium"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? 'Close' : 'Menu'}
              {unread > 0 && !menuOpen && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-stone-100 bg-white px-4 py-3 space-y-1 shadow-lg">
            {nav('/browse', 'Browse Skills')}
            {isAuthenticated && nav('/exchanges', 'Exchanges')}
            {isAuthenticated && nav('/messages', 'Messages', unread)}
            {nav('/help', 'Help')}
            {isAuthenticated && (
              <button
                onClick={() => { logout(); navigate('/'); setMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-stone-500"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-stone-100 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-stone-400">
          <div className="font-display font-semibold text-stone-600">
            Skill<span className="text-teal-600">Share</span>
          </div>
          <p>Local community skill exchange · ICT Project · JKUAT</p>
        </div>
      </footer>
    </div>
  );
}
