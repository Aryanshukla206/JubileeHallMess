// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();
const STORAGE_KEY = 'jubilee_auth';
const REACT_APP_API_URL = 'http://localhost:3000';

// Replace with your actual API URL
// Base URL of your API, set via .env (e.g. REACT_APP_API_URL=http://localhost:5000)

const API_URL = REACT_APP_API_URL || '';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { token: savedToken, user } = JSON.parse(stored);
      setToken(savedToken);
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  // Helper to prefix fetch URLs and inject auth header
  const authFetch = (path, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    return fetch(`${API_URL}${path}`, { ...options, headers });
  };

  // Login via API, store token+user
  const login = async (email, password) => {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    console.log(res)
    if (!res.ok) return null;

    const { token: newToken, user } = await res.json();
    setToken(newToken);
    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: newToken, user }));
    console.log(user)
    return user;
  };

  // Logout: clear storage + state
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      token,
      login,
      logout,
      authFetch,
      isAdmin: currentUser?.role === 'admin',
      isResident: currentUser?.role === 'resident',
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
