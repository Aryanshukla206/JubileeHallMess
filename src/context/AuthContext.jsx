import React, { createContext, useState, useContext, useEffect } from 'react';

// Create auth context
const AuthContext = createContext();

// Sample user data
const USERS = [
  {
    id: 1,
    email: 'admin@jubileehall.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: 2,
    email: 'resident1@jubileehall.com',
    password: 'resident123',
    name: 'John Doe',
    role: 'resident'
  },
  {
    id: 3,
    email: 'resident2@jubileehall.com',
    password: 'resident123',
    name: 'Jane Smith',
    role: 'resident'
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on component mount
    const storedUser = localStorage.getItem('jubilee_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (email, password) => {
    const user = USERS.find(
      user => user.email === email && user.password === password
    );
    
    if (user) {
      // Remove sensitive data (password)
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('jubilee_user', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }
    return null;
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('jubilee_user');
  };

  const value = {
    currentUser,
    login,
    logout,
    isAdmin: currentUser?.role === 'admin',
    isResident: currentUser?.role === 'resident',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};