// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-zonta-navy via-zonta-navy-light to-zonta-navy-dark text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <img
              src="/src/assets/zonta-full-logo.png"
              alt="Zonta Club of Naples"
              className="h-16 mb-4 brightness-0 invert"
            />
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Zonta Club of Naples is part of Zonta International, empowering women worldwide through service and advocacy.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-zonta-gold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-zonta-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 hover:text-zonta-gold transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/join" className="text-gray-300 hover:text-zonta-gold transition-colors">
                  Join Us
                </Link>
              </li>
              <li>
                <Link to="/scholarship" className="text-gray-300 hover:text-zonta-gold transition-colors">
                  Scholarship
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-zonta-gold transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="text-lg font-bold text-zonta-gold mb-4">Get Involved</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#donate" className="text-gray-300 hover:text-zonta-gold transition-colors">
                  Donate
                </a>
              </li>
              <li>
                <Link to="/join" className="text-gray-300 hover:text-zonta-gold transition-colors">
                  Membership
                </Link>
              </li>
              <li>
                <a href="#advocacy" className="text-gray-300 hover:text-zonta-gold transition-colors">
                  Advocacy
                </a>
              </li>
              <li>
                <a href="https://www.zonta.org" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-zonta-gold transition-colors">
                  Zonta International
                </a>
              </li>
              <li>
                <a href="https://www.zonta-district11.org" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-zonta-gold transition-colors">
                  District 11
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-zonta-gold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>P.O. Box 12345<br/>Naples, FL 34102</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@zontanaples.org" className="hover:text-zonta-gold transition-colors">
                  info@zontanaples.org
                </a>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+12395551234" className="hover:text-zonta-gold transition-colors">
                  (239) 555-1234
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p className="mb-4 md:mb-0">
              © {new Date().getFullYear()} Zonta Club of Naples. All Rights Reserved.
            </p>
            <p className="text-center md:text-right">
              Proudly serving Southwest Florida since 1975 | 
              <span className="text-zonta-gold ml-1">Empowering Women Through Service & Advocacy</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
  