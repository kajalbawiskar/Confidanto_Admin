import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {  LoginPage, DashboardPage, AdminDashboard } from './pages';
// import ChatBox  from './components/ChatBox';

const ProtectedRoute = ({ element, isAuthenticated, ...rest }) => {
  return isAuthenticated ? element : <Navigate to="/" replace />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/AdminDashboard" element={<ProtectedRoute element={<AdminDashboard />} isAuthenticated={isAuthenticated} />} />
        <Route path="/DashboardPage" element={<ProtectedRoute element={<DashboardPage />} isAuthenticated={isAuthenticated} />} />
        
      </Routes>
    </Router>
  );
};

export default App;
