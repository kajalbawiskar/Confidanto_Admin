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
<<<<<<< HEAD
        <Route path="/MarketDashboard" element={<ProtectedRoute element={<MarketDashboard />} isAuthenticated={isAuthenticated} />} />
=======
        <Route path="/marketDashboard" element={<ProtectedRoute element={<MarketDashboard />} isAuthenticated={isAuthenticated} />} />
>>>>>>> c83d322e578f5d4783b213f13193e2d1724f7461
      </Routes>
    </Router>
  );
};

export default App;
