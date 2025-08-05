// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true); // NEW

  const isLoggedIn = !!token && isVerified;

  useEffect(() => {
    if (token) {
      checkVerification();
    } else {
      setLoading(false); // No token = done loading
    }
  }, [token]);
const checkVerification = async () => {
  if (!token) return; // Prevent calling if token not set yet
  try {
    const res = await axios.get('http://localhost:5000/api/check-verification', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setIsVerified(res.data.isVerified);
    setUser(res.data.user);
  } catch (err) {
    console.error('Verification check failed:', err);
    logout();
  } finally {
    setLoading(false);
  }
};


  const login = (token, userData = null) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData);
    checkVerification();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsVerified(false);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isVerified, isLoggedIn, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
