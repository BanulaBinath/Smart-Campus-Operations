import Home from './Components/home/home';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Components/home/login';
import SignUp from './Components/home/signUp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;
