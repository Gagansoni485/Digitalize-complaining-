import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Building2, Hash, MessageSquare, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registerStudent } from '../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    branch: '',
    instituteName: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await registerStudent(formData);
      // Show success message
      alert('✅ Registration successful! Please login with your credentials.');
      navigate('/login');
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
        className="w-full max-w-2xl"
      >
        {/* Logo */}
        <Link to="/" className="flex justify-center items-center gap-2 mb-8">
          <MessageSquare className="w-10 h-10 text-blue-400" />
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            UniVoice
          </span>
        </Link>

        {/* Registration Card */}
        <div className="auth-card">
          <h2 className="text-3xl font-bold mb-2 text-center">Create Account</h2>
          <p className="text-slate-400 text-center mb-8">Join UniVoice to submit complaints</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-10 py-3 focus:outline-none focus:border-blue-500 transition"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email */}
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
                    placeholder="john@university.edu"
                    required
                  />
                </div>
              </div>

              {/* Roll Number */}
              <div>
                <label className="block text-sm font-medium mb-2">Roll Number</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-10 py-3 focus:outline-none focus:border-blue-500 transition"
                    placeholder="2023001"
                    required
                  />
                </div>
              </div>

              {/* Branch */}
              <div>
                <label className="block text-sm font-medium mb-2">Branch/Department</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-10 py-3 focus:outline-none focus:border-blue-500 transition"
                    placeholder="Computer Science"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Institute Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Institute Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="instituteName"
                  value={formData.instituteName}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-10 py-3 focus:outline-none focus:border-blue-500 transition"
                  placeholder="XYZ University"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Password */}
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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-10 py-3 focus:outline-none focus:border-blue-500 transition"
                    placeholder="••••••••"
                    required
                  />
                </div>
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
                'Creating Account...'
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
