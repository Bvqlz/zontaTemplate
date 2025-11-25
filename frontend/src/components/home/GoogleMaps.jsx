// src/components/Mission.jsx
import { motion } from "framer-motion";

export default function Mission() {
  return (
    <section id="about" className="bg-gray-50 py-20 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-10">
        
        {/* Text Section (Left Side) */}
        <div className="flex-1">
          <motion.h3
            className="text-4xl md:text-5xl font-bold text-zonta-burgundy mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            Join us for our next meeting!
          </motion.h3>

          <motion.p
            className="text-xl text-gray-600 max-w-md mx-auto md:mx-0 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            We meet the first Tuesday of each month at the Collier Community Foundation or via zoom call.
          </motion.p>

          <motion.h3
            className="text-2xl font-bold text-zonta-burgundy mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            The Collier Community Foundation <br />
            1110 Pine Ridge Rd #200, Naples, FL 34108
          </motion.h3>
        </div>

        {/* Image Section (Right Side with Link) */}
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <a
            href="https://maps.app.goo.gl/o1HTXf4TMMFwHoTr8"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/src/assets/zonta-map.png" 
              alt="Map of Zonta Meeting Location"
              className="rounded-2xl shadow-lg w-full max-w-md hover:scale-105 transition-transform duration-300"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
