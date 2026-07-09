import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ArrowLeft, Send, User } from 'lucide-react';
import { API_URL } from '../config';

interface Message {
  _id?: string;
  id?: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
}

interface MatchProfile {
  id: string;
  name: string;
  image: string;
  occupation?: string;
  location?: string;
}

export const Chat: React.FC = () => {
  const { id: matchId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>([]);
  
  const [matchProfile, setMatchProfile] = useState<MatchProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  // Keep messagesRef in sync
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const fetchMatchProfile = useCallback(async () => {
    if (!matchId) return;
    try {
      const response = await fetch(API_URL + '/api/profiles/' + matchId);
      if (response.ok) {
        const data = await response.json();
        setMatchProfile(data);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  }, [matchId]);

  const fetchMessages = useCallback(async (showLoading: boolean) => {
    if (!matchId) return;
    if (showLoading) setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch(API_URL + '/api/messages/' + matchId, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      
      if (response.ok) {
        const data = await response.json();
        const reversed = data.slice().reverse();
        // Only update if message count changed
        if (reversed.length !== messagesRef.current.length) {
          setMessages(reversed);
        }
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [matchId]);

  // Initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (user) {
      try {
        const userData = JSON.parse(user);
        setCurrentUserId(userData.id);
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
    
    if (matchId) {
      fetchMatchProfile();
      fetchMessages(true);
    }
  }, [matchId, navigate, fetchMatchProfile, fetchMessages]);

  // Auto-poll for new messages every 5 seconds
  useEffect(() => {
    if (!matchId) return undefined;
    
    const interval = setInterval(function() {
      fetchMessages(false);
    }, 5000);
    
    return function() {
      clearInterval(interval);
    };
  }, [matchId, fetchMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_URL + '/api/messages/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          recipient_id: matchId,
          content: newMessage.trim()
        })
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages(function(prev) {
          return prev.concat([sentMessage]);
        });
        setNewMessage('');
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to send message');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatTime = function(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = function(dateString: string) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getMessageKey = function(message: Message, index: number) {
    return message.id || message._id || 'msg-' + index;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
          <button 
            onClick={function() { navigate('/messages'); }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          {matchProfile ? (
            <>
              <img
                src={matchProfile.image || 'https://via.placeholder.com/48'}
                alt={matchProfile.name}
                className="w-12 h-12 rounded-full object-cover object-top"
              />
              <div>
                <h2 className="font-semibold text-gray-900">{matchProfile.name}</h2>
                <p className="text-sm text-gray-500">
                  {matchProfile.occupation || matchProfile.location || 'Online'}
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-white border-x border-gray-200 overflow-y-auto p-4 space-y-4" style={{ minHeight: '400px', maxHeight: 'calc(100vh - 320px)' }}>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Start the conversation!</h3>
              <p className="text-gray-500 text-sm">
                Say hello to {matchProfile ? matchProfile.name : 'your match'}
              </p>
            </div>
          ) : (
            <>
              {messages.map(function(message, index) {
                const isMe = message.sender_id === currentUserId;
                const showDate = index === 0 || 
                  formatDate(message.created_at) !== formatDate(messages[index - 1].created_at);
                
                return (
                  <React.Fragment key={getMessageKey(message, index)}>
                    {showDate && (
                      <div className="text-center text-xs text-gray-500 my-4">
                        {formatDate(message.created_at)}
                      </div>
                    )}
                    <div className={isMe ? 'flex justify-end' : 'flex justify-start'}>
                      <div
                        className={isMe 
                          ? 'max-w-[70%] px-4 py-2 rounded-2xl bg-rose-500 text-white rounded-br-md'
                          : 'max-w-[70%] px-4 py-2 rounded-2xl bg-gray-100 text-gray-900 rounded-bl-md'
                        }
                      >
                        <p>{message.content}</p>
                        <p className={isMe ? 'text-xs mt-1 text-rose-200' : 'text-xs mt-1 text-gray-500'}>
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        <form 
          onSubmit={handleSendMessage}
          className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-4 flex gap-3"
        >
          <input
            type="text"
            value={newMessage}
            onChange={function(e) { setNewMessage(e.target.value); }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-rose-500 focus:border-rose-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-rose-500 text-white p-3 rounded-full hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};
