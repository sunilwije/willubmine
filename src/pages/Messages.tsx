import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MessageCircle, Heart, Search } from 'lucide-react';
import { API_URL } from '../config';

interface Match {
  id: string;
  name: string;
  image: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unread?: number;
}

export const Messages = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchMatches();
  }, [navigate]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/interests/matches`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMatches(data);
      }
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter(match =>
    match.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startChat = (matchId: string) => {
    navigate(`/chat/${matchId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600 mb-8">Chat with your mutual matches</p>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search matches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading matches...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-rose-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Matches Yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              When you and someone both express interest in each other, they'll appear here and you can start chatting!
            </p>
            <button
              onClick={() => navigate('/browse')}
              className="bg-rose-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-600"
            >
              Browse Profiles
            </button>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-600">No matches found for "{searchTerm}"</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {filteredMatches.map((match, index) => (
              <div
                key={match.id}
                onClick={() => startChat(match.id)}
                className={`flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  index !== filteredMatches.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <img
                  src={match.image || 'https://via.placeholder.com/60'}
                  alt={match.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">{match.name}</h3>
                    {match.lastMessageTime && (
                      <span className="text-xs text-gray-500">{match.lastMessageTime}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {match.lastMessage || 'Start a conversation!'}
                  </p>
                </div>
                {match.unread && match.unread > 0 && (
                  <span className="bg-rose-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {match.unread}
                  </span>
                )}
                <MessageCircle className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};
