import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('royalfx_token') || null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshMetrics = async () => {
    if (!token) return;
    try {
      const res = await authAPI.getMe();
      if (res.data.success) {
        setMetrics(res.data.metrics);
        setUser(res.data.metrics.user);
      }
    } catch (err) {
      console.error('Failed to fetch user metrics:', err);
      if (err.response && err.response.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    if (token) {
      refreshMetrics().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      localStorage.setItem('royalfx_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.metrics.user);
      setMetrics(res.data.metrics);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    if (res.data.success) {
      localStorage.setItem('royalfx_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.metrics.user);
      setMetrics(res.data.metrics);
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('royalfx_token');
    setToken(null);
    setUser(null);
    setMetrics(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      metrics,
      loading,
      login,
      register,
      logout,
      refreshMetrics,
      setMetrics
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
