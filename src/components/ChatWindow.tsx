import React, { useState, useEffect, useRef } from 'react';
import { Send, MoreVertical } from 'lucide-react';
import { Message, Match } from '../data/mockChat';

interface ChatWindowProps {
  match: Match | undefined;
  messages: Message[];
  onSendMessage: (content: string) => void;
  currentUserId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ match, messages, onSendMessage, currentUserId }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  if (!match) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 h-full">
        <div className="text-center text-gray-500">
          <p className="text-xl">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-3">
          <img 
            src={match.profile.imageUrl} 
            alt={match.profile.name} 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-bold text-gray-900">{match.profile.name}</h3>
            <span className="text-xs text-green-500 font-medium">Online</span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                  isMe 
                    ? 'bg-rose-500 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <span className={`text-[10px] block mt-1 ${isMe ? 'text-rose-100' : 'text-gray-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
