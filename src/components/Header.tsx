import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, MessageCircle, Search } from 'lucide-react';

export const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
            <span className="text-xl font-bold">
              <span className="text-gray-900">willubem</span>
              <span className="text-rose-500">in.com</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-rose-500 font-medium">Home</Link>
            <Link to="/#browse" className="text-gray-600 hover:text-rose-500 font-medium">Browse Profiles</Link>
            <Link to="/chat" className="flex items-center text-gray-600 hover:text-rose-500 font-medium">
              <MessageCircle className="h-4 w-4 mr-1" />
              Messages
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-600">Hi, {user.name}</span>
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

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-rose-500"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-rose-500 font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/#browse" className="text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>Browse Profiles</Link>
              <Link to="/chat" className="text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>Messages</Link>
              {user ? (
                <>
                  <span className="text-gray-600">Hi, {user.name}</span>
                  <button onClick={handleLogout} className="text-left text-gray-600 font-medium">Log Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                  <Link to="/register" className="text-rose-500 font-medium" onClick={() => setIsMenuOpen(false)}>Join Free</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
