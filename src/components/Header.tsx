import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Play, User, LogOut, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Beranda', href: '/' },
    { name: 'Demo', href: '/demo' },
    { name: 'Dokumentasi', href: '/docs' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleNavClick = () => {
    setIsMenuOpen(false);
    // Small delay to ensure navigation happens first
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <header className="glass dark:glass-dark sticky top-0 z-50 border-b border-white/20 dark:border-gray-700/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group" onClick={handleNavClick}>
            <div className="relative">
              <img 
                src="./assets/SPP.png" 
                alt="SiPaling.pro Logo" 
                className="h-8 w-8 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg"
                loading="lazy"
              />
              <div className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-2xl font-bold gradient-text">
                SiPaling.pro
              </span>
              <span className="text-xs text-gray-600 dark:text-white font-medium hidden sm:block">
                Live Streaming Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={handleNavClick}
                className={`nav-link text-sm lg:text-base ${
                  isActive(item.href)
                    ? 'nav-link-active'
                    : 'text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-110"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>

            {/* User menu */}
            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link
                  to="/dashboard"
                  onClick={handleNavClick}
                  className="btn-primary flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base py-2 px-3 sm:py-3 sm:px-6"
                >
                  <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Panel</span>
                </Link>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="relative">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    {user.isPremium && (
                      <div className="absolute -top-1 -right-1">
                        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                      </div>
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      {user.isPremium ? 'Premium' : 'Free Account'}
                    </p>
                  </div>
                  <button
                    onClick={logout}
                    className="p-1 sm:p-2 text-gray-500 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    aria-label="Logout"
                  >
                    <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2 sm:space-x-3">
                <Link
                  to="/login"
                  onClick={handleNavClick}
                  className="btn-secondary text-sm sm:text-base py-2 px-3 sm:py-3 sm:px-6"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={handleNavClick}
                  className="btn-primary text-sm sm:text-base py-2 px-3 sm:py-3 sm:px-6"
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 sm:py-6 border-t border-white/20 dark:border-gray-700/50">
            <div className="space-y-2 sm:space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={handleNavClick}
                >
                  {item.name}
                </Link>
              ))}
              {!user && (
                <div className="pt-3 sm:pt-4 space-y-2 sm:space-y-3">
                  <Link
                    to="/login"
                    className="block w-full text-center btn-secondary text-sm sm:text-base py-2 sm:py-3"
                    onClick={handleNavClick}
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center btn-primary text-sm sm:text-base py-2 sm:py-3"
                    onClick={handleNavClick}
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;