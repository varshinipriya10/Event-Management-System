import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';
import registerImage from './register.jpg'; // Adjust path as needed

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword || !role) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(normalizedEmail)) {
      setError('Invalid email format.');
      setLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError('Phone number must be 10 digits.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      console.log('Sending registration data:', {
        firstName,
        lastName,
        email: normalizedEmail,
        phone,
        password,
        role,
      }); // Debug
      const response = await axios.post('http://localhost:5000/api/users/register', {
        firstName,
        lastName,
        email: normalizedEmail,
        phone,
        password,
        role,
      });
      setLoading(false);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      }); // Debug
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${registerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          padding: '30px',
          width: '100%',
          maxWidth: '500px',
        }}
      >
        <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Register</h2>
        {error && (
          <div style={{ color: '#d32f2f', textAlign: 'center', marginBottom: '15px' }}>{error}</div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label
              htmlFor="firstName"
              style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#333' }}
            >
              First Name <span style={{ color: '#d32f2f' }}>*</span>
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
              }}
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#333' }}
            >
              Last Name <span style={{ color: '#d32f2f' }}>*</span>
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
              }}
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#333' }}
            >
              Email <span style={{ color: '#d32f2f' }}>*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
              }}
              required
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#333' }}
            >
              Phone <span style={{ color: '#d32f2f' }}>*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
              }}
              required
            />
          </div>
          <div>
            <label
              htmlFor="role"
              style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#333' }}
            >
              Role <span style={{ color: '#d32f2f' }}>*</span>
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
              }}
              required
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Organiser">Organiser</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="password"
              style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#333' }}
            >
              Password <span style={{ color: '#d32f2f' }}>*</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
              }}
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#333' }}
            >
              Confirm Password <span style={{ color: '#d32f2f' }}>*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
              }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              backgroundColor: loading ? '#ccc' : '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px', color: '#333' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;