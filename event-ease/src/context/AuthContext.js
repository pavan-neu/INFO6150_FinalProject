// src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios defaults
  axios.defaults.baseURL = 'http://localhost:5001/api';
  
  // Set token in axios headers if it exists
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user from token on mount or token change
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Verify token isn't expired
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            // Token expired
            localStorage.removeItem('token');
            setToken(null);
            setCurrentUser(null);
            setError('Session expired, please login again');
          } else {
            // Token valid, fetch user profile
            const res = await axios.get('/users/profile');
            setCurrentUser(res.data);
          }
        } catch (err) {
          // Invalid token or request failed
          console.error('Auth error:', err);
          localStorage.removeItem('token');
          setToken(null);
          setCurrentUser(null);
          setError('Authentication error, please login again');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Login function
  const login = async (loginData) => {
    setError(null);
    try {
      const res = await axios.post('/users/login', loginData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // Register function
  const register = async (userData) => {
    setError(null);
    try {
      const res = await axios.post('/users/register', userData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };

  // Update user profile
  const updateProfile = async (field, value) => {
    try {
      await axios.put(`/users/profile/${field}`, { [field]: value });
      // Refresh user data
      const res = await axios.get('/users/profile');
      setCurrentUser(res.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || `Failed to update ${field}`);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        setError,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        isOrganizer: currentUser?.role === 'organizer',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;