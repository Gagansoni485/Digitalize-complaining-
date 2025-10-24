import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  User, 
  Hash, 
  Building2, 
  Phone, 
  Mail,
  FileText,
  CheckCircle,
  Home,
  EyeOff,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { submitComplaint } from '../utils/api';

const SubmitComplaint = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { student } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');

  const [formData, setFormData] = useState({
    complaintType: '',
    description: '',
    // Student info pre-filled from auth
    name: student?.name || '',
    rollNo: student?.rollNo || '',
    department: student?.branch || '',
    branch: '',
    semester: '',
    phone: '',
    email: student?.email || ''
  });

  const categoryInfo = {
    academic: {
      title: 'Academic Issues',
      types: [
        'Course Content Issues',
        'Faculty Behavior',
        'Curriculum Concerns',
        'Class Schedule Problems',
        'Assignment/Project Issues',
        'Other Academic Matter'
      ],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/50'
    },
    sports: {
      title: 'Sports & Facilities',
      types: [
        'Equipment Issues',
        'Facility Maintenance',
        'Event Organization',
        'Ground/Court Problems',
        'Safety Concerns',
        'Other Sports Matter'
      ],
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/50'
    },
    exam: {
      title: 'Exam Related',
      types: [
        'Question Paper Issues',
        'Evaluation/Grading',
        'Exam Schedule Conflict',
        'Result Declaration',
        'Re-evaluation Request',
        'Other Exam Matter'
      ],
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/50'
    },
    harassment: {
      title: 'Harassment Report',
      types: [
        'Verbal Harassment',
        'Physical Harassment',
        'Cyber Bullying',
        'Discrimination',
        'Ragging',
        'Other Safety Concern'
      ],
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/50'
    }
  };

  const info = categoryInfo[category] || categoryInfo.academic;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.complaintType) {
      setError('Please select a complaint type');
      return;
    }
    if (currentStep === 2 && !formData.description.trim()) {
      setError('Please provide a description');
      return;
    }
    setError('');
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setError('');
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const complaintData = {
        title: `${info.title} - ${formData.complaintType}`,
        description: formData.description,
        category: category,
        department: formData.department,
        anonymous: isAnonymous,
        priority: category === 'harassment' ? 'high' : 'normal',
        studentInfo: isAnonymous ? null : {
          name: formData.name,
          rollNo: formData.rollNo,
          department: formData.department,
          branch: formData.branch,
          semester: formData.semester ? parseInt(formData.semester) : undefined,
          phone: formData.phone,
          email: formData.email
        }
      };

      const response = await submitComplaint(complaintData);
      setToken(response.token);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-bold mb-4">Complaint Submitted!</h2>
          <p className="text-slate-300 mb-6">Your complaint has been received and will be reviewed soon.</p>
          
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 mb-6">
            <p className="text-sm text-slate-400 mb-2">Your Token Number</p>
            <p className="text-4xl font-bold text-blue-400 font-mono mb-2">{token}</p>
            <p className="text-sm text-slate-400">Save this number to track your complaint</p>
          </div>

          <div className="flex gap-4">
            <Link to="/track" className="flex-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold"
              >
                Track Status
              </motion.button>
            </Link>
            <Link to="/dashboard" className="flex-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-3 bg-slate-700 rounded-lg font-semibold"
              >
                Dashboard
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

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

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step 
                    ? `bg-gradient-to-br ${info.color}` 
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? `bg-gradient-to-r ${info.color}` : 'bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            <span className={currentStep >= 1 ? 'text-blue-400' : 'text-slate-400'}>Select Type</span>
            <span className={currentStep >= 2 ? 'text-blue-400' : 'text-slate-400'}>Describe Issue</span>
            <span className={currentStep >= 3 ? 'text-blue-400' : 'text-slate-400'}>Your Details</span>
          </div>
        </div>

        {/* Form Card */}
        <div className={`bg-slate-800/50 backdrop-blur-sm border ${info.borderColor} rounded-2xl p-8`}>
          <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r ${info.color} bg-clip-text text-transparent`}>
            {info.title}
          </h1>
          <p className="text-slate-400 mb-8">Step {currentStep} of 3</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Select Complaint Type */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold mb-4">What type of issue are you facing?</h3>
                  <div className="grid gap-3">
                    {info.types.map((type) => (
                      <motion.label
                        key={type}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                          formData.complaintType === type
                            ? `${info.bgColor} ${info.borderColor}`
                            : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="complaintType"
                          value={type}
                          checked={formData.complaintType === type}
                          onChange={handleChange}
                          className="w-5 h-5"
                        />
                        <span className="font-medium">{type}</span>
                      </motion.label>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Description */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold mb-4">Describe your complaint</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Detailed Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={8}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition resize-none"
                      placeholder="Please provide as much detail as possible about your complaint..."
                      required
                    />
                    <p className="text-sm text-slate-400 mt-2">
                      {formData.description.length} characters
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Student Details */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Your Information</h3>
                    
                    {/* Anonymous Toggle */}
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 mb-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="w-5 h-5"
                        />
                        <div className="flex items-center gap-2">
                          {isAnonymous ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          <span className="font-medium">Submit Anonymously</span>
                        </div>
                      </label>
                      <p className="text-sm text-slate-400 mt-2 ml-8">
                        Your identity will be kept confidential
                      </p>
                    </div>
                  </div>

                  {!isAnonymous && (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition"
                              required={!isAnonymous}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Roll Number</label>
                          <div className="relative">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="text"
                              name="rollNo"
                              value={formData.rollNo}
                              onChange={handleChange}
                              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition"
                              required={!isAnonymous}
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
                              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition"
                              required={!isAnonymous}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Branch</label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select
                              name="branch"
                              value={formData.branch}
                              onChange={handleChange}
                              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition"
                              required={!isAnonymous}
                            >
                              <option value="">Select Branch</option>
                              <option value="CSE">Computer Science Engineering</option>
                              <option value="ECE">Electronics & Communication</option>
                              <option value="EEE">Electrical & Electronics</option>
                              <option value="ME">Mechanical Engineering</option>
                              <option value="CE">Civil Engineering</option>
                              <option value="IT">Information Technology</option>
                              <option value="BT">Biotechnology</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Semester</label>
                          <select
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
                          >
                            <option value="">Select Semester</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                              <option key={sem} value={sem}>{sem}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Phone</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition"
                              placeholder="10-digit number"
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
                              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition"
                              required={!isAnonymous}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {isAnonymous && (
                    <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-400 px-4 py-3 rounded-lg">
                      Your complaint will be submitted anonymously. You can still track it using the token number.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <motion.button
                  type="button"
                  onClick={handleBack}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-700 rounded-lg font-semibold hover:bg-slate-600 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </motion.button>
              )}
              
              {currentStep < 3 ? (
                <motion.button
                  type="button"
                  onClick={handleNext}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${info.color} rounded-lg font-semibold hover:shadow-lg transition`}
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${info.color} rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50`}
                >
                  {loading ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Complaint
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;
