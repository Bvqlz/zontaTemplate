// src/pages/ZontaCentennial.jsx
import { useState } from "react";
import { motion } from "framer-motion";

const imgs = [
  { src: "/src/assets/zonta-women-100-1.png", alt: "Zonta members participating in a centennial event" },
  { src: "/src/assets/zonta-women-100-2.png", alt: "Community outreach supporting women and girls" },
  { src: "/src/assets/zonta-women-100-3.png", alt: "Scholarship and education initiatives" },
  { src: "/src/assets/zonta-women-100-5.png", alt: "Advocacy for women's rights" },
  { src: "/src/assets/zonta-women-100-6.png", alt: "Local partnership and collaboration" },
  { src: "/src/assets/zonta-women-100-7.png", alt: "Celebrating a century of impact" },
];

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: d },
  viewport: { once: true, amount: 0.25 },
});

export default function ZontaCentennial() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      {/* Background */}
      <main className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            {/* Anniversary logo */}
            <motion.img
              src="/src/assets/Zonta100years.png"
              alt="Zonta 100 Year Anniversary Logo"
              className="mx-auto mb-6 w-64 md:w-80 h-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            />

            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-zonta-burgundy mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              100 Years of Service & Advocacy
            </motion.h1>
            
            <motion.div
              className="w-24 h-1 bg-zonta-gold mx-auto mb-6"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            />
            
            <motion.p 
              className="text-xl text-gray-700 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              For more than a century, Zonta clubs around the world have united professionals and community
              leaders to advance the status of women through service and advocacy. The Zonta Club of Naples
              continues this legacy locally—supporting education, safety, health, and economic opportunity for
              women and girls.
            </motion.p>
          </div>

          {/* Main Content */}
          <div className="max-w-5xl mx-auto">
            <section className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8 border-t-4 border-zonta-burgundy">
              {/* Paragraph 1 */}
              <motion.p className="text-gray-700 leading-relaxed text-lg mb-6" {...fadeUp(0)}>
              Zonta's centennial marked a milestone in collective action. From early literacy efforts to
              modern-day partnerships that address violence, inequality, and access to education, Zonta
              members have always paired compassion with practical impact. Our work scales from individual
              mentorship to policy engagement—meeting needs today while advocating for systemic change.
            </motion.p>

              {/* Image 1 */}
              <motion.div className="mb-8" {...fadeUp(0.05)}>
                <img
                  src={imgs[0].src}
                  alt={imgs[0].alt}
                  className="w-full h-[400px] object-cover rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  loading="lazy"
                  onClick={() => setSelectedImage(imgs[0].src)}
                />
              </motion.div>

              {/* Paragraph 2 */}
              <motion.p className="text-gray-700 leading-relaxed text-lg mb-6" {...fadeUp(0.1)}>
              Education has remained a cornerstone. Through scholarships and awards, Zonta encourages
              academic achievement and leadership—unlocking new possibilities for recipients and the
              communities they serve. Locally, Naples members sponsor initiatives that connect learning
              to opportunity, with an emphasis on long-term success.
            </motion.p>

              {/* Image 2 */}
              <motion.div className="mb-8" {...fadeUp(0.15)}>
                <img
                  src={imgs[1].src}
                  alt={imgs[1].alt}
                  className="w-full h-[400px] object-cover rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  loading="lazy"
                  onClick={() => setSelectedImage(imgs[1].src)}
                />
              </motion.div>

              {/* Paragraph 3 */}
              <motion.p className="text-gray-700 leading-relaxed text-lg mb-6" {...fadeUp(0.2)}>
              Service projects meet critical needs with dignity—supporting shelters, providing essentials,
              and volunteering side-by-side with trusted partners. These efforts are grounded in listening:
              understanding what will be most helpful and delivering it with care.
            </motion.p>

              {/* Image 3 */}
              <motion.div className="mb-8" {...fadeUp(0.25)}>
                <img
                  src={imgs[2].src}
                  alt={imgs[2].alt}
                  className="w-full h-[400px] object-cover rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  loading="lazy"
                  onClick={() => setSelectedImage(imgs[2].src)}
                />
              </motion.div>

              {/* Paragraph 4 */}
              <motion.p className="text-gray-700 leading-relaxed text-lg mb-6" {...fadeUp(0.3)}>
              Advocacy links local voices to global change. Zonta members elevate issues such as safety,
              health, and equity—supporting initiatives that protect rights and expand access to resources.
              By engaging with policymakers, educators, and nonprofits, clubs help create conditions where
              every woman can thrive.
            </motion.p>

              {/* Paragraph 5 */}
              <motion.p className="text-gray-700 leading-relaxed text-lg mb-6" {...fadeUp(0.35)}>
              Partnerships amplify impact. The Naples club collaborates with organizations that share our
              mission—combining resources and expertise to reach more people, more effectively. From
              scholarships to service days, collaboration turns good intentions into sustainable results.
            </motion.p>

              {/* Images 4–6 */}
              {[3, 4, 5].map((i, idx) => (
                <motion.div key={imgs[i].src} className="mb-8" {...fadeUp(0.4 + idx * 0.05)}>
                  <img
                    src={imgs[i].src}
                    alt={imgs[i].alt}
                    className="w-full h-[400px] object-cover rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    loading="lazy"
                    onClick={() => setSelectedImage(imgs[i].src)}
                  />
                </motion.div>
              ))}

              {/* Closing */}
              <motion.p className="text-gray-700 leading-relaxed text-lg" {...fadeUp(0.55)}>
              Zonta's second century begins with the same conviction that launched the first: when women
              and girls have access to safety, education, and opportunity, communities flourish. Thank you
              to every volunteer, donor, and partner who invests in this work—and to the next generation
              of leaders who will carry it forward.
            </motion.p>
            </section>
          </div>
        </div>

        {/* Fullscreen Image Overlay */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Fullscreen View"
              className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl object-contain"
            />
          </div>
        )}
      </main>
    </>
  );
}