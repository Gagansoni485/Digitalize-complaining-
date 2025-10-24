import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageSquare, Clock, CheckCircle, AlertCircle, XCircle, Home } from 'lucide-react';
import { trackComplaint } from '../utils/api';

const TrackComplaint = () => {
  const [token, setToken] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setComplaint(null);
    setLoading(true);

    try {
      const data = await trackComplaint(token);
      setComplaint(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'received':
        return <Clock className="w-6 h-6 text-blue-400" />;
      case 'assigned':
        return <Clock className="w-6 h-6 text-cyan-400" />;
      case 'in_progress':
        return <AlertCircle className="w-6 h-6 text-yellow-400" />;
      case 'resolved':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'closed':
        return <XCircle className="w-6 h-6 text-slate-400" />;
      default:
        return <Clock className="w-6 h-6 text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'received':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'assigned':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
      case 'in_progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'closed':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'normal':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'low':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <MessageSquare className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                UniVoice
              </span>
            </Link>
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition"
              >
                <Home className="w-5 h-5" />
                Dashboard
              </motion.button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-4 text-center">Track Your Complaint</h1>
          <p className="text-slate-300 text-center mb-8">
            Enter your 6-digit token number to check the status
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter 6-digit token (e.g., 123456)"
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg pl-12 pr-4 py-4 text-lg focus:outline-none focus:border-blue-500 transition"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                />
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Track'}
              </motion.button>
            </div>
          </form>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg mb-8"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Complaint Details */}
          <AnimatePresence>
            {complaint && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 space-y-6"
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{complaint.title}</h2>
                    <p className="text-slate-400">Token: <span className="text-blue-400 font-mono">{token}</span></p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <div className={`px-4 py-2 rounded-lg border ${getStatusColor(complaint.status)} font-medium flex items-center gap-2`}>
                      {getStatusIcon(complaint.status)}
                      {complaint.status.replace('_', ' ').toUpperCase()}
                    </div>
                    <div className={`px-4 py-2 rounded-lg border ${getPriorityColor(complaint.priority)} font-medium text-sm`}>
                      {complaint.priority.toUpperCase()} Priority
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-slate-300 bg-slate-900/50 p-4 rounded-lg">{complaint.description}</p>
                </div>

                {/* Timeline */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">Submitted On</p>
                    <p className="font-medium">{new Date(complaint.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">Last Updated</p>
                    <p className="font-medium">{new Date(complaint.updatedAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* Messages/Updates */}
                {complaint.messages && complaint.messages.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Updates & Messages</h3>
                    <div className="space-y-4">
                      {complaint.messages.filter(msg => msg.visible).map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-slate-900/50 border border-slate-700 p-4 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-blue-400">
                              {message.senderName || 'Admin'}
                            </span>
                            <span className="text-sm text-slate-400">
                              {new Date(message.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-slate-300">{message.body}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Progress */}
                <div className="pt-4 border-t border-slate-700">
                  <h3 className="text-lg font-semibold mb-4">Status Progress</h3>
                  <div className="flex items-center justify-between">
                    {['received', 'assigned', 'in_progress', 'resolved'].map((status, index) => {
                      const isActive = ['received', 'assigned', 'in_progress', 'resolved'].indexOf(complaint.status) >= index;
                      return (
                        <div key={status} className="flex flex-col items-center flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isActive ? 'bg-blue-500 border-blue-500' : 'bg-slate-700 border-slate-600'}`}>
                            {getStatusIcon(status)}
                          </div>
                          <p className={`text-xs mt-2 ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>
                            {status.replace('_', ' ')}
                          </p>
                          {index < 3 && (
                            <div className={`h-1 w-full mt-5 -ml-full ${isActive ? 'bg-blue-500' : 'bg-slate-700'}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default TrackComplaint;
