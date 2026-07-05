import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ChatList } from '../components/ChatList';
import { ChatWindow } from '../components/ChatWindow';
import { mockMatches, mockMessages, Match, Message } from '../data/mockChat';

export const Chat = () => {
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const currentUserId = 'current_user'; // Hardcoded for MVP

  // In a real app, we would fetch matches and messages from the API here
  // useEffect(() => { ... }, []);

  const handleSendMessage = (content: string) => {
    if (!selectedMatchId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      matchId: selectedMatchId,
      senderId: currentUserId,
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);

    // Update last message in match list
    setMatches(matches.map(m => 
      m.id === selectedMatchId 
        ? { ...m, lastMessage: content } 
        : m
    ));
  };

  const currentMatch = matches.find(m => m.id === selectedMatchId);
  const currentMessages = messages.filter(m => m.matchId === selectedMatchId);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex w-full overflow-hidden h-[calc(100vh-8rem)]">
          <ChatList 
            matches={matches} 
            selectedMatchId={selectedMatchId} 
            onSelectMatch={setSelectedMatchId} 
          />
          <div className="hidden md:block flex-1 h-full">
            <ChatWindow 
              match={currentMatch} 
              messages={currentMessages} 
              onSendMessage={handleSendMessage}
              currentUserId={currentUserId}
            />
          </div>
          
          {/* Mobile View: Show ChatWindow if match selected, else ChatList (handled via CSS/JS usually, but for simple MVP we can just toggle) */}
        </div>
      </div>
    </div>
  );
};
