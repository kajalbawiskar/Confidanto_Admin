import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {  LoginPage, MarketDashboard, Waitlist } from './pages';

const ProtectedRoute = ({ element, isAuthenticated, ...rest }) => {
  return isAuthenticated ? element : <Navigate to="/" replace />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/waitlist" element={<ProtectedRoute element={<Waitlist />} isAuthenticated={isAuthenticated} />} />
        <Route path="/marketDashboard" element={<ProtectedRoute element={<MarketDashboard />} isAuthenticated={isAuthenticated} />} />
      </Routes>
    </Router>
  );
};

export default App;
