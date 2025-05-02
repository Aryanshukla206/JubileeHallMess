import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User, LogOut, Coffee, Calendar, Info, ClipboardList } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout, isAdmin, isResident } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // If not logged in and not on guest page or login page, don't show navbar
  if (!currentUser && location.pathname !== '/guest-booking' && location.pathname !== '/login') {
    return null;
  }

  // Links based on user role
  const navLinks = [];

  // Public link (for guests)
  if (location.pathname === '/guest-booking') {
    navLinks.push({ to: '/login', label: 'Login', icon: <User size={18} /> });
  } 
  // Links for authenticated users
  else if (currentUser) {
    if (isResident) {
      navLinks.push(
        { to: '/dashboard', label: 'Dashboard', icon: <Calendar size={18} /> },
        { to: '/menu', label: 'Menu', icon: <Coffee size={18} /> },
        { to: '/orders', label: 'Orders', icon: <ClipboardList size={18} /> }
      );
    } else if (isAdmin) {
      navLinks.push(
        { to: '/admin', label: 'Dashboard', icon: <Calendar size={18} /> },
        { to: '/menu', label: 'Menu', icon: <Coffee size={18} /> },
        { to: '/orders', label: 'Orders', icon: <ClipboardList size={18} /> }
      );
    }
  }

  // Determine which to use: light or dark navbar
  const isLightNavbar = location.pathname === '/login' || location.pathname === '/guest-booking';

  return (
    <nav className={`${isLightNavbar ? 'bg-white shadow-sm' : 'bg-blue-600 text-white'} fixed w-full top-0 left-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <Coffee size={24} />
                <span className="font-bold text-lg">Jubilee Hall Mess</span>
              </Link>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  flex items-center px-3 py-2 rounded-md text-sm font-medium 
                  ${location.pathname === link.to 
                    ? (isLightNavbar ? 'bg-gray-100 text-blue-600' : 'bg-blue-700 text-white') 
                    : (isLightNavbar ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-blue-700')}
                `}
              >
                {link.icon}
                <span className="ml-1">{link.label}</span>
              </Link>
            ))}
            
            {currentUser && (
              <button
                onClick={handleLogout}
                className={`
                  flex items-center px-3 py-2 rounded-md text-sm font-medium 
                  ${isLightNavbar ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-blue-700'}
                `}
              >
                <LogOut size={18} />
                <span className="ml-1">Logout</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                isLightNavbar ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-blue-700'
              }`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className={`px-2 pt-2 pb-3 space-y-1 ${isLightNavbar ? 'bg-white' : 'bg-blue-600'}`}>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  flex items-center px-3 py-2 rounded-md text-sm font-medium 
                  ${location.pathname === link.to 
                    ? (isLightNavbar ? 'bg-gray-100 text-blue-600' : 'bg-blue-700 text-white') 
                    : (isLightNavbar ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-blue-700')}
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                <span className="ml-1">{link.label}</span>
              </Link>
            ))}
            
            {currentUser && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className={`
                  w-full flex items-center px-3 py-2 rounded-md text-sm font-medium 
                  ${isLightNavbar ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-blue-700'}
                `}
              >
                <LogOut size={18} />
                <span className="ml-1">Logout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;