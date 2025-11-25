// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import zontaLogo from "../../assets/zontaLogo.jpg";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 border-b-4 border-zonta-burgundy">
      <div className="container-custom">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img
              src={zontaLogo}
              alt="Zonta Club of Naples logo"
              className="h-14 md:h-16"
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-8 text-[16px] font-semibold text-zonta-burgundy">
            <li>
              <Link to="/" className="hover:text-zonta-gold transition-colors duration-300">
                HOME
              </Link>
            </li>
            <li>
              <Link to="/who-we-are" className="hover:text-zonta-gold transition-colors duration-300">
                WHO WE ARE
              </Link>
            </li>
            <li>
              <Link to="/impacts" className="hover:text-zonta-gold transition-colors duration-300">
                IMPACTS
              </Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-zonta-gold transition-colors duration-300">
                EVENTS
              </Link>
            </li>
            <li>
              <Link to="/scholarship" className="hover:text-zonta-gold transition-colors duration-300">
                SCHOLARSHIP
              </Link>
            </li>
            <li>
              <Link to="/join" className="hover:text-zonta-gold transition-colors duration-300">
                JOIN US
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-zonta-gold transition-colors duration-300">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-zonta-gold transition-colors duration-300">
                CONTACT
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-zonta-gold transition-colors duration-300">
                SHOP
              </Link>
            </li>
          </ul>

          {/* CTA Buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Social Media Icons */}
            <div className="flex items-center space-x-3 border-r border-gray-300 pr-4">
              <a 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zonta-burgundy hover:text-zonta-gold transition-colors duration-300"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>

            <a 
              href="/donate"
              className="bg-zonta-gold hover:bg-zonta-gold-dark text-zonta-burgundy px-6 py-2.5 rounded-lg font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              DONATE
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-zonta-burgundy p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <ul className="flex flex-col space-y-4 text-center">
              <li>
                <Link 
                  to="/" 
                  className="block py-2 text-zonta-burgundy hover:text-zonta-gold font-semibold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  HOME
                </Link>
              </li>
              <li>
                <Link 
                  to="/events" 
                  className="block py-2 text-zonta-burgundy hover:text-zonta-gold font-semibold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  EVENTS
                </Link>
              </li>
              <li>
                <Link 
                  to="/impacts" 
                  className="block py-2 text-zonta-burgundy hover:text-zonta-gold font-semibold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  IMPACTS
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="block py-2 text-zonta-burgundy hover:text-zonta-gold font-semibold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  to="/advocacy" 
                  className="block py-2 text-zonta-burgundy hover:text-zonta-gold font-semibold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ADVOCACY
                </Link>
              </li>
              <li>
                <Link 
                  to="/join" 
                  className="block py-2 text-zonta-burgundy hover:text-zonta-gold font-semibold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  JOIN US
                </Link>
              </li>
              <li>
                <Link 
                  to="/scholarship" 
                  className="block py-2 text-zonta-burgundy hover:text-zonta-gold font-semibold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  SCHOLARSHIP
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="block py-2 text-zonta-burgundy hover:text-zonta-gold font-semibold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  CONTACT
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop" 
                  className="block py-2 text-zonta-burgundy hover:text-zonta-gold font-semibold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  SHOP
                </Link>
              </li>
              <li className="pt-4 border-t border-gray-200">
                <Link 
                  to="/donate"
                  className="inline-block bg-zonta-gold hover:bg-zonta-gold-dark text-zonta-burgundy px-8 py-3 rounded-lg font-bold shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  DONATE
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

