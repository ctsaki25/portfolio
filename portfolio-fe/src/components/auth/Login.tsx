import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid credentials');
    }
  };

  const handleClose = () => {
    navigate(-1); // Navigate back to previous page
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button 
          className={styles.closeButton} 
          onClick={handleClose}
          aria-label="Close"
        >
          &times;
        </button>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <h2>Admin Login</h2>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 