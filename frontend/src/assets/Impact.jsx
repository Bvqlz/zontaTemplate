// src/pages/Impact.jsx
import { motion } from "framer-motion";
import { useState } from "react";

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: d },
  viewport: { once: true, amount: 0.25 },
});

export default function Impact() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <main className="relative min-h-screen pt-32 px-6 flex flex-col items-center text-center overflow-hidden">
      {/* Gradient background matching other pages */}
      <div className="absolute inset-0 bg-red-900/90" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl">
        {/* Zonta Logo at top */}
        <img
          src="/src/assets/zonta-full-logo.png"
          alt="Zonta Club Full Logo"
          className="mx-auto mb-8 w-48 opacity-90"
        />

        {/* Title with Montserrat font */}
        <h1 className="text-4xl font-bold mb-4 text-white font-[Montserrat]">Our Impact in Naples</h1>
        <p className="text-lg mb-12 text-white/90">
          Transforming lives and empowering women through dedicated service and advocacy
        </p>

        {/* Hero Image Grid */}
        <motion.div className="mb-16" {...fadeUp(0)}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img 
              src="/src/assets/impact-2.png" 
              alt="Zonta volunteers" 
              className="w-full h-48 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedImage("/src/assets/impact-2.png")}
            />
            <img 
              src="/src/assets/impact-5.png" 
              alt="Zonta event" 
              className="w-full h-48 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedImage("/src/assets/impact-5.png")}
            />
            <img 
              src="/src/assets/impact-7.png" 
              alt="Zonta members" 
              className="w-full h-48 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedImage("/src/assets/impact-7.png")}
            />
            <img 
              src="/src/assets/impact-8.png" 
              alt="Zonta community service" 
              className="w-full h-48 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedImage("/src/assets/impact-8.png")}
            />
          </div>
        </motion.div>

        {/* Main Content Section */}
        <section className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-8 mb-12">
          {/* Introduction Paragraph */}
          <motion.div className="mb-12" {...fadeUp(0)}>
            <p className="text-gray-700 leading-relaxed text-lg">
              Zonta International advocates for women's human rights and gender equality in all areas of women's rights. 
              ZI partners with UN agencies like UNFPA and UNICEF to financially support projects that empower women and girls, 
              focusing on health, education, equality, human rights, and combating human trafficking. At the local level, 
              the Zonta Club of Naples operates at full capacity, with our service committee actively identifying community 
              needs through monthly meetings and recommending impactful projects for board approval. This dedicated committee 
              coordinates all approved initiatives, ensuring every member participates in activities and events that make a 
              meaningful difference in our community.
            </p>
          </motion.div>

          {/* Impact Summary with Images */}
          <motion.div {...fadeUp(0.1)}>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 font-[Montserrat]">Our Community Impact</h2>
            
            <div className="space-y-12">
              {/* International Outreach */}
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="lg:w-1/2">
                  <img 
                    src="/src/assets/impact-1.png" 
                    alt="International service projects" 
                    className="w-full h-64 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedImage("/src/assets/impact-1.png")}
                  />
                </div>
                <div className="lg:w-1/2 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Global Partnerships</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our Z-Club traveled to Nassau, Bahamas, completing three international service projects at Kingsway Academy, 
                    Cleveland Eneas Elementary School, and Persia Roger's Senior Citizen Home. We donated books, clothing, towels, 
                    and blankets while building connections with the Zonta Club of Nassau.
                  </p>
                </div>
              </div>

              {/* Local Recognition */}
              <div className="flex flex-col lg:flex-row-reverse gap-8 items-center">
                <div className="lg:w-1/2">
                  <img 
                    src="/src/assets/impact-3.png" 
                    alt="Rose Day celebration" 
                    className="w-full h-64 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedImage("/src/assets/impact-3.png")}
                  />
                </div>
                <div className="lg:w-1/2 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Community Recognition</h3>
                  <p className="text-gray-700 leading-relaxed">
                    On International Women's Day 2022, we celebrated Rose Day by recognizing charitable organizations with 
                    yellow roses, symbolizing Zonta's camaraderie and mission. This annual tradition strengthens our partnerships 
                    with like-minded organizations throughout Collier County.
                  </p>
                </div>
              </div>

              {/* Healthcare Support */}
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="lg:w-1/2">
                  <img 
                    src="/src/assets/impact-4.png" 
                    alt="Healthcare appreciation" 
                    className="w-full h-64 object-cover object-top rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedImage("/src/assets/impact-4.png")}
                  />
                </div>
                <div className="lg:w-1/2 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Healthcare Appreciation</h3>
                  <p className="text-gray-700 leading-relaxed">
                    In April 2021, we launched a service project delivering cookies to caregivers at Naples Community Hospital's 
                    Downtown Campus, showing our deep appreciation for their dedicated service and care for our community during 
                    challenging times.
                  </p>
                </div>
              </div>

              {/* Law Enforcement Support */}
              <div className="flex flex-col lg:flex-row-reverse gap-8 items-center">
                <div className="lg:w-1/2">
                  <img 
                    src="/src/assets/impact-13.png" 
                    alt="Cookies for Cops initiative" 
                    className="w-full h-64 object-cover object-[center_25%] rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedImage("/src/assets/impact-13.png")}
                  />
                </div>
                <div className="lg:w-1/2 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Public Safety Support</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We proudly support the Collier County Sheriff's Office and Naples Jail Center through our "Cookies for Cops" 
                    initiative. In September 2020, members donated homemade cookies, brownies, and baked goods to thank officers 
                    for keeping our community safe.
                  </p>
                </div>
              </div>

              {/* Ongoing Partnerships */}
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="lg:w-1/2">
                  <img 
                    src="/src/assets/impact-15.png" 
                    alt="Habitat for Humanity partnership" 
                    className="w-full h-64 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedImage("/src/assets/impact-15.png")}
                  />
                </div>
                <div className="lg:w-1/2 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Sustainable Community Partnerships</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Through ongoing collaborations with organizations like Habitat for Humanity, our service committee, led by 
                    Chairperson Adele Hunter, has consistently volunteered to support affordable housing initiatives in our community. 
                    These long-term partnerships demonstrate our commitment to sustainable community development.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Photo Gallery Section */}
        <motion.section className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-8 mb-12" {...fadeUp(0.2)}>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 font-[Montserrat]">Moments That Matter</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <img 
              src="/src/assets/impact-6.png" 
              alt="Zonta community event" 
              className="w-full h-56 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedImage("/src/assets/impact-6.png")}
            />
            <img 
              src="/src/assets/impact-9.png" 
              alt="Zonta volunteer work" 
              className="w-full h-56 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedImage("/src/assets/impact-9.png")}
            />
            <img 
              src="/src/assets/impact-11.png" 
              alt="Zonta members collaboration" 
              className="w-full h-56 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedImage("/src/assets/impact-11.png")}
            />
            <img 
              src="/src/assets/impact-12.png" 
              alt="Zonta members collaboration" 
              className="w-full h-56 object-cover object-[center_25%] rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedImage("/src/assets/impact-12.png")}
            />
            <img 
              src="/src/assets/impact-14.png" 
              alt="Zonta community service" 
              className="w-full h-56 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedImage("/src/assets/impact-14.png")}
            />
            <img 
              src="/src/assets/impact-10.png" 
              alt="Zonta community partnership" 
              className="w-full h-56 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedImage("/src/assets/impact-10.png")}
            />
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-8" {...fadeUp(0.3)}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Join Us in Making a Difference</h2>
          <p className="text-gray-700 mb-6">
            Your support helps us continue our vital work empowering women and strengthening our community. 
            Together, we can create lasting change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/membership"
              className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Become a Member
            </a>
            <a
              href="/donate"
              className="inline-block bg-white hover:bg-gray-100 text-yellow-600 border border-yellow-600 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Support Our Work
            </a>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Overlay */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Fullscreen View"
            className="max-h-[90%] max-w-[90%] rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </main>
  );
}