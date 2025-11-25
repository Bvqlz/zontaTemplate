// src/components/Zonta100Years.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Zonta100Years() {
  return (
    <section className="section-padding bg-gradient-to-br from-zonta-burgundy via-zonta-burgundy to-zonta-burgundy-dark text-white relative overflow-hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_4px_6px_-1px_rgba(0,0,0,0.1)]">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-zonta-gold rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-zonta-gold rounded-full filter blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <motion.img
            src="/src/assets/Zonta100years.png"
            alt="Zonta 100 Years Logo"
            className="mx-auto mb-8 w-64 md:w-80 h-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
          />

          {/* Title */}
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-zonta-gold mb-6"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            Celebrating Over 100 Years of Service
          </motion.h2>

          {/* Gold Divider */}
          <motion.div
            className="w-24 h-1 bg-zonta-gold mx-auto mb-8"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            viewport={{ once: true, margin: "-50px" }}
          />

          {/* Description */}
          <motion.p
            className="text-lg md:text-xl leading-relaxed text-white/90 mb-8"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            For a century, Zonta International has worked to advance the status of
            women through service and advocacy. The Zonta Club of Naples proudly
            continues this legacy, striving for equality, education, and
            empowerment worldwide.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <Link
              to="/centennial"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-block bg-zonta-gold text-zonta-burgundy px-8 py-4 rounded-lg font-semibold text-lg hover:bg-zonta-gold-dark hover:shadow-lg transition-all duration-300"
            >
              Explore Our Legacy
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}



