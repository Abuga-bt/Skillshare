import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Messages() {
  const { convId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const loadConvs = () => api.getConversations().then(setConversations).catch(console.error);

  useEffect(() => {
    loadConvs().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!convId) return;
    api.getMessages(convId).then(setMessages).catch(() => navigate('/messages'));
  }, [convId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e, shareContact = false) => {
    e?.preventDefault();
    if (!text.trim() && !shareContact) return;
    setSending(true);
    try {
      const body = shareContact
        ? { conversation_id: convId, message_text: `📱 My contact: ${user.phone || user.email}`, contact_shared: true }
        : { conversation_id: convId, message_text: text.trim() };
      const msg = await api.sendMessage(body);
      setMessages((prev) => [...prev, msg]);
      setText('');
      loadConvs();
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  const active = conversations.find((c) => c.id === convId);

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-12 font-sans text-gray-400">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <div className="grid md:grid-cols-3 gap-4 h-[calc(100vh-220px)] min-h-[420px]">
        {/* List */}
        <div className="card overflow-y-auto md:col-span-1">
          <div className="px-4 py-3 border-b border-gray-100 font-semibold text-sm">Conversations</div>
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm font-sans">No conversations yet.</div>
          ) : (
            conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => navigate(`/messages/${c.id}`)}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition flex items-start gap-3 ${
                  c.id === convId ? 'bg-teal-50/50' : ''
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-sans text-sm font-semibold shrink-0">
                  {c.other_name?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-sans font-medium text-sm">{c.other_name}</div>
                  {c.last_message && (
                    <div className="text-xs text-gray-400 font-sans line-clamp-1 mt-0.5">{c.last_message}</div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Chat */}
        <div className="card md:col-span-2 flex flex-col overflow-hidden">
          {!convId ? (
            <div className="flex-1 flex items-center justify-center text-gray-300 font-sans text-sm">Select a conversation</div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-sans text-sm font-semibold">
                  {active?.other_name?.charAt(0)}
                </div>
                <span className="font-semibold">{active?.other_name || 'Chat'}</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => {
                  const mine = m.sender_id === user.id;
                  return (
                    <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm font-sans ${
                        mine ? 'bg-teal-600 text-white rounded-br-md' : 'bg-gray-100 text-gray-800 rounded-bl-md'
                      }`}>
                        {m.message_text}
                        <div className={`text-[10px] mt-1 ${mine ? 'text-teal-200' : 'text-gray-400'}`}>
                          {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <div className="p-3 border-t border-gray-100 space-y-2">
                <button type="button" onClick={(e) => send(e, true)} disabled={sending}
                  className="font-sans text-xs text-teal-600 hover:underline">
                  📱 Share my contact
                </button>
                <form onSubmit={send} className="flex gap-2">
                  <input className="input flex-1" placeholder="Type a message..." value={text}
                    onChange={(e) => setText(e.target.value)} disabled={sending} />
                  <button type="submit" className="btn-teal" disabled={sending || !text.trim()}>Send</button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
