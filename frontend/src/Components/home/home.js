import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Flag, Target, MapPin, Mail, Phone, Clock } from 'lucide-react';
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
    { name: 'R B B Jayathilaka', role: 'Project Lead' },
    { name: 'Prathish S', role: 'Backend Developer' },
    { name: 'Siddarth J', role: 'Frontend Developer' },
    { name: 'A M D S K Attanayake', role: 'QA & DevOps Engineer' }
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
      <section id="about" className="py-24 bg-gray-50 border-t border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 rounded-[2.5rem] p-12 lg:p-20 text-center text-white mb-20 shadow-[0_20px_50px_rgba(13,93,216,0.3)] relative group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/3 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400 opacity-20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10">
              <span className="inline-block py-1 px-4 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-50 text-sm font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">Our Organization</span>
              <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight">About CampusOps</h2>
              <p className="text-xl lg:text-2xl text-blue-100/90 max-w-4xl mx-auto leading-relaxed font-light">
                Built for students, staff, and campus administrators. We believe in coordinating spaces 
                and resources with fewer conflicts, faster approvals, and a substantially better campus experience.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 mb-24">
            <div className="bg-white p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgba(13,93,216,0.1)] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-300 transform group-hover:scale-110"><Target className="w-48 h-48 text-blue-600" /></div>
              <div className="relative z-10">
                <div className="inline-flex p-4 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-2xl mb-6 shadow-sm border border-blue-100/50 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 mb-6">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed text-lg font-medium">
                  To simplify and modernize campus operations by providing a centralized platform for facility booking, asset management, maintenance ticketing, and real-time notifications, ensuring a seamless experience for students, staff, and administrators.
                </p>
              </div>
            </div>
            <div className="bg-white p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgba(13,93,216,0.1)] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-300 transform group-hover:scale-110"><Flag className="w-48 h-48 text-blue-600" /></div>
              <div className="relative z-10">
                <div className="inline-flex p-4 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-2xl mb-6 shadow-sm border border-blue-100/50 group-hover:scale-110 transition-transform duration-300">
                  <Flag className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 mb-6">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed text-lg font-medium">
                  To become the leading smart campus operations platform that transforms university resource management through innovation, efficiency, transparency, and technology-driven workflows.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-2 block">Leadership</span>
            <h3 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Meet the Team</h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">The dedicated professionals driving CampusOps forward.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-8 text-center border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(13,93,216,0.12)] transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full overflow-hidden border-[6px] border-white shadow-[0_8px_20px_rgb(0,0,0,0.08)] flex justify-center items-center text-gray-400 group-hover:from-blue-50 group-hover:to-blue-100 transition-colors duration-300 relative">
                    <Users className="w-12 h-12 group-hover:scale-110 transition-transform duration-300 group-hover:text-blue-500" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{member.name}</h4>
                  <p className="text-blue-700 font-semibold text-xs tracking-wider uppercase px-4 py-2 bg-blue-50/80 rounded-full inline-block border border-blue-100/50">{member.role}</p>
                </div>
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

            {/* Contact Details Section Replacing Map Placeholder */}
            <div className="lg:pl-10 flex flex-col gap-8">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(13,93,216,0.12)] transition-all duration-300 hover:-translate-y-1 group">
                <div className="flex items-start gap-5">
                  <div className="p-4 bg-white text-blue-600 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Campus Address</h4>
                    <p className="text-gray-600 leading-relaxed text-lg">New Kandy Road, Malabe, Sri Lanka<br/><span className="text-gray-500 text-sm">(Postal Code 10115)</span></p>
                  </div>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(13,93,216,0.12)] transition-all duration-300 hover:-translate-y-1 group">
                  <div className="w-14 h-14 flex items-center justify-center bg-white text-blue-600 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Phone</h4>
                  <p className="text-gray-600 text-lg font-medium">+94 11 754 4801</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(13,93,216,0.12)] transition-all duration-300 hover:-translate-y-1 group">
                  <div className="w-14 h-14 flex items-center justify-center bg-white text-blue-600 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Email</h4>
                  <a href="mailto:international.admissions@sliit.lk" className="text-blue-600 font-medium hover:underline break-all text-sm sm:text-base">
                    international.admissions<wbr/>@sliit.lk
                  </a>
                </div>
              </div>

              {/* Information Card Section Replacing Map */}
              <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 rounded-3xl p-10 border border-blue-500 shadow-[0_15px_30px_rgba(13,93,216,0.2)] text-white relative overflow-hidden group">
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-300 transform group-hover:scale-110">
                  <Clock className="w-24 h-24 text-white" />
                </div>
                <div className="relative z-10">
                  <h4 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/30 rounded-xl border border-blue-400/30 backdrop-blur-sm shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-6 h-6 text-blue-50" />
                    </div>
                    Support Information
                  </h4>
                  <div className="space-y-5 text-blue-50/90 text-lg">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-blue-500/40 pb-4 gap-2">
                      <span className="font-medium text-blue-200">Office Hours</span>
                      <span className="font-bold text-white tracking-wide bg-blue-900/50 px-3 py-1 rounded-lg border border-blue-800/50 text-base text-center">8:00 AM - 5:30 PM (Mon-Fri)</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-blue-500/40 pb-4 gap-2 mt-4">
                      <span className="font-medium text-blue-200">Support Availability</span>
                      <span className="font-bold text-white tracking-wide bg-blue-900/50 px-3 py-1 rounded-lg border border-blue-800/50 text-base text-center">24/7 Online Ticketing</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2 mt-4 gap-2">
                      <span className="font-medium text-blue-200">Campus Help Desk</span>
                      <span className="font-bold text-white tracking-wide text-base">IT Building, 1st Floor</span>
                    </div>
                  </div>
                </div>
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
