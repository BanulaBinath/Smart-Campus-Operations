import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Flag, Target, MapPin, Mail, Phone, CalendarCheck, Monitor, Map, Clock } from 'lucide-react';
import Nav from './nav';
import Footer from './footer';
import './home.css';

function Home() {
  const features = [
    {
      title: 'Lecture Hall',
      text: 'Reserve modern lecture spaces with real-time availability and schedule tracking.',
      icon: <BookOpen className="w-8 h-8 text-blue-500 mb-4" />
    },
    {
      title: 'Conference Hall',
      text: 'Book professional meeting halls for seminars, presentations, and student events.',
      icon: <Users className="w-8 h-8 text-blue-500 mb-4" />
    },
    {
      title: 'Sports Ground',
      text: 'Plan games and tournaments by checking open slots for campus sports grounds.',
      icon: <Flag className="w-8 h-8 text-blue-500 mb-4" />
    },
    {
      title: 'Sports Items',
      text: 'Request and manage sports equipment with quick pickup and return workflows.',
      icon: <Target className="w-8 h-8 text-blue-500 mb-4" />
    }
  ];

  const teamMembers = [
    { name: 'Alice Johnson', role: 'Campus Director' },
    { name: 'Bob Smith', role: 'Facilities Manager' },
    { name: 'Carol White', role: 'Student Coordinator' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      <Nav />

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white -z-10"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-100 blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm mb-6 border border-blue-200 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            Smart Booking. Smooth Campus Life.
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 max-w-4xl mx-auto leading-tight">
            The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Campus Management</span> System
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Manage bookings for lecture halls, conference halls, sports grounds, and facility items
            from one professional, student-friendly platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login" className="inline-flex justify-center items-center px-8 py-4 text-lg font-bold rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-1">
              Login to Dashboard
            </Link>
            <Link to="/signup" className="inline-flex justify-center items-center px-8 py-4 text-lg font-bold rounded-full text-blue-700 bg-white border border-gray-200 hover:bg-blue-50 hover:border-blue-200 shadow-sm transition-all hover:-translate-y-1">
              Create an Account
            </Link>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Facility Highlights</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Everything you need to orchestrate your academic and activity schedule seamlessly and without conflicts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 hover:-translate-y-2">
                <div className="p-3 bg-blue-50 rounded-xl inline-block mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-10 lg:p-16 text-center text-white mb-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">About CampusOps</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Built for students, staff, and campus administrators. We believe in coordinating spaces 
                and resources with fewer conflicts, faster approvals, and a substantially better campus experience.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Target className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                To streamline campus operations by providing an intuitive, transparent, and efficient booking ecosystem that empowers the academic community to focus on what truly matters.
              </p>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Flag className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Pioneering the future of educational infrastructure management through smart, data-driven software that natively understands the needs of modern universities.
              </p>
            </div>
          </div>

          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h3>
            <p className="text-gray-600">The dedicated professionals driving CampusOps forward.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full overflow-hidden border-4 border-white shadow-md flex justify-center items-center text-gray-400">
                  <Users className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">{member.name}</h4>
                <p className="text-blue-600 font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Have questions about CampusOps? Reach out to our support team and we will get back to you shortly.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-start">
            {/* Contact Form */}
            <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-xl border border-gray-100 relative">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-50 rounded-full -z-10 blur-xl"></div>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">First Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm bg-gray-50 focus:bg-white" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm bg-gray-50 focus:bg-white" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm bg-gray-50 focus:bg-white" placeholder="john@university.edu" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Message</label>
                  <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm bg-gray-50 focus:bg-white resize-none" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="w-full py-4 text-white font-bold text-lg rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5 active:translate-y-0">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Details & Map */}
            <div className="lg:pl-10 flex flex-col gap-8">
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="p-4 bg-white text-blue-600 rounded-2xl shadow-sm"><MapPin className="w-6 h-6" /></div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Campus Address</h4>
                  <p className="text-gray-600 leading-relaxed">123 University Avenue, Innovation Block<br/>Tech District, ST 90210</p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 flex items-center justify-center bg-white text-blue-600 rounded-xl shadow-sm mb-4"><Phone className="w-5 h-5" /></div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Phone</h4>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 flex items-center justify-center bg-white text-blue-600 rounded-xl shadow-sm mb-4"><Mail className="w-5 h-5" /></div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-600">support@campusops.edu</p>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="h-48 rounded-3xl bg-gray-200 border-2 border-dashed border-gray-300 flex flex-col justify-center items-center text-gray-500 relative overflow-hidden group">
                <Map className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-semibold px-4 text-center">Interactive Map Placeholder</span>
                <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;