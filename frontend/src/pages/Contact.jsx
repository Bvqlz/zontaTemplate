// src/pages/Contact.jsx
import ContactForm from "../components/ContactForm.jsx";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-zonta-burgundy mb-4">
            Contact Zonta Club of Naples
          </h1>
          <div className="w-24 h-1 bg-zonta-gold mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-4">
            Have questions or want to get involved? We'd love to hear from you.
          </p>
          <p className="text-lg text-gray-600">
            Email us at{" "}
            <a href="mailto:info@zonta-naples.org" className="text-zonta-burgundy font-semibold hover:text-zonta-gold transition-colors">
              info@zonta-naples.org
            </a>
          </p>
        </div>
        
        {/* Contact Form */}
        <ContactForm />
      </div>
    </div>
  );
}
