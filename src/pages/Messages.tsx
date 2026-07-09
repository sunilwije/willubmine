import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MessageCircle, Search, Users } from 'lucide-react';
import { API_URL } from '../config';

interface Match {
  id: string;
  name: string;
  image: string;
  lastMessage?: string | null;
  lastMessageTime?: string | null;
}

export const Messages: React.FC = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(function() {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchMatches();
  }, [navigate]);

  const fetchMatches = async function() {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(API_URL + '/api/interests/matches', {
        headers: { 'Authorization': 'Bearer ' + token }
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

  const filteredMatches = matches.filter(function(match) {
    return match.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatTime = function(dateString: string | null | undefined) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return diffMins + 'm ago';
    if (diffHours < 24) return diffHours + 'h ago';
    if (diffDays < 7) return diffDays + 'd ago';
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600 mb-6">Chat with your mutual matches</p>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search matches..."
            value={searchTerm}
            onChange={function(e) { setSearchTerm(e.target.value); }}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:ring-rose-500 focus:border-rose-500"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
          </div>
        ) : filteredMatches.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
            {filteredMatches.map(function(match) {
              return (
                <div
                  key={match.id}
                  onClick={function() { navigate('/chat/' + match.id); }}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <img
                    src={match.image || 'https://via.placeholder.com/56'}
                    alt={match.name}
                    className="w-14 h-14 rounded-full object-cover object-top"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{match.name}</h3>
                    <p className="text-gray-500 text-sm truncate">
                      {match.lastMessage || 'Start a conversation!'}
                    </p>
                  </div>
                  <div className="text-right">
                    {match.lastMessageTime && (
                      <p className="text-xs text-gray-400">{formatTime(match.lastMessageTime)}</p>
                    )}
                    <MessageCircle className="w-5 h-5 text-gray-400 ml-auto mt-1" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Matches Yet</h3>
            <p className="text-gray-500 mb-6">
              When you and someone both express interest, you'll be able to chat here.
            </p>
            <button
              onClick={function() { navigate('/browse'); }}
              className="bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600 transition-colors"
            >
              Browse Profiles
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};
