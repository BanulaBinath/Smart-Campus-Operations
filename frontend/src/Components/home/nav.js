import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import './nav.css';

function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-white/90 backdrop-blur-md border-gray-200 shadow-sm py-3' : 'bg-transparent border-transparent py-5'}`}>
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" style={{ textDecoration: 'none' }}>
          <div className="flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-2 shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <GraduationCap size={28} className="text-white" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-gray-900 group-hover:text-blue-700 transition-colors">CampusOps</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6 items-center">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Home</Link>
            <a href="/#about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">About Us</a>
            <a href="/#facilities" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Facilities</a>
            <a href="/#contact" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Contact Us</a>
          </div>
          <div className="flex items-center gap-4 border-l border-gray-200 pl-8">
            <Link to="/login" className="text-gray-700 font-bold hover:text-blue-600 transition-colors">Login</Link>
            <Link to="/signup" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all">Sign Up</Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-gray-600 hover:text-blue-600 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-700 hover:text-blue-600">Home</Link>
          <a href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-700 hover:text-blue-600">About Us</a>
          <a href="/#facilities" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-700 hover:text-blue-600">Facilities</a>
          <a href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-700 hover:text-blue-600">Contact Us</a>
          <hr className="my-2 border-gray-100" />
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-gray-700 hover:text-blue-600">Login</Link>
          <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-3 bg-blue-600 text-white font-bold rounded-lg mt-2">Sign Up</Link>
        </div>
      )}
    </header>
  );
}

export default Nav;
