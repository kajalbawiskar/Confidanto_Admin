import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, MarketDashboard, Waitlist } from './pages';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/waitlist"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Waitlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketDashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MarketDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
