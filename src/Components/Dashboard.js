import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Event Management Dashboard</h1>
      <p>Welcome, {user.email}</p>
      <button onClick={onLogout} className="logout-button">
        Logout
      </button>
      <div className="card-container">
        <div className="card card-module">
          <h2>Event Management Module</h2>
          <p>Manage and create events easily.</p>
          <Link to="/event-management">
            <button aria-label="View Event Management Module">View</button>
          </Link>
        </div>
        <div className="card card-event-details">
          <h2>Event Details</h2>
          <p>View detailed information about events.</p>
          <Link to="/event-details">
            <button aria-label="View Event Details">View</button>
          </Link>
        </div>
        <div className="card card-ticket">
          <h2>Ticketing Module</h2>
          <p>Manage ticket sales and types.</p>
          <Link to="/ticketing">
            <button aria-label="View Ticketing Module">View</button>
          </Link>
        </div>
        <div className="card card-calendar">
          <h2>Calendar Module</h2>
          <p>View and manage upcoming events.</p>
          <Link to="/calendar">
            <button aria-label="View Calendar Module">View</button>
          </Link>
        </div>
        <div className="card card-feedback">
          <h2>Feedback Module</h2>
          <p>Collect and review feedback from attendees.</p>
          <Link to="/feedback">
            <button aria-label="View Feedback Module">View</button>
          </Link>
        </div>
        <div className="card card-notification">
          <h2>Notification Module</h2>
          <p>Manage notifications for users.</p>
          <Link to="/notifications">
            <button aria-label="View Notification Module">View</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;