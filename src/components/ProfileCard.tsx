import React from 'react';
import { MapPin, Briefcase } from 'lucide-react';
import { Profile } from '../data/profiles';

interface ProfileCardProps {
  profile: Profile;
  onClick: (profile: Profile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onClick }) => {
  const imageUrl = profile.image || profile.imageUrl || 'https://via.placeholder.com/400';
  const interests = profile.interests || [];
  
  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group border border-gray-100"
      onClick={() => onClick(profile)}
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={profile.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white text-xl font-bold">{profile.name}, {profile.age}</h3>
          <div className="flex items-center text-white/90 text-sm mt-1">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="truncate">{profile.location}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {profile.occupation && (
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <Briefcase className="h-4 w-4 mr-2 text-rose-500" />
            <span className="truncate">{profile.occupation}</span>
          </div>
        )}
        
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">
          {profile.about}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {interests.slice(0, 3).map((interest, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-rose-50 text-rose-600 text-xs rounded-full font-medium"
            >
              {interest}
            </span>
          ))}
          {interests.length > 3 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-full font-medium">
              +{interests.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
