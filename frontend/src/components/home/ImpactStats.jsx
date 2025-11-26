// src/components/ImpactStats.jsx
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// Counter animation hook
function useCounter(end, duration = 2000, isInView) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return count;
}

export default function ImpactStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    {
      value: 5000,
      suffix: "+",
      prefix: "$",
      label: "Raised for Women's Causes",
      description: "Total funds distributed to local organizations"
    },
    {
      value: 25,
      suffix: "+",
      label: "Scholarships Awarded",
      description: "Supporting women's education in SWFL"
    },
    {
      value: 20,
      suffix: "+",
      label: "Years of Service",
      description: "Making a difference since 1975"
    },
    {
      value: 10,
      suffix: "+",
      label: "Community Partners",
      description: "Local organizations we support"
    }
  ];

  return (
    <section 
      ref={ref}
      className="section-padding bg-gray-50 relative overflow-hidden"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-zonta-gold rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-zonta-burgundy rounded-full filter blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-zonta-burgundy">Our Impact</h2>
          <div className="w-24 h-1 bg-zonta-gold mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Together, we're creating lasting change in our community and beyond
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard 
              key={stat.label}
              stat={stat}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, index, isInView }) {
  const count = useCounter(stat.value, 2500, isInView);

  return (
    <motion.div
      className="text-center p-8 bg-gradient-to-br from-zonta-burgundy to-zonta-burgundy-dark rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Animated Number */}
      <div className="text-4xl md:text-5xl font-bold mb-2 text-zonta-gold">
        {stat.prefix}{count.toLocaleString()}{stat.suffix}
      </div>

      {/* Label */}
      <div className="text-lg md:text-xl font-semibold mb-2 text-white">
        {stat.label}
      </div>

      {/* Description */}
      <div className="text-sm text-gray-200">
        {stat.description}
      </div>
    </motion.div>
  );
}
