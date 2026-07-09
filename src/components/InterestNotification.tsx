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

            // Auto-hide after 60 seconds (will change to 45 later)
            setTimeout(function() {
              setVisible(false);
            }, 45000);
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

  const handleClose = function(e: React.MouseEvent) {
    e.stopPropagation();
    setVisible(false);
  };

  const handleClick = function() {
    if (notification) {
      setVisible(false);
      // Navigate to browse with the profile ID to view their profile
      navigate('/browse?viewProfile=' + notification.id);
    }
  };

  if (!visible || !notification) {
    return null;
  }

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div 
        onClick={handleClick}
        className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl shadow-2xl p-4 flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform"
      >
        <img
          src={notification.image || 'https://via.placeholder.com/56'}
          alt={notification.name}
          className="w-14 h-14 rounded-full object-cover object-top border-2 border-white flex-shrink-0"
        />
        <div className="flex-1 min-w-0 text-white">
          <div className="flex items-center gap-1 text-rose-100 text-xs font-medium mb-0.5">
            <Heart className="w-3 h-3 fill-white" />
            New Interest!
          </div>
          <p className="font-bold text-lg truncate">{notification.name}</p>
          <p className="text-rose-100 text-sm">is interested in you! Click to view profile</p>
        </div>
        <button
          onClick={handleClose}
          className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
