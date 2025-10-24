import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useAuth } from './context/AuthContext';

// Pages
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ComplaintsList from './pages/ComplaintsList';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import ManageAdmins from './pages/ManageAdmins';
import ComplaintDetails from './pages/ComplaintDetails';
import Layout from './components/Layout';

// Create theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0ea5e9', // sky-500
    },
    secondary: {
      main: '#8b5cf6', // violet-500
    },
    background: {
      default: '#0f172a', // slate-900
      paper: '#1e293b',   // slate-800
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // Wait until auth finished
  }

  if (!user) {
    // Not authenticated – send to login page inside this origin
    return <Navigate to="/admin/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={user.role === 'super_admin' ? '/superadmin' : '/admin'} replace />;
  }
  
  return children;
};

// Role-aware redirect for root and unknown paths
const RoleRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) {
    window.location.href = 'http://localhost:5173/admin/login';
    return null;
  }
  return <Navigate to={user.role === 'super_admin' ? '/superadmin' : '/admin'} replace />;
};

function App() {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <Routes>
                        
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="complaints" element={<ComplaintsList />} />
              {/* Additional admin routes */}
              <Route path="categories" element={<Categories />} />
              <Route path="profile" element={<Profile />} />
              <Route path="complaints/:complaintId" element={<ComplaintDetails />} />
            </Route>
            
            {/* Super Admin Routes */}
            <Route path="/superadmin" element={
              <ProtectedRoute requiredRole="super_admin">
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<SuperAdminDashboard />} />
              <Route path="complaints" element={<ComplaintsList />} />
              {/* Additional superadmin routes */}
              <Route path="categories" element={<Categories />} />
              <Route path="profile" element={<Profile />} />
              <Route path="admins" element={<ManageAdmins />} />
              <Route path="complaints/:complaintId" element={<ComplaintDetails />} />
            </Route>
            
            {/* Default redirect uses role-aware component */}
            <Route path="/" element={<RoleRedirect />} />
            <Route path="*" element={<RoleRedirect />} />
          </Routes>
      </ThemeProvider>
  );
}

export default App
