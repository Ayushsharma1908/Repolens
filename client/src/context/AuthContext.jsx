// client/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const oauthToken = params.get('token');

  // ✅ load stored user instantly
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

  if (oauthToken) {
    window.history.replaceState({}, document.title, window.location.pathname);
    fetchUserFromToken(oauthToken);
    return;
  }

  const token = localStorage.getItem('token');
  if (token) {
    verifyToken(token);
  } else {
    setLoading(false);
  }
}, []);

  // Called after OAuth redirect — fetch user profile using token
  const fetchUserFromToken = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        // Store token + user separately so login() always has what it needs
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
       
      } else {
        logout();
      }
    } catch (error) {
        console.error('Token verification failed:', error);
  setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // FIX: store token and user separately — token lives at top level of response
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}