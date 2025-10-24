import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Building2, Hash, Shield, UserPlus, Users } from 'lucide-react';
import { registerAdmin, getAllAdmins } from '../utils/api';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    employeeId: '',
    role: 'admin',
    specializations: [],
    maxCaseLoad: 50
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [showAdmins, setShowAdmins] = useState(false);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  const specializationOptions = [
    { value: 'academic', label: 'Academic Issues' },
    { value: 'sports', label: 'Sports & Facilities' },
    { value: 'exam', label: 'Exam Related' },
    { value: 'harass', label: 'Harassment' },
    { value: 'harassment', label: 'Harassment (New)' },
    { value: 'general', label: 'General' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSpecializationChange = (e) => {
    const value = e.target.value;
    const newSpecs = formData.specializations.includes(value)
      ? formData.specializations.filter(s => s !== value)
      : [...formData.specializations, value];
    setFormData({ ...formData, specializations: newSpecs });
  };

  // Fetch admins when role changes to super_admin
  useEffect(() => {
    if (formData.role === 'super_admin' && !admins.length && !loadingAdmins) {
      fetchAdmins();
    }
  }, [formData.role]);

  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const adminsList = await getAllAdmins();
      setAdmins(adminsList);
      setShowAdmins(true);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
    } finally {
      setLoadingAdmins(false);
    }
  };

  // Group admins by specialization
  const adminsBySpecialization = admins.reduce((acc, admin) => {
    (admin.specializations || []).forEach(spec => {
      if (!acc[spec]) acc[spec] = [];
      acc[spec].push(admin);
    });
    return acc;
  }, {});

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

    if (formData.specializations.length === 0) {
      setError('Please select at least one specialization');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      await registerAdmin(registrationData);
      
      // Show success message
      alert('✅ Admin registration successful! Please login with your credentials.');
      
      // Redirect to admin login after successful registration
      navigate('/admin/login');
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
        <Link to="/" className="flex justify-center items-center gap-2 mb-8">
          <Shield className="w-10 h-10 text-blue-400" />
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Admin Portal
          </span>
        </Link>

        <div className="auth-card">
          <h2 className="text-3xl font-bold mb-2 text-center">Admin Registration</h2>
          <p className="text-slate-400 text-center mb-8">Create your admin account</p>

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
                <label className="block text-sm font-medium mb-2">Employee ID</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-10 py-3 focus:outline-none focus:border-blue-500 transition"
                    placeholder="EMP001"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Department</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-10 py-3 focus:outline-none focus:border-blue-500 transition"
                    placeholder="Computer Science"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Specializations (Select at least one)</label>
              <div className="grid grid-cols-2 gap-3">
                {specializationOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer hover:border-blue-500 transition ${
                      formData.specializations.includes(option.value)
                        ? 'bg-blue-500/10 border-blue-500'
                        : 'bg-slate-900/50 border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={formData.specializations.includes(option.value)}
                      onChange={handleSpecializationChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Case Load</label>
              <input
                type="number"
                name="maxCaseLoad"
                value={formData.maxCaseLoad}
                onChange={handleChange}
                min="1"
                max="200"
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/50 transition"
            >
              {loading ? (
                'Creating Account...'
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Admin Account
                </>
              )}
            </button>
          </form>

          {/* Display admins by specialization when registering as super_admin */}
          {formData.role === 'super_admin' && showAdmins && (
            <div className="mt-8 border-t border-slate-700 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold">Current Admins by Specialization</h3>
              </div>
              
              {loadingAdmins ? (
                <p className="text-slate-400 text-center py-4">Loading admins...</p>
              ) : Object.keys(adminsBySpecialization).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(adminsBySpecialization).map(([specialization, specAdmins]) => (
                    <div key={specialization} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                      <h4 className="text-blue-400 font-medium mb-2 capitalize">{specialization}</h4>
                      <ul className="space-y-2">
                        {specAdmins.map(admin => (
                          <li key={admin._id} className="text-sm border-b border-slate-800 pb-2">
                            <div className="font-medium">{admin.name}</div>
                            <div className="text-slate-400 text-xs">{admin.department} • {admin.email}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-4">No admins found</p>
              )}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Already have an admin account?{' '}
              <Link to="/admin/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminRegister;
