// src/components/WhatWeDo.jsx
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function WhatWeDo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const cards = [
    {
      title: "Service",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      description: "We partner with local organizations to empower women and improve their lives through direct service and support programs.",
      highlights: [
        "Reduce violence against women",
        "Promote physical & mental health",
        "Enhance educational opportunities",
        "Build women leaders"
      ],
      bgColor: "bg-zonta-burgundy",
      iconColor: "text-white"
    },
    {
      title: "Advocacy",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      description: "We advocate for women's rights, equality, education, and work to end child marriage and gender-based violence.",
      highlights: [
        "Women's rights & equality",
        "End violence against women",
        "Education access for girls",
        "Policy & legislative change"
      ],
      bgColor: "bg-zonta-gold",
      iconColor: "text-zonta-burgundy"
    },
    {
      title: "Fundraising",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "Through signature events and campaigns, we raise funds to support local organizations and global Zonta initiatives.",
      highlights: [
        "Annual scholarship programs",
        "Community events & galas",
        "Grant awards to local nonprofits",
        "Support Zonta International"
      ],
      bgColor: "bg-zonta-burgundy",
      iconColor: "text-white"
    }
  ];

  return (
    <section ref={ref} className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">What We Do</h2>
          <div className="w-24 h-1 bg-zonta-gold mx-auto mb-6"></div>
          <p className="section-subtitle max-w-3xl mx-auto">
            Making a lasting impact through three core pillars of our mission
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              className="card-feature group"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {/* Icon with Solid Background */}
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${card.bgColor} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 ${card.iconColor}`}>
                {card.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-zonta-burgundy mb-4 text-center">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-6 text-center leading-relaxed">
                {card.description}
              </p>

              {/* Highlights */}
              <ul className="space-y-3 mb-6">
                {card.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-700">
                    <svg className="w-5 h-5 text-zonta-gold mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              {/* Learn More Link */}
              <div className="text-center">
                <a 
                  href={`#${card.title.toLowerCase()}`}
                  className="inline-block text-zonta-gold hover:text-zonta-gold-dark font-semibold transition-colors duration-300 group-hover:underline"
                >
                  Learn More →
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-xl text-gray-700 mb-6">
            Ready to make a difference with us?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/join"
              className="btn-primary inline-block"
            >
              Become a Member
            </a>
            <a 
              href="#donate"
              className="btn-outline inline-block"
            >
              Support Our Mission
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
