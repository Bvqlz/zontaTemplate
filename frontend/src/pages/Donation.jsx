// src/pages/Donation.jsx
import { useState } from "react";
import Navbar from "../components/Navbar.jsx";

export default function Donation() {
  const [frequency, setFrequency] = useState("one-time"); // "one-time" | "monthly"
  const [amount, setAmount] = useState(50);               // preset or custom

  const presets = [25, 50, 100, 250];

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: integrate with your payment processor (Stripe/PayPal/etc.)
    // For now, this just redirects to a placeholder:
    const url = `https://example.org/donate?freq=${frequency}&amount=${amount}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-28">
        {/* Same gradient background as Contact.jsx */}
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-600/80 via-yellow-700/70 to-red-900/90" />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <header className="text-center text-white mb-10">
            <h1 className="text-4xl font-bold mb-3">Support Zonta Club of Naples</h1>
            <p className="text-lg text-white/90">
              Your gift empowers women through service, advocacy, education, and community programs.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="bg-white/95 backdrop-blur rounded-2xl p-8 shadow-xl grid grid-cols-1 gap-6"
          >
            {/* Frequency toggle */}
            <div className="flex justify-center gap-3">
              {[
                { key: "one-time", label: "One-time" },
                { key: "monthly", label: "Monthly" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setFrequency(opt.key)}
                  className={`px-5 py-2 rounded-full border transition
                    ${frequency === opt.key
                      ? "bg-yellow-600 text-white border-yellow-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-yellow-600"}`}
                  aria-pressed={frequency === opt.key}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Preset amounts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {presets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`w-full py-3 rounded-xl border font-semibold transition
                    ${amount === val
                      ? "bg-yellow-600 text-white border-yellow-600"
                      : "bg-white text-gray-800 border-gray-300 hover:border-yellow-600"}`}
                >
                  ${val}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="md:col-span-1 text-sm font-medium text-gray-700">
                Custom amount (USD)
              </label>
              <div className="md:col-span-2">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value || 0))}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter another amount"
                  required
                />
              </div>
            </div>

            {/* Optional donor info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (optional)</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-600 px-8 py-3 font-semibold text-white shadow hover:bg-yellow-700 transition"
              >
                Donate ${amount} {frequency === "monthly" ? "Monthly" : ""}
              </button>
            </div>

            {/* Fine print */}
            <p className="text-center text-sm text-gray-600">
              Secure processing. Donations may be tax-deductible; please consult your tax advisor.
            </p>
          </form>

          {/* Logo underneath */}
          <img
            src="/src/assets/zonta-full-logo.png"
            alt="Zonta Club of Naples"
            className="mx-auto mt-10 w-28 h-auto opacity-95"
          />
        </div>
      </main>
    </>
  );
}
