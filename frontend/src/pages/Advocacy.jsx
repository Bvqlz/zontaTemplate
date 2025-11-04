import { useState } from "react";
import advocacy1 from "../assets/advocacy-1.jpg";
import advocacy2 from "../assets/advocacy-2.jpg";

export default function Advocacy() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-zonta-burgundy mb-4">
            Advocacy & Action
          </h1>
          <div className="w-24 h-1 bg-zonta-gold mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Empowering women through advocacy, education, and legislative action
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          {/* Hero Image */}
          <div className="mb-12">
            <img 
              src={advocacy1} 
              alt="Zonta International advocacy and service" 
              className="w-full h-[400px] object-cover rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
              onClick={() => setSelectedImage(advocacy1)}
            />
          </div>

          {/* Background Section */}
          <section className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8 border-t-4 border-zonta-burgundy">
            <h2 className="text-3xl font-bold text-zonta-burgundy mb-6">Our Legacy of Service</h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-4">
              In 1919, a group of forward-thinking executive women came together in Buffalo, New York, to use their 
              combined expertise in service to their community. Not satisfied with the predominantly social nature of 
              many women's organizations at the time, the women who founded Zonta envisioned a new kind of service 
              organization – one that would promote professionalism among its executive members while serving the needs 
              of girls and young women in the community.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg mb-4">
              More than one hundred years later, the legacy of Zonta's early members can be seen and felt through more 
              than 1,100 Zonta clubs in 64 countries across the globe. While the world has changed dramatically over 
              the last century, more than 25,000 Zontians today remain committed to the professionalism, fellowship 
              and service that led Zonta's visionary founders to come together.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Zonta's vision cannot be achieved by monetary donations alone. At the local, national and regional levels, 
              Zonta clubs and individual Zontians are advocating for laws and policies that ensure gender equality and 
              help every woman and girl realize her full potential.
            </p>
          </section>

          {/* Global Impact Section */}
          <section className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8 border-t-4 border-zonta-gold">
            <h2 className="text-3xl font-bold text-zonta-burgundy mb-6">Global Impact</h2>
            
            {/* Stats Grid with Image */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">By The Numbers</h3>
                <div className="space-y-4">
                  <div className="bg-zonta-burgundy bg-opacity-10 p-6 rounded-lg border-l-4 border-zonta-burgundy">
                    <div className="text-3xl font-bold text-zonta-burgundy mb-2">$54.8M+</div>
                    <p className="text-gray-700">Provided through the Zonta Foundation for Women</p>
                  </div>
                  <div className="bg-zonta-burgundy bg-opacity-10 p-6 rounded-lg border-l-4 border-zonta-burgundy">
                    <div className="text-3xl font-bold text-zonta-burgundy mb-2">$39.15M+</div>
                    <p className="text-gray-700">For international service projects since 1923</p>
                  </div>
                  <div className="bg-zonta-burgundy bg-opacity-10 p-6 rounded-lg border-l-4 border-zonta-burgundy">
                    <div className="text-3xl font-bold text-zonta-burgundy mb-2">71</div>
                    <p className="text-gray-700">Countries benefiting from Zonta projects</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <img 
                  src={advocacy2} 
                  alt="Zonta clubs around the world" 
                  className="w-full h-full object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300"
                  onClick={() => setSelectedImage(advocacy2)}
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Education Programs</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Zonta International's education programs enable women to continue making great strides and overcome 
                gender barriers in the pursuit of education, careers and leadership roles. Zonta has awarded more than 
                3,800 fellowships, scholarships and awards through donations made to the Zonta Foundation for Women.
              </p>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-zonta-gold">
                  <h4 className="font-bold text-lg text-zonta-burgundy mb-2">Amelia Earhart Fellowship</h4>
                  <p className="text-gray-700">
                    Supporting women pursuing Ph.D./doctoral degrees in aerospace engineering and space sciences. 
                    More than 1,734 fellowships totaling over $11.9 million awarded to 1,335 women from 79 countries.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-zonta-gold">
                  <h4 className="font-bold text-lg text-zonta-burgundy mb-2">Zonta Women in Business Leadership Award</h4>
                  <p className="text-gray-700">
                    Recognizing outstanding achievements of women driving innovation and impact in the business world. 
                    Established in 2024, 10 international awards of $10,000 each awarded annually.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-zonta-gold">
                  <h4 className="font-bold text-lg text-zonta-burgundy mb-2">Young Women in Leadership Award</h4>
                  <p className="text-gray-700">
                    Honoring young women who demonstrate commitment to leadership in public policy, government and 
                    volunteer organizations. 1,128 awards totaling over $1.6 million given to 956 young women from 61 countries.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-zonta-gold">
                  <h4 className="font-bold text-lg text-zonta-burgundy mb-2">Zonta Women in STEM Award</h4>
                  <p className="text-gray-700">
                    Celebrating remarkable accomplishments of women in science, technology, engineering, and mathematics. 
                    16 international awards of $10,000 each awarded biannually.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Current International Service Projects (2024-2026)</h3>
              <div className="bg-white border-2 border-zonta-burgundy rounded-lg p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-3 h-3 bg-zonta-burgundy rounded-full mt-1.5"></div>
                  <p className="text-gray-700">
                    <span className="font-bold text-zonta-burgundy">Climate Empower:</span> Community Empowerment and innovation for 
                    Gender-Transformative Climate Action with UNFPA
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-3 h-3 bg-zonta-burgundy rounded-full mt-1.5"></div>
                  <p className="text-gray-700">
                    <span className="font-bold text-zonta-burgundy">Laaha:</span> A Virtual Safe Space for Women and Girls with UNICEF USA
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-3 h-3 bg-zonta-burgundy rounded-full mt-1.5"></div>
                  <p className="text-gray-700">
                    <span className="font-bold text-zonta-burgundy">Global Programme to End Child Marriage Phase III</span> with UNFPA and UNICEF USA
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center border-t-4 border-zonta-burgundy">
            <h2 className="text-2xl md:text-3xl font-bold text-zonta-burgundy mb-4">Join Our Mission</h2>
            <p className="text-gray-700 mb-6 text-lg max-w-2xl mx-auto">
              Be part of a global community working to advance the status of women worldwide through service and advocacy.
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
                Learn More
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
    </div>
  );
}