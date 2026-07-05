import React from 'react';
import { Heart, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-rose-500 fill-current" />
              <span className="font-bold text-xl tracking-tight">
                willubemin<span className="text-rose-500">.com</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              A 100% free matrimonial and dating platform dedicated to helping youth worldwide find their perfect match. We believe love is a fundamental right.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-rose-500">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#browse" className="hover:text-white transition-colors">Browse Profiles</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#success-stories" className="hover:text-white transition-colors">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-rose-500">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety Tips</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community Guidelines</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-rose-500">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Mail className="h-4 w-4" />
              <span>support@willubemin.com</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} willubemin.com. All rights reserved.</p>
          <p className="mt-2 text-xs">"Marriage is a fundamental right of any human being."</p>
        </div>
      </div>
    </footer>
  );
};
