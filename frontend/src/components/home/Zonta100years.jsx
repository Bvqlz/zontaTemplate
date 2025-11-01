// src/components/Zonta100Years.jsx
import { motion } from "framer-motion";

export default function Zonta100Years() {
  return (
    <section
      id="zonta100"
      className="relative overflow-hidden py-10 text-center px-6 z-0"
      style={{ backgroundColor: '#6EC1E4' }}
    >
      {/* Center Logo */}
      <motion.img
        src="/src/assets/Zonta100years.png"
        alt="Zonta 100 Years Logo"
        className="mx-auto mb-1 w-80 h-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      />

      <motion.h3
        className="text-5xl font-bold text-yellow-400 mb-6 font-[Montserrat]"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Celebrating 100 Years
      </motion.h3>

      <motion.p
        className="text-lg leading-relaxed text-white max-w-3xl mx-auto mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        For a century, Zonta International has worked to advance the status of
        women through service and advocacy. The Zonta Club of Naples proudly
        continues this legacy, striving for equality, education, and
        empowerment worldwide.
      </motion.p>
    </section>
  );
}




