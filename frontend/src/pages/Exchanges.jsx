import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Exchanges() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('received');
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewFor, setReviewFor] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const load = () => {
    setLoading(true);
    api.getExchanges()
      .then(setExchanges)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = exchanges.filter((e) => e.direction === tab);
  const receivedCount = exchanges.filter((e) => e.direction === 'received').length;
  const sentCount = exchanges.filter((e) => e.direction === 'sent').length;

  const handleStatus = async (id, status) => {
    try {
      await api.updateExchange(id, { status });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.createReview({ reviewed_id: reviewFor.other_id, rating, comment });
      setReviewFor(null);
      setComment('');
      setRating(5);
      alert('Review submitted!');
    } catch (err) {
      alert(err.message);
    }
  };

  const statusBadge = (status) => {
    const map = {
      pending: 'bg-amber-100 text-amber-700',
      accepted: 'bg-teal-100 text-teal-700',
      completed: 'bg-blue-100 text-blue-700',
      declined: 'bg-red-100 text-red-600',
    };
    return (
      <span className={`font-sans text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${map[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Exchanges</h1>

      <div className="flex gap-2 mb-6 font-sans">
        <button
          onClick={() => setTab('received')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            tab === 'received' ? 'bg-white border border-gray-200 shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Received ({receivedCount})
        </button>
        <button
          onClick={() => setTab('sent')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            tab === 'sent' ? 'bg-white border border-gray-200 shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Sent ({sentCount})
        </button>
      </div>

      {loading ? (
        <p className="font-sans text-gray-400">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center text-gray-400 font-sans">No {tab} exchanges yet.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((ex) => (
            <div key={ex.id} className="card p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-sans font-semibold shrink-0">
                  {ex.other_name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{ex.other_name}</span>
                    {statusBadge(ex.status)}
                  </div>
                  <p className="text-sm text-gray-500 font-sans mt-0.5">Skill: {ex.skill_title}</p>
                  {ex.message && <p className="text-sm text-gray-700 font-sans mt-2">{ex.message}</p>}
                  <p className="text-xs text-gray-400 font-sans mt-2">
                    {new Date(ex.created_at).toLocaleDateString('en-GB')}
                  </p>

                  {tab === 'received' && ex.status === 'pending' && (
                    <div className="flex gap-2 mt-4 font-sans">
                      <button onClick={() => handleStatus(ex.id, 'accepted')} className="btn-teal text-sm py-1.5 px-4 flex items-center gap-1">
                        ✓ Accept
                      </button>
                      <button onClick={() => handleStatus(ex.id, 'declined')} className="bg-red-500 hover:bg-red-600 text-white text-sm py-1.5 px-4 rounded-full flex items-center gap-1">
                        ✕ Decline
                      </button>
                    </div>
                  )}

                  {ex.status === 'accepted' && (
                    <div className="flex gap-2 mt-4 font-sans">
                      <button onClick={() => navigate('/messages')} className="btn-teal text-sm py-1.5 px-4">
                        Open Chat
                      </button>
                      <button onClick={() => handleStatus(ex.id, 'completed')} className="btn-ghost text-sm py-1.5">
                        Mark Completed
                      </button>
                    </div>
                  )}

                  {ex.status === 'completed' && (
                    <button
                      onClick={() => setReviewFor(ex)}
                      className="mt-3 font-sans text-sm text-gray-500 hover:text-teal-700 flex items-center gap-1"
                    >
                      ☆ Leave Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {reviewFor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="card p-6 w-full max-w-md">
            <h3 className="font-bold text-lg mb-4">Review {reviewFor.other_name}</h3>
            <form onSubmit={submitReview} className="space-y-3 font-sans">
              <div>
                <label className="text-sm text-gray-600">Rating</label>
                <select className="input mt-1" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <textarea className="input" rows={3} placeholder="Your experience..." value={comment} onChange={(e) => setComment(e.target.value)} />
              <div className="flex gap-2">
                <button type="submit" className="btn-teal">Submit</button>
                <button type="button" onClick={() => setReviewFor(null)} className="btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
