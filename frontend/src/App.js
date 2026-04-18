import Home from './Components/home/home';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Components/home/login';
import SignUp from './Components/home/signUp';
import UserDashboard from './Components/ticket/UserDashboard';
import CreateTicket from './Components/ticket/CreateTicket';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/tickets" element={<UserDashboard />} />
      <Route path="/tickets/create" element={<CreateTicket />} />
    </Routes>
  );
}

export default App;
