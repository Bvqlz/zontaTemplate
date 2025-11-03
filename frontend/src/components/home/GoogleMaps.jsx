// src/components/Mission.jsx
import { motion } from "framer-motion";

export default function Mission() {
  return (
    <section id="about" className="bg-gray-100 py-20 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-10">
        
        {/* Text Section (Left Side) */}
        <div className="flex-1">
          <motion.h3
            className="text-3xl font-bold text-yellow-600 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Join us for our next meeting!
          </motion.h3>

          <motion.p
            className="text-lg leading-relaxed text-gray-700 max-w-md mx-auto md:mx-0 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            viewport={{ once: true }}
          >
            We meet the first Tuesday of every month. Networking and fellowship starts at 11:30, followed by the general meeting at noon!
          </motion.p>

          <motion.h3
            className="text-2xl font-bold text-yellow-600 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            The Hampton Social <br />
            9114 Strada Pl, Naples, FL 34108
          </motion.h3>
        </div>

        {/* Image Section (Right Side with Link) */}
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <a
            href="https://www.google.com/maps/place/The+Hampton+Social+-+Naples/@26.2525365,-81.7988287,17z/data=!4m15!1m8!3m7!1s0x88db1e94e3fa45cb:0x818327db950fc670!2s9114+Strada+Pl,+Naples,+FL+34108!3b1!8m2!3d26.2525365!4d-81.7988287!16s%2Fg%2F11pvcvnj2c!3m5!1s0x88db1fdd60808ff1:0x31a88711e9c35fd3!8m2!3d26.2529083!4d-81.7996599!16s%2Fg%2F11fj3038j8?entry=ttu&g_ep=EgoyMDI1MTAyNy4wIKXMDSoASAFQAw%3D%3D"
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
