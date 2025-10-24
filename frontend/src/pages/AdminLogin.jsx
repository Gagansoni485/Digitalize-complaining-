import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, MessageSquare, Shield } from "lucide-react";
import { loginAdmin } from "../utils/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginAdmin(formData);

      // Store admin data in localStorage for admin-dash to read
      const adminData = {
        user: response.user,
        token: response.token,
      };

      localStorage.setItem("admin", JSON.stringify(adminData));
      localStorage.setItem(
        "admin_user",
        JSON.stringify({
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
          id: response.user.id,
          token: response.token,
        }),
      );

      // Show success message
      const roleText =
        response.user.role === "super_admin" ? "Super Admin" : "Admin";

            // Redirect to role-based dashboard in admin-section
      const path = response.user.role === "super_admin" ? "superadmin" : "admin";
      const adminAppUrl = import.meta.env.VITE_ADMIN_APP_URL || "http://localhost:5174";
      const userPayload = encodeURIComponent(btoa(JSON.stringify(response.user)));
      // Pass token & user via URL params for cross-origin handoff
      window.location.href = `${adminAppUrl}/${path}?token=${response.token}&user=${userPayload}`;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex justify-center items-center gap-2 mb-8">
          <Shield className="w-10 h-10 text-blue-400" />
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Admin Portal
          </span>
        </Link>

        <div className="auth-card">
          <h2 className="text-3xl font-bold mb-2 text-center">Admin Login</h2>
          <p className="text-slate-400 text-center mb-8">
            Sign in to access dashboard
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-10 py-3 focus:outline-none focus:border-blue-500 transition"
                  placeholder="admin@university.edu"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-10 py-3 focus:outline-none focus:border-blue-500 transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/50 transition"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In as Admin
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Don't have an admin account?{" "}
              <Link
                to="/admin/register"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Register
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/login"
              className="text-sm text-slate-400 hover:text-slate-300"
            >
              ← Back to Student Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
