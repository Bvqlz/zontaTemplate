// src/components/Sponsor.jsx
export default function Sponsor() {
  const sponsors = [
    {
      name: "American Cancer Society",
      url: "https://www.cancer.org/",
      logo: "/src/assets/sponsor1.png"
    },
    {
      name: "Habitat for Humanity",
      url: "https://www.habitat.org/",
      logo: "/src/assets/sponsor2.png"
    },
    {
      name: "Naples Shelter",
      url: "https://naplesshelter.org/front/",
      logo: "/src/assets/sponsor3.png"
    },
    {
      name: "Path 2 Freedom",
      url: "https://path2freedom.org/",
      logo: "/src/assets/sponsor4.png"
    },
    {
      name: "Project Help Naples",
      url: "https://projecthelpnaples.org/",
      logo: "/src/assets/sponsor5.png"
    },
    {
      name: "PACE Center for Girls",
      url: "https://www.pacecenter.org/",
      logo: "/src/assets/sponsor6.png"
    }
  ];

  return (
    <section className="section-padding bg-zonta-burgundy shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Community Partners
          </h2>
          <div className="w-24 h-1 bg-zonta-gold mx-auto mb-6"></div>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Proud to support these organizations making a difference in women's lives
          </p>
        </div>

        {/* Sponsor Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {sponsors.map((sponsor, index) => (
            <a
              key={index}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 p-6 flex items-center justify-center"
              style={{ width: "180px", height: "180px" }}
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="max-w-full max-h-full object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

