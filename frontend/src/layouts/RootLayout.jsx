import Navbar from "../components/home/Navbar.jsx";
import Footer from "../components/home/Footer.jsx";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="font-sans bg-white text-gray-900">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
