import { useState } from "react";
import advocacy1 from "../assets/advocacy-1.jpg";

export default function Advocacy() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-zonta-burgundy mb-4">
            Who We Are
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

          {/* Leadership Section */}
          <section className="bg-white rounded-xl shadow-lg p-8 md:p-12 border-t-4 border-zonta-gold">
            <h2 className="text-3xl font-bold text-zonta-burgundy mb-8 text-center">
              Officers and Board of Directors
            </h2>
            <div className="w-24 h-1 bg-zonta-gold mx-auto mb-8"></div>

            <div className="text-center mb-12">
              <p className="text-lg font-semibold text-zonta-burgundy mb-3">Jane Kolczun | President</p>
              <p className="text-lg font-semibold text-zonta-burgundy mb-3">Adele Hunter | Vice President</p>
              <p className="text-lg font-semibold text-zonta-burgundy mb-3">Adele Hunter | Secretary</p>
              <p className="text-lg font-semibold text-zonta-burgundy mb-3">Norine Carlson Weber | Treasurer</p>
              <p className="text-lg font-semibold text-zonta-burgundy mb-3">Marianne Kearns | Director</p>
              <p className="text-lg font-semibold text-zonta-burgundy mb-3">Susie Mehas | Director</p>
            </div>

            <h3 className="text-2xl font-bold text-zonta-burgundy mb-8 text-center mt-12">
              Committee Chairs
            </h3>
            <div className="w-24 h-1 bg-zonta-gold mx-auto mb-8"></div>

            <div className="text-center">
              <p className="text-lg font-semibold text-zonta-burgundy mb-3">Advocacy | Susan Housel</p>
              <p className="text-lg font-semibold text-zonta-burgundy mb-3">Fellowship | Marianne Kearns</p>
              <p className="text-lg font-semibold text-zonta-burgundy mb-3">Fundraising | Susie Mehas</p>
              <p className="text-lg font-semibold text-zonta-burgundy mb-3">Membership | Pastor Mary Stockton</p>
              <p className="text-lg font-semibold text-zonta-burgundy mb-3">Service | Adele Hunter</p>
              <p className="text-lg font-semibold text-zonta-burgundy mb-3">Meeting Coordinator | Barbara Haman</p>
              <p className="text-lg font-semibold text-zonta-burgundy mb-3">Facebook Administrator | TBD</p>
              <p className="text-lg font-semibold text-zonta-burgundy mb-3">50 Year Club Anniversary Chairperson | Jean Sloan</p>
              <p className="text-lg font-semibold text-zonta-burgundy mb-3">Club Historian | Lori Carpenter</p>
            </div>
          </section>
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