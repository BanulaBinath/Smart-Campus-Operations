import Home from './Components/home/home';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Components/home/login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
