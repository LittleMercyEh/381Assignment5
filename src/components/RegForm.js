import React, { useState } from 'react';

function RegForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/;
    return usernameRegex.test(username);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-=+[\]{}|;:'",.<>?/`~])[A-Za-z\d!@#$%^&*()\-=+[\]{}|;:'",.<>?/`~]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateUsername(username)) {
      setError('Invalid username. Must be 3-20 characters, start with a letter, and only contain letters, numbers, hyphens, or underscores.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Invalid password. Must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email address.');
      return;
    }

    setError('');

    const payload = { username, password, email };

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Error connecting to the server.');
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div 
        style={{
          width: '400px',
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 
          style={{
            textAlign: 'center',
            color: '#004080',
            marginBottom: '20px',
          }}
        >
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
            <input 
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#ffffe0',
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input 
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#ffffe0',
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="confirm-password" style={{ display: 'block', marginBottom: '5px' }}>Confirm Password:</label>
            <input 
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#ffffe0',
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input 
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#ffffe0',
              }}
            />
          </div>
          {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
          {success && <p style={{ color: 'green', marginBottom: '15px' }}>{success}</p>}
          <button 
            type="submit" 
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              margin: '10px 0',
              opacity: '0.5',
              cursor: 'pointer',
              transition: 'background-color 0.3s, opacity 0.3s',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#45A049';
              e.target.style.opacity = '1.0';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#4CAF50';
              e.target.style.opacity = '0.5';
            }}
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegForm;
