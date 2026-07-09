import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, X } from 'lucide-react';
import { API_URL } from '../config';

interface Interest {
  id: string;
  name: string;
  image: string;
  status: string;
  created_at: string;
}

export const InterestNotification: React.FC = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<Interest | null>(null);
  const [visible, setVisible] = useState(false);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  useEffect(function() {
    // Load seen IDs from localStorage
    const stored = localStorage.getItem('seenInterestIds');
    if (stored) {
      try {
        setSeenIds(new Set(JSON.parse(stored)));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(function() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const checkForNewInterests = async function() {
      try {
        const response = await fetch(API_URL + '/api/interests/received', {
          headers: { 'Authorization': 'Bearer ' + token }
        });

        if (response.ok) {
          const data: Interest[] = await response.json();
          
          // Find pending interests we haven't seen
          const pendingInterests = data.filter(function(i) {
            return i.status === 'pending' && !seenIds.has(i.id);
          });

          if (pendingInterests.length > 0) {
            // Show the most recent one
            const newest = pendingInterests[0];
            setNotification(newest);
            setVisible(true);

            // Mark as seen
            const newSeenIds = new Set(seenIds);
            newSeenIds.add(newest.id);
            setSeenIds(newSeenIds);
            localStorage.setItem('seenInterestIds', JSON.stringify(Array.from(newSeenIds)));

            // Auto-hide after 30 seconds
            setTimeout(function() {
              setVisible(false);
            }, 60000);
          }
        }
      } catch (err) {
        // Silent fail
      }
    };

    // Check immediately
    checkForNewInterests();

    // Then check every 15 seconds
    const interval = setInterval(checkForNewInterests, 15000);

    return function() {
      clearInterval(interval);
    };
  }, [seenIds]);

  const handleClose = function() {
    setVisible(false);
  };

  const handleClick = function() {
    if (notification) {
      setVisible(false);
      navigate('/my-profile');
    }
  };

  if (!visible || !notification) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-white rounded-xl shadow-2xl border border-rose-200 p-4 max-w-xs flex items-center gap-3">
        <img
          src={notification.image || 'https://via.placeholder.com/48'}
          alt={notification.name}
          onClick={handleClick}
          className="w-12 h-12 rounded-full object-cover object-top cursor-pointer hover:ring-2 hover:ring-rose-500 flex-shrink-0"
        />
        <div className="flex-1 min-w-0 cursor-pointer" onClick={handleClick}>
          <div className="flex items-center gap-1 text-rose-500 text-xs font-medium mb-0.5">
            <Heart className="w-3 h-3 fill-rose-500" />
            New Interest!
          </div>
          <p className="font-semibold text-gray-900 truncate">{notification.name}</p>
          <p className="text-gray-500 text-xs">is interested in you</p>
        </div>
        <button
          onClick={handleClose}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
