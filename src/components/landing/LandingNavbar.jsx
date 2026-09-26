import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SpecularButton from '../ui/SpecularButton';

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dashboardPath = role === 'admin' ? '/admin/dashboard' : role === 'hr' ? '/hr/dashboard' : '/employee/dashboard';

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'About', href: '#security' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-3'
          : 'bg-slate-950/70 backdrop-blur-md border-b border-slate-800/50 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2.5 group transition-transform duration-200 active:scale-98"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 group-hover:shadow-indigo-500/40 transition-shadow">
              <Layers className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-white leading-none">
                Dayflow
              </span>
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest leading-tight">
                HR Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons with Specular Light Effect */}
          <div className="hidden md:flex items-center space-x-3">
            <SpecularButton
              size="sm"
              radius={12}
              baseColor="#1e293b"
              lineColor="#64748b"
              textColor="#f8fafc"
              onClick={() => navigate('/login')}
            >
              Sign In
            </SpecularButton>

            {isAuthenticated ? (
              <SpecularButton
                size="sm"
                radius={12}
                baseColor="#4f46e5"
                lineColor="#a5b4fc"
                textColor="#ffffff"
                onClick={() => navigate(dashboardPath)}
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Go to Dashboard
              </SpecularButton>
            ) : (
              <SpecularButton
                size="sm"
                radius={12}
                baseColor="#6366f1"
                lineColor="#ffffff"
                textColor="#ffffff"
                onClick={() => navigate('/register')}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-1" />
              </SpecularButton>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl">
          <div className="flex flex-col space-y-1 py-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 py-2.5 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-800 flex flex-col space-y-2.5">
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
              className="w-full text-center px-4 py-2.5 text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Sign In
            </button>
            {isAuthenticated ? (
              <button
                onClick={() => { setMobileMenuOpen(false); navigate(dashboardPath); }}
                className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
              >
                Go to Dashboard
              </button>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}
                className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg shadow-md shadow-indigo-500/20"
              >
                Get Started Free
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
