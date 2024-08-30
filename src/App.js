import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {  LoginPage, MarketDashboard } from './pages';

const ProtectedRoute = ({ element, isAuthenticated, ...rest }) => {
  return isAuthenticated ? element : <Navigate to="/" replace />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        {/* <Route path="/AdminDashboard" element={<ProtectedRoute element={<AdminDashboard />} isAuthenticated={isAuthenticated} />} /> */}
        <Route path="/MarketDashboard" element={<ProtectedRoute element={<MarketDashboard />} isAuthenticated={isAuthenticated} />} />
        {/* <Route path="/ChatBox" element={<ProtectedRoute element={<AdminSidebar />} isAuthenticated={isAuthenticated} />} /> */}
        {/* <Route path="/ProjectSidebar" element={<ProtectedRoute element={<ProjectSidebar />} isAuthenticated={isAuthenticated} />} /> */}
        {/* <Route path="/Support" element={<ProtectedRoute element={<Support />} isAuthenticated={isAuthenticated} />}  /> */}
      </Routes>
    </Router>
  );
};

export default App;
