import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
              <span className="text-xl font-bold">willubemin.com</span>
            </div>
            <p className="text-gray-400 text-sm">
              The world's first 100% free matrimonial platform for youth worldwide.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-rose-500">Home</Link></li>
              <li><Link to="/#browse" className="hover:text-rose-500">Browse Profiles</Link></li>
              <li><Link to="/register" className="hover:text-rose-500">Create Profile</Link></li>
              <li><Link to="/login" className="hover:text-rose-500">Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/suggestions" className="hover:text-rose-500 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Suggestions & Feedback
              </Link></li>
              <li><a href="mailto:support@willubemin.com" className="hover:text-rose-500">Contact Us</a></li>
              <li><Link to="/privacy" className="hover:text-rose-500">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-rose-500">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">We Value Your Input</h3>
            <p className="text-gray-400 text-sm mb-4">
              Help us improve! Share your suggestions, report issues, or request new features.
            </p>
            <Link 
              to="/suggestions" 
              className="inline-flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Send Suggestion
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} willubemin.com. All rights reserved. Made with ❤️ for love seekers worldwide.</p>
        </div>
      </div>
    </footer>
  );
};
