import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  sendConnectionRequest,
  getIncomingConnectionRequests,
  getSentConnectionRequests,
  acceptConnection,
  rejectConnection,
  fetchFriends,
} from '../api';

export default function Connections() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [incoming, setIncoming] = useState([]);
  const [sent, setSent] = useState([]);
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      const [i, s, f] = await Promise.all([
        getIncomingConnectionRequests(),
        getSentConnectionRequests(),
        fetchFriends(),
      ]);
      setIncoming(i);
      setSent(s);
      setFriends(f);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSend = async () => {
    setError('');
    setMessage('');
    if (!identifier.trim()) return;
    try {
      const res = await sendConnectionRequest(identifier.trim());
      setMessage('Request sent successfully!');
      setIdentifier('');
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to send request');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-100 p-6 relative animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 animate-slide-up bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Connections</h1>

        <div className="mb-12 card backdrop-blur bg-white/60 shadow-xl rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6">Send Connection Request</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="👤 User email or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="flex-1 px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 backdrop-blur-sm hover:shadow-lg transition-all"
            />
            <button
              onClick={handleSend}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all font-semibold text-lg"
            >
              Send Request 🚀
            </button>
          </div>
          {message && <p className="text-green-600 mt-4 font-semibold animate-fade-in">{message}</p>}
          {error && <p className="text-red-500 mt-4 font-semibold animate-fade-in">{error}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="card backdrop-blur bg-white/70 shadow-2xl p-8 rounded-3xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 animate-slide-up">📥 Incoming Requests</h2>
            {incoming.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-2xl text-gray-500 mb-4 animate-pulse">No incoming requests</p>
                <p className="text-gray-400">Your network is waiting for you! 👋</p>
              </div>
            ) : (
              incoming.map((req) => (
                <div key={req.id} className="mb-6 p-6 border border-emerald-200 rounded-2xl bg-emerald-50/50 backdrop-blur hover:shadow-xl hover:scale-102 transition-all group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xl text-gray-800 group-hover:text-emerald-700">{req.requester.name}</p>
                      <p className="text-sm text-gray-600">{req.requester.email}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={async () => {
                          await acceptConnection(req.id);
                          loadData();
                        }}
                        className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 shadow-lg hover:shadow-glow transition-all font-semibold"
                      >
                        ✅ Accept
                      </button>
                      <button
                        onClick={async () => {
                          await rejectConnection(req.id);
                          loadData();
                        }}
                        className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-lg transition-all font-semibold"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="card backdrop-blur bg-white/70 shadow-2xl p-8 rounded-3xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 animate-slide-up">👥 Friends ({friends.length})</h2>
            {friends.length === 0 ? (
              <p className="text-gray-500 text-center py-12 text-xl">No friends yet. Start connecting! 🤝</p>
            ) : (
              friends.map((f) => (
                <div key={f.id} className="mb-6 p-6 border border-blue-200 rounded-2xl bg-blue-50/50 hover:shadow-xl hover:scale-102 backdrop-blur transition-all hover:border-blue-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xl text-gray-800">{f.name}</p>
                      <p className="text-sm text-gray-600">{f.email}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/profile?professionalId=${f.id}`)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-glow hover:scale-105 transition-all font-semibold"
                    >
                      👁️ View Profile
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card backdrop-blur bg-white/60 shadow-xl p-8 rounded-3xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 animate-slide-up">⏳ Sent Requests ({sent.length})</h2>
          {sent.length === 0 ? (
            <p className="text-gray-500 text-center py-12 text-xl animate-pulse">No pending requests.</p>
          ) : (
            sent.map((req) => (
              <div key={req.id} className="mb-6 p-6 border border-yellow-200 rounded-2xl bg-yellow-50/50 hover:shadow-lg transition-all">
                <p className="font-bold text-xl text-gray-800">{req.receiver.name}</p>
                <p className="text-lg text-gray-600">{req.receiver.email}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-spin">
                    <span className="text-white font-bold">⏳</span>
                  </div>
                  <p className="text-yellow-700 font-semibold text-lg">Pending...</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
