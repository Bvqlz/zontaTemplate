// src/components/Mission.jsx
import { motion } from "framer-motion";

export default function Mission() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center px-6">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-zonta-burgundy mb-4">
          Our Mission
        </h2>
        <div className="w-24 h-1 bg-zonta-gold mx-auto mb-6"></div>
      </motion.div>

      <motion.p
        className="text-xl text-gray-600 max-w-3xl mx-auto mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        Zonta Club of Naples is part of a global organization of professionals empowering women worldwide through service and advocacy.
        We envision a world in which women's rights are recognized as human rights and every woman is able to achieve her full potential.
      </motion.p>

      {/* Icons Row */}
      <motion.div
        className="flex justify-center space-x-20 mt-10"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0, y: 15 },
          show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
        }}
      >
        <motion.img
          src="/src/assets/zonta-advocacy-scale.png"
          alt="Advocacy"
          className="w-32 h-32"
          variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4 }}
        />
        <motion.img
          src="/src/assets/zonta-scholarship-books.png"
          alt="Scholarship"
          className="w-32 h-32"
          variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4 }}
        />
        <motion.img
          src="/src/assets/zonta-service-hands.png"
          alt="Service"
          className="w-32 h-32"
          variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
      </div>
    </section>
  );
}


  