import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Shield,
  Clock,
  Users,
  ArrowRight,
  CheckCircle,
  UserPlus,
  FileText,
  Share2,
  Search,
  Workflow,
} from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Anonymous",
      description:
        "Submit complaints anonymously with complete privacy protection",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-time Tracking",
      description: "Track your complaint status with unique token number",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Specialized Admins",
      description: "Complaints routed to specialized department admins",
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Direct Communication",
      description: "Get updates and communicate with assigned admins",
    },
  ];

  const categories = [
    { name: "Academic Issues", color: "from-blue-500 to-cyan-500" },
    { name: "Sports & Facilities", color: "from-green-500 to-emerald-500" },
    { name: "Exam Related", color: "from-purple-500 to-pink-500" },
    { name: "Harassment", color: "from-red-500 to-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              UniVoice
            </span>
          </motion.div>
          <div className="flex gap-4">
            <Link to="/admin/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 text-slate-400 hover:text-slate-300 transition"
              >
                Admin Portal
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 text-blue-400 hover:text-blue-300 transition"
              >
                Login
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/50 transition"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-white">
              Amplify Your Voice, Make a Difference with{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                UniVoice
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-lg">
              UniVoice is a secure and efficient platform designed to help you
              submit, track, and resolve complaints within your university
              community. Your concerns, heard and acted upon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-semibold text-lg text-white flex items-center gap-2 hover:shadow-xl hover:shadow-blue-500/60 transition"
                >
                  Submit a Complaint <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/track">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 text-blue-300 border border-blue-400 rounded-lg font-semibold text-lg hover:bg-blue-900/20 hover:border-blue-300 transition"
                >
                  Track Complaint
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:flex justify-center items-center py-10"
          >
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-8 flex items-center justify-center border border-blue-500/30">
              <div className="absolute inset-4 rounded-2xl bg-slate-800/50 flex flex-col items-center justify-center gap-4 text-center p-6">
                <MessageSquare className="w-20 h-20 text-blue-400 opacity-80" />
                <p className="text-xl font-semibold text-slate-200">
                  Your Voice Matters
                </p>
                <p className="text-slate-400 text-sm">
                  Ensuring fair and timely resolution.
                </p>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-6 -left-6 bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-full shadow-xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-full shadow-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
        >
          The UniVoice Difference: <br className="block md:hidden" /> Empowering
          Your Campus Experience
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{
                y: -10,
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
              }}
              className="bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 flex flex-col items-start text-left hover:border-blue-500/60 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute -top-5 -right-5 w-24 h-24 bg-blue-500/10 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
              <div className="text-blue-400 bg-blue-400/10 p-3 rounded-full mb-6 relative z-10">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white relative z-10">
                {feature.title}
              </h3>
              <p className="text-slate-400 relative z-10">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
        >
          Common Complaint Categories
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
              }}
              className={`relative bg-gradient-to-br ${category.color} p-8 rounded-2xl text-center font-bold text-xl text-white cursor-pointer shadow-xl transform transition-all duration-300 ease-in-out`}
            >
              {category.name}
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
        >
          How UniVoice Works
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <UserPlus className="w-10 h-10 text-blue-400" />,
              title: "1. Register",
              description: "Quickly create an account to get started.",
            },
            {
              icon: <FileText className="w-10 h-10 text-cyan-400" />,
              title: "2. Submit Complaint",
              description: "Fill out a simple form, optionally anonymously.",
            },
            {
              icon: <Share2 className="w-10 h-10 text-purple-400" />,
              title: "3. Routed to Admin",
              description: "Your complaint is sent to the relevant department.",
            },
            {
              icon: <Search className="w-10 h-10 text-green-400" />,
              title: "4. Track & Resolve",
              description: "Monitor progress and get updates until resolution.",
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 text-center flex flex-col items-center justify-center hover:border-blue-500/60 transition-all duration-300"
            >
              <div className="mb-6">{step.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                {step.title}
              </h3>
              <p className="text-slate-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-3xl p-10 md:p-16 border border-blue-500/30 backdrop-blur-sm shadow-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
            Ready to Make Your Voice Heard?
          </h2>
          <p className="text-xl text-slate-200 mb-10 max-w-2xl mx-auto">
            Join UniVoice today and contribute to a more responsive and
            inclusive campus environment.
          </p>
          <Link to="/register">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full font-bold text-xl text-white flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 mx-auto"
            >
              Get Started Now <ArrowRight className="w-6 h-6" />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent border-t border-slate-700/50 py-12">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <p className="mb-2">&copy; 2024 UniVoice. All rights reserved.</p>
          <p className="text-sm">
            Designed with &hearts; for a better campus experience.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
