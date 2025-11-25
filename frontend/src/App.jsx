// src/App.jsx
import Hero from "./components/home/Hero.jsx";
import WhatWeDo from "./components/home/WhatWeDo.jsx";
import ImpactStats from "./components/home/ImpactStats.jsx";
import Zonta100Years from "./components/home/Zonta100years.jsx";
import Events from "./components/home/Events.jsx";
import Mission from "./components/home/Mission.jsx";
import Facebook from "./components/home/Facebook.jsx";
import GoogleMaps from "./components/home/GoogleMaps.jsx";
import Sponsors from "./components/home/Sponsors.jsx";

export default function App() {
  return (
    <div className="font-sans bg-white text-gray-900">
      <Hero />
      <WhatWeDo />
      <Mission />
      <ImpactStats />
      <Zonta100Years />
      <Events />
      <Facebook />
      <GoogleMaps />
      <Sponsors />
    </div>
  );
}
