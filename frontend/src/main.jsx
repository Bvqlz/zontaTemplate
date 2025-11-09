import "@fontsource/playfair-display";
import "@fontsource/montserrat";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import RootLayout from "./layouts/RootLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Public Pages
import App from "./App.jsx";
import Contact from "./pages/Contact.jsx";
import Join from "./pages/Join.jsx";
import EventsPage from "./pages/Events.jsx";
import Scholarship from "./pages/Scholarship.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import FAQ from "./pages/FAQ.jsx";
import Impacts from "./pages/Impacts.jsx";
import Advocacy from "./pages/Advocacy.jsx";
import Donate from "./pages/Donate.jsx";
import DonateSuccess from "./pages/DonateSuccess.jsx";
import Shop from "./pages/Shop.jsx";
import ProductCheckout from "./pages/ProductCheckout.jsx";
import ShopSuccess from "./pages/ShopSuccess.jsx";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ScholarshipManagement from "./pages/admin/ScholarshipManagement.jsx";
import ScholarshipDetail from "./pages/admin/ScholarshipDetail.jsx";
import EventManagement from "./pages/admin/EventManagement.jsx";
import EventCreate from "./pages/admin/EventCreate.jsx";
import EventEdit from "./pages/admin/EventEdit.jsx";
import MemberManagement from "./pages/admin/MemberManagement.jsx";
import MemberDetail from "./pages/admin/MemberDetail.jsx";
import DonationManagement from "./pages/admin/DonationManagement.jsx";
import ProductManagement from "./pages/admin/ProductManagement.jsx";
import ProductForm from "./pages/admin/ProductForm.jsx";
import OrderManagement from "./pages/admin/OrderManagement.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<App />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/join" element={<Join />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/scholarship" element={<Scholarship />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/impacts" element={<Impacts />} />
          <Route path="/advocacy" element={<Advocacy />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/donate/success" element={<DonateSuccess />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/checkout/:id" element={<ProductCheckout />} />
          <Route path="/shop/success" element={<ShopSuccess />} />
        </Route>

        {/* Hidden Admin Login - no navbar/footer */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin Routes - Protected */}
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/scholarships" element={<ScholarshipManagement />} />
          <Route path="/admin/scholarships/:id" element={<ScholarshipDetail />} />
          <Route path="/admin/events" element={<EventManagement />} />
          <Route path="/admin/events/create" element={<EventCreate />} />
          <Route path="/admin/events/edit/:id" element={<EventEdit />} />
          <Route path="/admin/members" element={<MemberManagement />} />
          <Route path="/admin/members/:id" element={<MemberDetail />} />
          <Route path="/admin/donations" element={<DonationManagement />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/products/create" element={<ProductForm />} />
          <Route path="/admin/products/edit/:id" element={<ProductForm />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
