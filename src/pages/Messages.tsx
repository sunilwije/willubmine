import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MessageCircle, Heart, Search, Users, Check, X } from 'lucide-react';
import { API_URL } from '../config';

interface Match {
  id: string;
  name: string;
  image: string;
  lastMessage?: string | null;
  lastMessageTime?: string | null;
}

interface InterestReceived {
  id: string;
  name: string;
  image: string;
  status: string;
  created_at: string;
  occupation?: string;
  location?: string;
}

export const Messages: React.FC = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [interestsReceived, setInterestsReceived] = useState<InterestReceived[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'matches' | 'received'>('matches');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      // Fetch mutual matches
      const matchesRes = await fetch(API_URL + '/api/interests/matches', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (matchesRes.ok) {
        const matchesData = await matchesRes.json();
        setMatches(matchesData);
      }

      // Fetch received interests (pending ones - not yet matched)
      const receivedRes = await fetch(API_URL + '/api/interests/received', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (receivedRes.ok) {
        const receivedData = await receivedRes.json();
        // Filter to show only pending (not yet matched)
        const pending = receivedData.filter(function(i: InterestReceived) {
          return i.status === 'pending';
        });
        setInterestsReceived(pending);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExpressInterestBack = async (profileId: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(API_URL + '/api/interests/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ to_user_id: profileId })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'matched') {
          alert('It\'s a match! You can now message each other.');
        } else {
          alert('Interest sent!');
        }
        // Refresh the data
        fetchData();
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to send interest');
      }
    } catch (err) {
      alert('Failed to send interest. Please try again.');
    }
  };

  const handleDeclineInterest = async (profileId: string) => {
    // For now, just remove from the list locally
    // In a full implementation, you'd call an API to decline
    setInterestsReceived(function(prev) {
      return prev.filter(function(i) { return i.id !== profileId; });
    });
  };

  const viewProfile = (profileId: string) => {
    navigate('/browse?profile=' + profileId);
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

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={function() { setActiveTab('matches'); }}
            className={activeTab === 'matches' 
              ? 'flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500 text-white font-medium'
              : 'flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }
          >
            <MessageCircle className="w-4 h-4" />
            Matches ({matches.length})
          </button>
          <button
            onClick={function() { setActiveTab('received'); }}
            className={activeTab === 'received' 
              ? 'flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500 text-white font-medium'
              : 'flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }
          >
            <Heart className="w-4 h-4" />
            Interests Received ({interestsReceived.length})
            {interestsReceived.length > 0 && (
              <span className="bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full">
                {interestsReceived.length}
              </span>
            )}
          </button>
        </div>

        {/* Search - only for matches tab */}
        {activeTab === 'matches' && (
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
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
          </div>
        ) : activeTab === 'matches' ? (
          /* Matches Tab */
          filteredMatches.length > 0 ? (
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
          )
        ) : (
          /* Interests Received Tab */
          interestsReceived.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
              {interestsReceived.map(function(interest) {
                return (
                  <div
                    key={interest.id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={interest.image || 'https://via.placeholder.com/56'}
                      alt={interest.name}
                      onClick={function() { viewProfile(interest.id); }}
                      className="w-14 h-14 rounded-full object-cover object-top cursor-pointer hover:ring-2 hover:ring-rose-500"
                    />
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={function() { viewProfile(interest.id); }}
                    >
                      <h3 className="font-semibold text-gray-900">{interest.name}</h3>
                      <p className="text-gray-500 text-sm">
                        Interested in you • {formatTime(interest.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={function() { handleExpressInterestBack(interest.id); }}
                        className="flex items-center gap-1 bg-rose-500 text-white px-4 py-2 rounded-full hover:bg-rose-600 transition-colors text-sm font-medium"
                      >
                        <Heart className="w-4 h-4" />
                        Like Back
                      </button>
                      <button
                        onClick={function() { handleDeclineInterest(interest.id); }}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        title="Decline"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Pending Interests</h3>
              <p className="text-gray-500 mb-6">
                When someone expresses interest in you, they'll appear here.
              </p>
              <button
                onClick={function() { navigate('/browse'); }}
                className="bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600 transition-colors"
              >
                Browse Profiles
              </button>
            </div>
          )
        )}
      </div>

      <Footer />
    </div>
  );
};
