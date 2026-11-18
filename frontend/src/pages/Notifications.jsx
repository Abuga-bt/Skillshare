import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.getNotifications()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markAll = async () => {
    await api.markAllNotificationsRead();
    load();
  };

  const openOne = async (n) => {
    if (!n.read) await api.markNotificationRead(n.id).catch(() => {});
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-stone-900">Notifications</h1>
        {items.some((n) => !n.read) && (
          <button type="button" onClick={markAll} className="text-sm text-teal-700 hover:underline">
            Mark all read
          </button>
        )}
      </div>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4 animate-pulse h-16" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card p-10 text-center text-stone-400 text-sm">No notifications yet</div>
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <li key={n.id}>
              <Link
                to={n.link || '/exchanges'}
                onClick={() => openOne(n)}
                className={`card block p-4 hover:border-teal-200 transition-colors ${!n.read ? 'bg-teal-50/50 border-teal-100' : ''}`}
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-medium text-stone-900 text-sm">{n.title}</p>
                    <p className="text-stone-500 text-sm mt-0.5">{n.body}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-stone-400 mt-2">{new Date(n.created_at).toLocaleString()}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
