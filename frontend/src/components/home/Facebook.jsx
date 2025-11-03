// src/components/Facebook.jsx
import { useState } from "react";

export default function Facebook() {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    { src: "/src/assets/zonta1.png", alt: "Zonta Event 1" },
    { src: "/src/assets/zonta2.png", alt: "Zonta Event 2" },
    { src: "/src/assets/zonta3.png", alt: "Zonta Event 3" },
  ];

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-custom">
        {/* Header section */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-4 mb-6">
            <h3 className="text-4xl md:text-5xl font-bold text-zonta-burgundy">
              Follow Us on Social Media
            </h3>
          </div>
          <div className="w-24 h-1 bg-zonta-gold mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay connected with our latest events, initiatives, and community impact
          </p>
        </div>

        {/* Gallery Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <div
              key={image.src}
              className="card overflow-hidden cursor-pointer group"
              onClick={() => setSelectedImage(image.src)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <a
            href="https://www.facebook.com/ZontaNaples/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-zonta-burgundy hover:bg-zonta-burgundy-dark text-white px-8 py-4 rounded-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Visit Our Facebook Page
          </a>
        </div>

        {/* Fullscreen Overlay */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-zonta-gold transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Fullscreen View"
              className="max-h-[90%] max-w-[90%] rounded-lg shadow-2xl"
            />
          </div>
        )}
      </div>
    </section>
  );
}
