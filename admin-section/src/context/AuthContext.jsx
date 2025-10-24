import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for credentials passed via URL (coming from frontend login)
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    const userParam = params.get('user');

    if (tokenParam && userParam) {
      try {
        const decodedUser = JSON.parse(atob(decodeURIComponent(userParam)));
        const adminData = { user: decodedUser, token: tokenParam };
        localStorage.setItem('admin', JSON.stringify(adminData));
        setUser(decodedUser);
        // Clean the URL to avoid leaking token
        navigate(window.location.pathname, { replace: true });
        setLoading(false);
        return;
      } catch (err) {
        console.error('Failed to parse auth params:', err);
      }
    }

    // Fallback to existing session in this origin
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        setUser(adminData.user);
      } catch (error) {
        console.error('Failed to parse stored admin data:', error);
        localStorage.removeItem('admin');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await loginAdmin(credentials);
      
      const adminData = {
        user: response.user,
        token: response.token
      };
      
      localStorage.setItem('admin', JSON.stringify(adminData));
      setUser(response.user);
      
      // Redirect based on role
      if (response.user.role === 'super_admin') {
        navigate('/superadmin');
      } else {
        navigate('/admin');
      }
      
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === 'super_admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};