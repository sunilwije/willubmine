import React from 'react';
import { Match } from '../data/mockChat';
import { AdBanner } from './AdBanner';

interface ChatListProps {
  matches: Match[];
  selectedMatchId: string | null;
  onSelectMatch: (matchId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ matches, selectedMatchId, onSelectMatch }) => {
  return (
    <div className="w-full md:w-1/3 border-r border-gray-200 bg-white overflow-y-auto h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Messages</h2>
      </div>
      <ul>
        {matches.map((match) => (
          <li 
            key={match.id}
            onClick={() => onSelectMatch(match.id)}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${selectedMatchId === match.id ? 'bg-rose-50 hover:bg-rose-50' : ''}`}
          >
            <div className="flex items-center space-x-3">
              <img 
                src={match.profile.imageUrl} 
                alt={match.profile.name} 
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {match.profile.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {match.lastMessage || 'Start a conversation'}
                </p>
              </div>
            </div>
          </li>
        ))}
        {matches.length === 0 && (
          <li className="p-8 text-center text-gray-500">
            No matches yet. Start browsing to connect!
          </li>
        )}
      </ul>
      <div className="p-4 border-t border-gray-200">
        <AdBanner slot="chat-list-bottom" format="rectangle" className="w-full h-auto aspect-[300/250]" />
      </div>
    </div>
  );
};
