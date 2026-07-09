import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, MessageCircle, User } from 'lucide-react';
import { API_URL } from '../config';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  useEffect(function() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        const token = localStorage.getItem('token');
        if (token) {
          fetch(API_URL + '/api/profiles/me', {
            headers: { 'Authorization': 'Bearer ' + token }
          })
            .then(function(res) { return res.ok ? res.json() : null; })
            .then(function(profile) {
              if (profile && (profile.image || (profile.photos && profile.photos[0]))) {
                setUserPhoto(profile.image || profile.photos[0]);
              }
            })
            .catch(function() {});
        }
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
  }, []);

  const handleLogout = function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setUserPhoto(null);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
            <span className="text-xl font-bold">
              <span className="text-gray-900">willubm</span>
              <span className="text-rose-500">ine.com</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-rose-500 font-medium">Home</Link>
            <Link to="/browse" className="text-gray-600 hover:text-rose-500 font-medium">Browse Profiles</Link>
            {user && (
              <>
                <Link to="/messages" className="flex items-center text-gray-600 hover:text-rose-500 font-medium">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Messages
                </Link>
                <Link to="/my-profile" className="flex items-center text-gray-600 hover:text-rose-500 font-medium">
                  <User className="h-4 w-4 mr-1" />
                  My Profile
                </Link>
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/my-profile" className="flex items-center space-x-2 hover:opacity-80">
                  {userPhoto ? (
                    <img 
                      src={userPhoto} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full object-cover object-top border-2 border-rose-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-rose-500" />
                    </div>
                  )}
                  <span className="text-gray-600">Hi, {user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-rose-500 font-medium"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-rose-500 font-medium">
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-rose-500 text-white px-4 py-2 rounded-full font-medium hover:bg-rose-600 transition-colors"
                >
                  Join Free
                </Link>
              </>
            )}
          </div>

          <button
            onClick={function() { setIsMenuOpen(!isMenuOpen); }}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-rose-500"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-rose-500 font-medium" onClick={function() { setIsMenuOpen(false); }}>Home</Link>
              <Link to="/browse" className="text-gray-600 font-medium" onClick={function() { setIsMenuOpen(false); }}>Browse Profiles</Link>
              {user ? (
                <>
                  <Link to="/messages" className="text-gray-600 font-medium" onClick={function() { setIsMenuOpen(false); }}>Messages</Link>
                  <Link to="/my-profile" className="text-gray-600 font-medium" onClick={function() { setIsMenuOpen(false); }}>My Profile</Link>
                  <div className="flex items-center space-x-2 pt-2 border-t">
                    {userPhoto ? (
                      <img 
                        src={userPhoto} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full object-cover object-top border-2 border-rose-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-rose-500" />
                      </div>
                    )}
                    <span className="text-gray-600">Hi, {user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="text-left text-gray-600 font-medium">Log Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 font-medium" onClick={function() { setIsMenuOpen(false); }}>Log In</Link>
                  <Link to="/register" className="text-rose-500 font-medium" onClick={function() { setIsMenuOpen(false); }}>Join Free</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
