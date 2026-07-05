import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Chat } from './pages/Chat';
import { CreateProfile } from './pages/CreateProfile';
import { VerifyMember } from './pages/VerifyMember';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/create-profile" element={<CreateProfile />} />
      <Route path="/verify/:id" element={<VerifyMember />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
