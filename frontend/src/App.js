import Home from './Components/home/home';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Components/home/login';
import SignUp from './Components/home/signUp';
import Facility from './Components/admin/Facility';
import AdminPage from './Components/admin/AdminPage';
import AddFacility from './Components/admin/addFacility';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/admin/facilities" element={<Facility />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/add-facility" element={<AddFacility />} />
    </Routes>
  );
}

export default App;
