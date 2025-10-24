import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedStudent = localStorage.getItem('student');
    if (storedStudent) {
      try {
        setStudent(JSON.parse(storedStudent));
      } catch (error) {
        console.error('Error parsing stored student:', error);
        localStorage.removeItem('student');
      }
    }
    setLoading(false);
  }, []);

  const login = (studentData) => {
    setStudent(studentData);
    localStorage.setItem('student', JSON.stringify(studentData));
  };

  const logout = () => {
    setStudent(null);
    localStorage.removeItem('student');
  };

  const value = {
    student,
    login,
    logout,
    isAuthenticated: !!student,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
