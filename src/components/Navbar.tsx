import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, Video, Brain, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  user?: any;
  onAuthClick?: (mode: 'signin' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAuthClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, isPatient, isDoctor, loading } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  // Define navigation links based on authentication status
  const publicNavLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
  ];

  const authenticatedNavLinks = [
    { path: '/', label: 'Home' },
    { path: '/doctors', label: 'Find Doctors' },
    { path: '/symptom-checker', label: 'Symptom Checker' },
    { path: '/enhanced-symptom-checker', label: 'AI Health Assistant' },
    { path: '/video-consultation', label: 'Video Consultation' },
    { path: '/appointments', label: 'Book Appointment' },
    { path: '/contact', label: 'Contact' },
    { path: '/about', label: 'About' },
  ];

  const navLinks = user ? authenticatedNavLinks : publicNavLinks;

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-sky-500" />
              <span className="text-2xl font-bold text-gray-900">MedAssist</span>
              <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full">
                AI Enhanced
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                  isActive(path)
                    ? 'text-sky-600 bg-sky-50'
                    : 'text-gray-700 hover:text-sky-600 hover:bg-gray-50'
                }`}
              >
                {path === '/video-consultation' && <Video className="h-4 w-4 mr-1" />}
                {path === '/enhanced-symptom-checker' && <Brain className="h-4 w-4 mr-1" />}
                {label}
              </Link>
            ))}

            {/* Auth Section */}
            <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDoctor ? 'bg-emerald-100 text-emerald-600' : 'bg-sky-100 text-sky-600'
                    }`}>
                      <User className="h-4 w-4" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        {user.user_metadata?.name || user.email?.split('@')[0]}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {isDoctor ? 'Doctor' : 'Patient'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    disabled={loading}
                    className="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onAuthClick?.('signin')}
                    className="text-gray-700 hover:text-sky-600 font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onAuthClick?.('signup')}
                    className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-sky-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center ${
                    isActive(path)
                      ? 'text-sky-600 bg-sky-50'
                      : 'text-gray-700 hover:text-sky-600 hover:bg-gray-50'
                  }`}
                >
                  {path === '/video-consultation' && <Video className="h-4 w-4 mr-2" />}
                  {path === '/enhanced-symptom-checker' && <Brain className="h-4 w-4 mr-2" />}
                  {label}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center px-3 py-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        isDoctor ? 'bg-emerald-100 text-emerald-600' : 'bg-sky-100 text-sky-600'
                      }`}>
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.user_metadata?.name || user.email?.split('@')[0]}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {isDoctor ? 'Doctor' : 'Patient'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      disabled={loading}
                      className="w-full text-left px-3 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors flex items-center disabled:opacity-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        onAuthClick?.('signin');
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-gray-700 hover:text-sky-600 font-medium transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        onAuthClick?.('signup');
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-sky-500 hover:bg-sky-600 text-white px-3 py-2 rounded-lg font-medium transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};