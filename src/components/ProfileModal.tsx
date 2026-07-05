import React from 'react';
import { X, MapPin, Briefcase, Heart, MessageCircle } from 'lucide-react';
import { Profile } from '../data/profiles';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ProfileModalProps {
  profile: Profile | null;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ profile, onClose }) => {
  const navigate = useNavigate();
  
  if (!profile) return null;

  const handleConnect = () => {
    // In a real app, this would send a connection request to the API
    // For this MVP, we'll simulate a successful connection and go to chat
    navigate('/chat');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
          >
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full text-gray-600 hover:text-gray-900 transition-colors z-10 backdrop-blur-sm"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={profile.image || profile.imageUrl || "https://via.placeholder.com/400"}
                alt={profile.name}
                className="w-full h-80 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                <h2 className="text-3xl font-bold text-white">{profile.name}, {profile.age}</h2>
                <div className="flex items-center text-white/90 mt-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-lg">{profile.location}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-6 sm:px-8">
              <div className="flex items-center text-gray-700 mb-6">
                <Briefcase className="h-5 w-5 mr-3 text-rose-500" />
                <span className="text-lg font-medium">{profile.occupation}</span>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About Me</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {profile.about}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-rose-50 text-rose-600 rounded-full font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={handleConnect}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Heart className="h-5 w-5" />
                  Connect Free
                </button>
                <button 
                  onClick={handleConnect}
                  className="flex-1 bg-white border-2 border-rose-500 text-rose-500 hover:bg-rose-50 px-6 py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Send Message
                </button>
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => {
                    navigate(`/verify/${profile.id}`);
                    onClose();
                  }}
                  className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  <div className="p-1 bg-blue-100 rounded-full text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                  </div>
                  Verify this Profile (AI Check)
                </button>
              </div>
              
              <p className="text-center text-xs text-gray-400 mt-4">
                100% Free Messaging. No hidden costs.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
