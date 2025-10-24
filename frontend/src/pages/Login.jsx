import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginStudent } from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginStudent(formData);
      login(data);
      // Show success message
      alert('✅ Login successful! Welcome back.');
      navigate('/dashboard');
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
        {/* Logo */}
        <Link to="/" className="flex justify-center items-center gap-2 mb-8">
          <MessageSquare className="w-10 h-10 text-blue-400" />
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            UniVoice
          </span>
        </Link>

        {/* Login Card */}
        <div className="auth-card">
          <h2 className="text-3xl font-bold mb-2 text-center">Welcome Back</h2>
          <p className="text-slate-400 text-center mb-8">Sign in to your account</p>

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
                  placeholder="your.email@university.edu"
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

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/track" className="text-sm text-slate-400 hover:text-slate-300">
              Track complaint without login →
            </Link>
          </div>

          <div className="mt-4 text-center pt-4 border-t border-slate-700">
            <Link to="/admin/login" className="text-sm text-slate-400 hover:text-blue-400">
              Admin? Login here →
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
