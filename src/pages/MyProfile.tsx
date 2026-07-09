import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Heart, MapPin, Briefcase, GraduationCap, User, Edit2, Camera, Check, X } from 'lucide-react';
import { API_URL } from '../config';

interface Profile {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  occupation: string;
  education: string;
  bio: string;
  image: string;
  photos: string[];
  interests: string[];
  looking_for: string;
  ideal_partner: string;
  religion: string;
  height: string;
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

export const MyProfile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [interestsReceived, setInterestsReceived] = useState<InterestReceived[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
    fetchInterestsReceived();
  }, [navigate]);

  const fetchProfile = async function() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_URL + '/api/profiles/me', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInterestsReceived = async function() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_URL + '/api/interests/received', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter to show only pending (not yet matched)
        const pending = data.filter(function(i: InterestReceived) {
          return i.status === 'pending';
        });
        setInterestsReceived(pending);
      }
    } catch (err) {
      console.error('Failed to fetch interests:', err);
    }
  };

  const handleExpressInterestBack = async function(profileId: string) {
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
        fetchInterestsReceived();
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to send interest');
      }
    } catch (err) {
      alert('Failed to send interest. Please try again.');
    }
  };

  const handleDeclineInterest = function(profileId: string) {
    setInterestsReceived(function(prev) {
      return prev.filter(function(i) { return i.id !== profileId; });
    });
  };

  const viewProfile = function(profileId: string) {
    navigate('/browse?profile=' + profileId);
  };

  const formatTime = function(dateString: string) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Profile Not Found</h2>
          <p className="text-gray-500 mb-6">Please create your profile to continue.</p>
          <button
            onClick={function() { navigate('/register'); }}
            className="bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600"
          >
            Create Profile
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Interests Received Section */}
        {interestsReceived.length > 0 && (
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl shadow-sm border border-rose-200 p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="text-lg font-bold text-gray-900">
                People Interested in You ({interestsReceived.length})
              </h2>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {interestsReceived.map(function(interest) {
                return (
                  <div
                    key={interest.id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center"
                  >
                    <img
                      src={interest.image || 'https://via.placeholder.com/80'}
                      alt={interest.name}
                      onClick={function() { viewProfile(interest.id); }}
                      className="w-20 h-20 rounded-full object-cover object-top cursor-pointer hover:ring-4 hover:ring-rose-200 transition-all mb-3"
                    />
                    <h3 
                      className="font-semibold text-gray-900 cursor-pointer hover:text-rose-500"
                      onClick={function() { viewProfile(interest.id); }}
                    >
                      {interest.name}
                    </h3>
                    <p className="text-gray-500 text-xs mb-3">{formatTime(interest.created_at)}</p>
                    
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={function() { handleExpressInterestBack(interest.id); }}
                        className="flex-1 flex items-center justify-center gap-1 bg-rose-500 text-white px-3 py-2 rounded-full hover:bg-rose-600 transition-colors text-sm font-medium"
                      >
                        <Check className="w-4 h-4" />
                        Like
                      </button>
                      <button
                        onClick={function() { handleDeclineInterest(interest.id); }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Decline"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Cover Photo / Main Photo */}
          <div className="relative h-96 bg-gradient-to-br from-rose-400 to-pink-500">
            {profile.image && (
              <img
                src={profile.image}
                alt={profile.name}
                className="w-full h-full object-cover object-top"
              />
            )}
            <button
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 px-4 py-2 rounded-full flex items-center gap-2 font-medium shadow-sm transition-colors"
              onClick={function() { navigate('/edit-profile'); }}
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>

          {/* Profile Info */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.name}, {profile.age}
                </h1>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profile.location}
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {profile.occupation && (
                <div className="flex items-center text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2 text-rose-500" />
                  <span className="text-sm">{profile.occupation}</span>
                </div>
              )}
              {profile.education && (
                <div className="flex items-center text-gray-600">
                  <GraduationCap className="w-4 h-4 mr-2 text-rose-500" />
                  <span className="text-sm">{profile.education}</span>
                </div>
              )}
              {profile.height && (
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2 text-rose-500" />
                  <span className="text-sm">{profile.height} cm</span>
                </div>
              )}
              {profile.religion && (
                <div className="flex items-center text-gray-600">
                  <Heart className="w-4 h-4 mr-2 text-rose-500" />
                  <span className="text-sm">{profile.religion}</span>
                </div>
              )}
            </div>

            {/* About */}
            {profile.bio && (
              <div className="mb-6">
                <h2 className="font-semibold text-gray-900 mb-2">About Me</h2>
                <p className="text-gray-600">{profile.bio}</p>
              </div>
            )}

            {/* Looking For */}
            {profile.looking_for && (
              <div className="mb-6">
                <h2 className="font-semibold text-gray-900 mb-2">Looking For</h2>
                <p className="text-gray-600">{profile.looking_for}</p>
              </div>
            )}

            {/* Ideal Partner */}
            {profile.ideal_partner && (
              <div className="mb-6">
                <h2 className="font-semibold text-gray-900 mb-2">Ideal Partner</h2>
                <p className="text-gray-600">{profile.ideal_partner}</p>
              </div>
            )}

            {/* Photos */}
            {profile.photos && profile.photos.length > 1 && (
              <div className="mb-6">
                <h2 className="font-semibold text-gray-900 mb-3">My Photos</h2>
                <div className="grid grid-cols-3 gap-3">
                  {profile.photos.map(function(photo, index) {
                    return (
                      <img
                        key={index}
                        src={photo}
                        alt={'Photo ' + (index + 1)}
                        className="w-full aspect-square object-cover object-top rounded-lg"
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-2">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map(function(interest, index) {
                    return (
                      <span
                        key={index}
                        className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
