// src/components/Hero.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center text-center text-white px-4 overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/src/assets/zonta-women.png')",
          backgroundPosition: "center 80px",
        }}
      ></div>

      {/* Solid Overlay - Burgundy */}
      <div className="absolute inset-0 bg-zonta-burgundy/85"></div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Logo */}
        <motion.img
          src="/src/assets/zonta-full-logo.png"
          alt="Zonta Club of Naples full logo"
          className="mx-auto mb-8 w-48 md:w-64"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        
        {/* Main Heading */}
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 font-heading tracking-wide"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Zonta Club of Naples
        </motion.h1>
        
        {/* Tagline */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 text-zonta-gold">
            Empowering Women
          </p>
          <p className="text-xl md:text-3xl lg:text-4xl font-semibold mb-2">
            through Service, Advocacy & Fundraising
          </p>
        </motion.div>
        
        {/* Description */}
        <motion.p 
          className="text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Making a difference in women's lives in Southwest Florida and around the world
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link 
            to="/join"
            className="bg-zonta-gold hover:bg-zonta-gold-dark text-white text-lg px-8 py-4 rounded-lg font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 min-w-[200px]"
          >
            Become a Member
          </Link>
          <a 
            href="/donate"
            className="bg-white hover:bg-gray-100 text-zonta-burgundy text-lg px-8 py-4 rounded-lg font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 min-w-[200px]"
          >
            Support Our Cause
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
