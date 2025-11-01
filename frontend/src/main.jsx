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


// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ScholarshipManagement from "./pages/admin/ScholarshipManagement.jsx";
import ScholarshipDetail from "./pages/admin/ScholarshipDetail.jsx";
import EventManagement from "./pages/admin/EventManagement.jsx";
import EventCreate from "./pages/admin/EventCreate.jsx";
import EventEdit from "./pages/admin/EventEdit.jsx";
import MemberManagement from "./pages/admin/MemberManagement.jsx";
import MemberDetail from "./pages/admin/MemberDetail.jsx";

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
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

