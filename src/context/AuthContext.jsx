import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, getMe } from '../api/auth.js';
import { setOnUnauthorizedCallback } from '../api/client.js';
import { mockUsers } from '../mocks/data.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('chronicle_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('chronicle_token') || null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem('chronicle_token');
      localStorage.removeItem('chronicle_user');
    } catch (e) {}
  }, []);

  // Sync 401 callback with auth state
  useEffect(() => {
    setOnUnauthorizedCallback(logout);
  }, [logout]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await apiLogin(credentials);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('chronicle_token', data.token);
      localStorage.setItem('chronicle_user', JSON.stringify(data.user));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await apiRegister(userData);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('chronicle_token', data.token);
      localStorage.setItem('chronicle_user', JSON.stringify(data.user));
      return data;
    } finally {
      setLoading(false);
    }
  };

  // Helper for fast dev & styleguide switching between roles
  const switchMockRole = (targetRole) => {
    if (!targetRole || targetRole === 'guest') {
      logout();
      return;
    }
    const matched = mockUsers.find(u => u.role === targetRole) || mockUsers[0];
    setUser(matched);
    setToken(matched.id);
    localStorage.setItem('chronicle_token', matched.id);
    localStorage.setItem('chronicle_user', JSON.stringify(matched));
  };

  const role = user?.role || 'guest';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        switchMockRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
