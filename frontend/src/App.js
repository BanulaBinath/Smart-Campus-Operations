import Home from './Components/home/home';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Components/home/login';
import SignUp from './Components/home/signUp';
import UserDashboard from './Components/ticket/UserDashboard';
import CreateTicket from './Components/ticket/CreateTicket';
import TicketChat from './Components/ticket/TicketChat';
import TechnicianDashboard from './Components/ticket/TechnicianDashboard';
import TechnicianTicketDetail from './Components/ticket/TechnicianTicketDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/tickets" element={<UserDashboard />} />
      <Route path="/tickets/create" element={<CreateTicket />} />
      <Route path="/tickets/chat" element={<TicketChat role="USER" />} />
      <Route path="/technician/chat" element={<TicketChat role="TECHNICIAN" />} />
      <Route path="/admin/chat" element={<TicketChat role="ADMIN" />} />
      <Route path="/tickets/technician" element={<TechnicianDashboard />} />
      <Route path="/tickets/technician/detail" element={<TechnicianTicketDetail />} />
    </Routes>
  );
}

export default App;
