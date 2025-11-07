// src/components/Mission.jsx
import { motion } from "framer-motion";

export default function Mission() {
  return (
    <section id="about" className="py-20 max-w-6xl mx-auto text-center px-6">
      {/*The Mission Statement is not consistent with the rest of the home page need to change this */}
      <motion.h3
        className="text-3xl font-bold text-red-800 mb-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        Our Mission
      </motion.h3>

      <motion.p
        className="text-lg leading-relaxed text-gray-700 max-w-3xl mx-auto mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        viewport={{ once: true }}
      >
        Zonta Club of Naples is part of a global organization of professionals empowering women worldwide through service and advocacy.
        We envision a world in which women's rights are recognized as human rights and every woman is able to achieve her full potential.
      </motion.p>

      {/* Icons Row */}
      <motion.div
        className="flex justify-center space-x-20 mt-10"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } }
        }}
      >
        <motion.img
          src="/src/assets/zonta-advocacy-scale.png"
          alt="Advocacy"
          className="w-32 h-32"
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6 }}
        />
        <motion.img
          src="/src/assets/zonta-scholarship-books.png"
          alt="Scholarship"
          className="w-32 h-32"
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6 }}
        />
        <motion.img
          src="/src/assets/zonta-service-hands.png"
          alt="Service"
          className="w-32 h-32"
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </section>
  );
}


  