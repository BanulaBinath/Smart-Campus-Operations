import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, MapPin, Phone, Mail } from 'lucide-react';
import './footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-900 pt-16 pb-8 border-t border-gray-800 text-gray-300 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="flex flex-col space-y-6 lg:mr-8 text-left">
            <Link to="/" className="flex items-center justify-start gap-3 group" style={{ textDecoration: 'none' }}>
              <div className="flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                <GraduationCap size={22} className="text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white m-0">CampusOps</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed m-0 p-0 text-left w-full h-auto" style={{ textAlign: "left", margin: 0, padding: 0 }}>
              The premier platform for managing university facilities, grounds, and resources beautifully tailored for the academic community.
            </p>

          </div>

          {/* Quick Links */}
          <div className="space-y-6 text-left">
            <h4 className="text-white font-bold tracking-wide uppercase text-sm m-0 p-0">Quick Links</h4>
            <ul className="space-y-3 m-0 p-0 list-none text-left">
              <li className="m-0 p-0"><Link to="/" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Home</Link></li>
              <li className="m-0 p-0"><a href="/#about" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">About Us</a></li>
              <li className="m-0 p-0"><a href="/#facilities" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Facilities & Resources</a></li>
              <li className="m-0 p-0"><a href="/#contact" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6 text-left">
            <h4 className="text-white font-bold tracking-wide uppercase text-sm m-0 p-0">Resources</h4>
            <ul className="space-y-3 m-0 p-0 list-none text-left">
              <li className="m-0 p-0"><Link to="/login" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">User Portal</Link></li>
              <li className="m-0 p-0"><Link to="/signup" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Create Account</Link></li>
              <li className="m-0 p-0"><a href="/" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Help Center & FAQ</a></li>
              <li className="m-0 p-0"><a href="/" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Campus Maps</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 text-left">
            <h4 className="text-white font-bold tracking-wide uppercase text-sm m-0 p-0">Get In Touch</h4>
            <ul className="space-y-4 m-0 p-0 list-none text-left">
              <li className="flex items-start gap-3 m-0 p-0">
                <MapPin size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed text-gray-400">Student Services Center,<br />Main Campus, SG 90210</span>
              </li>
              <li className="flex items-center gap-3 m-0 p-0">
                <Phone size={18} className="text-blue-500 shrink-0" />
                <span className="text-sm text-gray-400">+94 11 555 1234</span>
              </li>
              <li className="flex items-center gap-3 m-0 p-0">
                <Mail size={18} className="text-blue-500 shrink-0" />
                <a href="mailto:support@smartcampus.edu" className="text-sm text-gray-400 hover:text-white transition-colors">support@smartcampus.edu</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p className="m-0 p-0">&copy; {currentYear} CampusOps. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/" className="hover:text-white hover:underline transition-all">Privacy Policy</a>
            <a href="/" className="hover:text-white hover:underline transition-all">Terms of Service</a>
            <a href="/" className="hover:text-white hover:underline transition-all">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
