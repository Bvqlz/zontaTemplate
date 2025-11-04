import { useState } from "react";

export default function Impact() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-zonta-burgundy mb-4">
            Our Impact in Naples
          </h1>
          <div className="w-24 h-1 bg-zonta-gold mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Transforming lives and empowering women through dedicated service and advocacy
          </p>
        </div>

        {/* Hero Image Grid */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img 
              src="/src/assets/impact-2.png" 
              alt="Zonta volunteers" 
              className="w-full h-48 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedImage("/src/assets/impact-2.png")}
            />
            <img 
              src="/src/assets/impact-5.png" 
              alt="Zonta event" 
              className="w-full h-48 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedImage("/src/assets/impact-5.png")}
            />
            <img 
              src="/src/assets/impact-7.png" 
              alt="Zonta members" 
              className="w-full h-48 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedImage("/src/assets/impact-7.png")}
            />
            <img 
              src="/src/assets/impact-8.png" 
              alt="Zonta community service" 
              className="w-full h-48 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedImage("/src/assets/impact-8.png")}
            />
          </div>
        </div>

        {/* Main Content Section */}
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-12 border-t-4 border-zonta-burgundy">
          {/* Introduction Paragraph */}
          <div className="mb-12">
            <p className="text-gray-700 leading-relaxed text-lg">
              Zonta International advocates for women's human rights and gender equality in all areas of women's rights. 
              ZI partners with UN agencies like UNFPA and UNICEF to financially support projects that empower women and girls, 
              focusing on health, education, equality, human rights, and combating human trafficking. At the local level, 
              the Zonta Club of Naples operates at full capacity, with our service committee actively identifying community 
              needs through monthly meetings and recommending impactful projects for board approval. This dedicated committee 
              coordinates all approved initiatives, ensuring every member participates in activities and events that make a 
              meaningful difference in our community.
            </p>
          </div>

          {/* Impact Summary with Images */}
          <div>
            <h2 className="text-3xl font-bold text-zonta-burgundy mb-8">Our Community Impact</h2>
            
            <div className="space-y-12">
              {/* International Outreach */}
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="lg:w-1/2">
                  <img 
                    src="/src/assets/impact-1.png" 
                    alt="International service projects" 
                    className="w-full h-64 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300"
                    onClick={() => setSelectedImage("/src/assets/impact-1.png")}
                  />
                </div>
                <div className="lg:w-1/2 bg-white rounded-xl p-6 border-2 border-zonta-gold shadow-md">
                  <h3 className="text-xl font-bold text-zonta-burgundy mb-3">Global Partnerships</h3>
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
                    className="w-full h-64 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300"
                    onClick={() => setSelectedImage("/src/assets/impact-3.png")}
                  />
                </div>
                <div className="lg:w-1/2 bg-white rounded-xl p-6 border-2 border-zonta-gold shadow-md">
                  <h3 className="text-xl font-bold text-zonta-burgundy mb-3">Community Recognition</h3>
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
                    className="w-full h-64 object-cover object-top rounded-xl shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300"
                    onClick={() => setSelectedImage("/src/assets/impact-4.png")}
                  />
                </div>
                <div className="lg:w-1/2 bg-white rounded-xl p-6 border-2 border-zonta-gold shadow-md">
                  <h3 className="text-xl font-bold text-zonta-burgundy mb-3">Healthcare Appreciation</h3>
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
                    className="w-full h-64 object-cover object-[center_25%] rounded-xl shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300"
                    onClick={() => setSelectedImage("/src/assets/impact-13.png")}
                  />
                </div>
                <div className="lg:w-1/2 bg-white rounded-xl p-6 border-2 border-zonta-gold shadow-md">
                  <h3 className="text-xl font-bold text-zonta-burgundy mb-3">Public Safety Support</h3>
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
                    className="w-full h-64 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300"
                    onClick={() => setSelectedImage("/src/assets/impact-15.png")}
                  />
                </div>
                <div className="lg:w-1/2 bg-white rounded-xl p-6 border-2 border-zonta-gold shadow-md">
                  <h3 className="text-xl font-bold text-zonta-burgundy mb-3">Sustainable Community Partnerships</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Through ongoing collaborations with organizations like Habitat for Humanity, our service committee, led by 
                    Chairperson Adele Hunter, has consistently volunteered to support affordable housing initiatives in our community. 
                    These long-term partnerships demonstrate our commitment to sustainable community development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Photo Gallery Section */}
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-12 border-t-4 border-zonta-gold">
          <h2 className="text-3xl font-bold text-zonta-burgundy mb-8 text-center">Moments That Matter</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <img 
              src="/src/assets/impact-6.png" 
              alt="Zonta community event" 
              className="w-full h-56 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedImage("/src/assets/impact-6.png")}
            />
            <img 
              src="/src/assets/impact-9.png" 
              alt="Zonta volunteer work" 
              className="w-full h-56 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedImage("/src/assets/impact-9.png")}
            />
            <img 
              src="/src/assets/impact-11.png" 
              alt="Zonta members collaboration" 
              className="w-full h-56 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedImage("/src/assets/impact-11.png")}
            />
            <img 
              src="/src/assets/impact-12.png" 
              alt="Zonta members collaboration" 
              className="w-full h-56 object-cover object-[center_25%] rounded-xl shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedImage("/src/assets/impact-12.png")}
            />
            <img 
              src="/src/assets/impact-14.png" 
              alt="Zonta community service" 
              className="w-full h-56 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedImage("/src/assets/impact-14.png")}
            />
            <img 
              src="/src/assets/impact-10.png" 
              alt="Zonta community partnership" 
              className="w-full h-56 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedImage("/src/assets/impact-10.png")}
            />
          </div>
        </section>

        {/* Call to Action */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center border-t-4 border-zonta-burgundy">
          <h2 className="text-2xl md:text-3xl font-bold text-zonta-burgundy mb-4">Join Us in Making a Difference</h2>
          <p className="text-gray-700 mb-6 text-lg max-w-2xl mx-auto">
            Your support helps us continue our vital work empowering women and strengthening our community. 
            Together, we can create lasting change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/join"
              className="inline-block bg-zonta-burgundy hover:bg-zonta-burgundy-dark text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Become a Member
            </a>
            <a
              href="/contact"
              className="inline-block bg-white hover:bg-gray-50 text-zonta-burgundy border-2 border-zonta-burgundy px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Support Our Work
            </a>
          </div>
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
    </div>
  );
}