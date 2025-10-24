import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  LogOut, 
  User, 
  BookOpen, 
  Trophy, 
  FileQuestion, 
  AlertTriangle,
  MessageSquare 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { student, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const complaintCategories = [
    {
      title: 'Academic Issues',
      description: 'Problems related to courses, faculty, or curriculum',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-500/50',
      path: '/submit/academic'
    },
    {
      title: 'Sports & Facilities',
      description: 'Issues with sports facilities, equipment, or events',
      icon: <Trophy className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      borderColor: 'border-green-500/50',
      path: '/submit/sports'
    },
    {
      title: 'Exam Related',
      description: 'Examination, grading, or evaluation concerns',
      icon: <FileQuestion className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-500/50',
      path: '/submit/exam'
    },
    {
      title: 'Harassment',
      description: 'Report harassment or safety concerns (High Priority)',
      icon: <AlertTriangle className="w-8 h-8" />,
      color: 'from-red-500 to-orange-500',
      borderColor: 'border-red-500/50',
      path: '/submit/harassment'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <MessageSquare className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                UniVoice
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
                <User className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm font-medium">{student?.name}</p>
                  <p className="text-xs text-slate-400">{student?.rollNo}</p>
                </div>
              </div>
              
              <Link to="/track">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition"
                >
                  <Search className="w-5 h-5" />
                  <span className="hidden sm:inline">Track</span>
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/20 transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back, <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{student?.name}</span>
          </h1>
          <p className="text-xl text-slate-300">
            How can we help you today?
          </p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link to="/submit/academic">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-8 hover:shadow-lg hover:shadow-blue-500/20 transition cursor-pointer"
            >
              <FileText className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Submit New Complaint</h3>
              <p className="text-slate-300">Report an issue or concern</p>
            </motion.div>
          </Link>

          <Link to="/track">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-8 hover:shadow-lg hover:shadow-purple-500/20 transition cursor-pointer"
            >
              <Search className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Track Your Complaint</h3>
              <p className="text-slate-300">Check status with token number</p>
            </motion.div>
          </Link>
        </div>

        {/* Complaint Categories */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Select Complaint Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {complaintCategories.map((category, index) => (
              <Link key={index} to={category.path}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`bg-slate-800/50 backdrop-blur-sm border ${category.borderColor} rounded-xl p-6 cursor-pointer hover:shadow-xl transition group`}
                >
                  <div className={`bg-gradient-to-br ${category.color} p-3 rounded-lg inline-block mb-4 group-hover:scale-110 transition`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                  <p className="text-slate-400 text-sm">{category.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/30 border border-slate-700 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold mb-4">Important Information</h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>All complaints are reviewed and assigned to specialized admins</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>You'll receive a unique token number to track your complaint</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>You can submit complaints anonymously if needed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Harassment complaints are automatically marked as high priority</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
