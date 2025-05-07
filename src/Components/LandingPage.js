import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // Ensure this path is correct

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/login'); // Navigate to the login page
    };

    return (
        <div className="landing-container">
            <h1>Welcome to Event Management System</h1>
            <p>Your one-stop solution for managing events!</p>
            <button className="get-started-button" onClick={handleGetStarted}>
                Get Started
            </button>
        </div>
    );
};

export default LandingPage;