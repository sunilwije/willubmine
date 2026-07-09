import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { Messages } from './pages/Messages';
import { Chat } from './pages/Chat';
import { MyProfile } from './pages/MyProfile';
import { CreateProfile } from './pages/CreateProfile';
import { VerifyMember } from './pages/VerifyMember';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Suggestions } from './pages/Suggestions';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/chat/:id" element={<Chat />} />
      <Route path="/my-profile" element={<MyProfile />} />
      <Route path="/create-profile" element={<CreateProfile />} />
      <Route path="/verify/:id" element={<VerifyMember />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/suggestions" element={<Suggestions />} />
    </Routes>
  );
}

export default App;
