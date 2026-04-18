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
import AdminDashboard from './Components/ticket/admin/AdminDashboard';
import AdminTickets from './Components/ticket/admin/AdminTickets';
import AdminTicketDetail from './Components/ticket/admin/AdminTicketDetail';
import AdminTechs from './Components/ticket/admin/AdminTechs';

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
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/tickets" element={<AdminTickets />} />
      <Route path="/admin/tickets/:id" element={<AdminTicketDetail />} />
      <Route path="/admin/tickets/:id/assign" element={<AdminTechs />} />
      <Route path="/admin/techs" element={<AdminTechs />} />
    </Routes>
  );
}

export default App;
