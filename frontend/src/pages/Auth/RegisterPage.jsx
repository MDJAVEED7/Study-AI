import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/auth.service.js';
import toast from 'react-hot-toast';
import { BookOpen, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

const Register = ({ title = 'Notes Drill' }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Please make sure your passwords match.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.register(username, email, password);
      const { token, user } = result.data;
      login(user, token);

      toast.success(`Welcome to ${title}. Let\'s start learning!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.error || 'Failed to register user. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-gradient-to-br from-white via-purple-50 to-blue-50">
      {/* Left Side - Hero Section */}
      <section className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white blur-3xl animate-pulse" />
          <div className="absolute bottom-40 right-20 w-80 h-80 rounded-full bg-accent blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                <BookOpen className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <span className="text-3xl font-bold text-white">{title}</span>
            </div>

            <h2 className="text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
              Start your
              <br />
              learning journey
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Join thousands of learners who are mastering new skills with AI-powered personalized
              learning.
            </p>
          </div>
        </div>
      </section>

      {/* Right Side - Register Form */}
      <section className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
              <BookOpen className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{title}</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Create your account
            </h1>
            <p className="text-gray-600">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                User Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  placeholder="johndoe123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-white text-foreground border border-gray-200 w-full px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white text-foreground border border-gray-200 w-full px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white text-foreground border border-gray-200 w-full px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-white text-foreground border border-gray-200 w-full px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:text-secondary font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;
