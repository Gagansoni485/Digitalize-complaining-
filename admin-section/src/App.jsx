import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ComplaintsList from './pages/ComplaintsList';
import ComplaintDetails from './pages/ComplaintDetails';
import Categories from './pages/Categories';
import ManageAdmins from './pages/ManageAdmins';
import Profile from './pages/Profile';

function App() {
  const { admin } = useAuth();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/admin/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            {admin?.role === 'super_admin' ? <SuperAdminDashboard /> : <AdminDashboard />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/complaints"
        element={
          <ProtectedRoute>
            <ComplaintsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/complaints/:id"
        element={
          <ProtectedRoute>
            <ComplaintDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute requiredRole="super_admin">
            <Categories />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-admins"
        element={
          <ProtectedRoute requiredRole="super_admin">
            <ManageAdmins />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      
      {/* Redirect based on auth status */}
      <Route
        path="/"
        element={
          admin ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      />
      
      {/* Catch all - redirect to dashboard or login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;