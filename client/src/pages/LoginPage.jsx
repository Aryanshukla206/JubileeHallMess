import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Coffee, User, Lock, LogIn, CloudLightning } from 'lucide-react';




const LoginPage = () => {
  const { login, currentUser } = useAuth();
  const { error, warning } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  // If user is already logged in, redirect to appropriate dashboard
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin');
      } else if (currentUser.role === 'resident') {
        navigate('/dashboard');
      }
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const user = await login(email, password);
      // //console.log(user, "------------------------.------------------->");

      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      if (user === undefined) {
        error('Invalid email or password');
      }
    } catch (err) {
      //console.log(err, "error in login");
      error(err.message || 'Invalid email or password');
      warning('Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Coffee size={24} className="text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-800">Jubilee Hall Mess</h1>
            </div>
            <Link
              to="/guest-booking"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Guest Booking
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Coffee size={48} className="mx-auto text-blue-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to manage your mess meals
            </p>
          </div>

          <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 space-y-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-3 border-gray-300 rounded-md"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-3 border-gray-300 rounded-md"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white 
                    ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <LogIn size={16} className="text-blue-300 group-hover:text-blue-200" />
                  </span>
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Demo Credentials
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                  <p className="font-medium mb-1">Resident</p>
                  <p>Email: resident_RoomNo@jubileehall.com</p>
                  <p>Password: resident@RoomNo</p>
                </div>
                {/* <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                  <p className="font-medium mb-1">Admin</p>
                  <p>Email: admin@jubileehall.com</p>
                  <p>Password: admin123</p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Jubilee Hall Mess. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;