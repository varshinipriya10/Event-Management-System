import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import Login from './Components/Login';
import Register from './Components/Register';
import Dashboard from './Components/Dashboard';
import EventForm from './Components/EventForm';
import EventDetails from './Components/EventDetails';
import FeedbackForm from './Components/FeedbackForm';
import CalendarModule from './Components/CalendarModule';
import Ticketing from './Components/Ticketing'; // Assuming this component exists

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Store full user object

  // Check for user data on app load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    }
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* EventForm (Only accessible for Organisers) */}
        <Route
          path="/event-management"
          element={
            isAuthenticated && user?.role === 'Organiser' ? (
              <EventForm organizerId={user.id} userEmail={user.email} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/event-details"
          element={
            isAuthenticated ? (
              <EventDetails userId={user.id} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/ticketing"
          element={
            isAuthenticated ? (
              <Ticketing userId={user.id} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/calendar"
          element={isAuthenticated ? <CalendarModule /> : <Navigate to="/login" />}
        />
        <Route
          path="/feedback"
          element={isAuthenticated ? <FeedbackForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={isAuthenticated ? <div>Notifications Page</div> : <Navigate to="/login" />}
        />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;