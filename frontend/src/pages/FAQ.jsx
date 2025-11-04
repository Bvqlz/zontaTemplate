import { useState } from "react";

export default function FAQ() {
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (index) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const faqItems = [
    {
      question: "What is Zonta International?",
      answer: "Zonta International is a global organization of professionals empowering women worldwide through service and advocacy. With over 28,000 members in 61 countries, we work to advance the status of women politically, economically, and professionally."
    },
    {
      question: "Who can join Zonta Club of Naples?",
      answer: "We welcome professionals and community leaders from all fields who are committed to advancing the status of women. Membership is open to individuals who support our mission and are willing to participate in our service and advocacy activities."
    },
    {
      question: "How often does the club meet?",
      answer: "The Zonta Club of Naples typically meets monthly. Our meetings include business discussions, program presentations, and opportunities for networking and collaboration. We also host special events and service projects throughout the year."
    },
    {
      question: "What are the membership dues?",
      answer: "Annual membership dues are $150 for active members, $75 for young professionals (under 35) and retired members, and $25 for student members. Dues support both local club activities and Zonta International programs."
    },
    {
      question: "What kind of service projects does the club undertake?",
      answer: "Our service projects focus on education, health, safety, and economic empowerment for women and girls. Recent projects include scholarship programs, support for domestic violence shelters, educational workshops, and advocacy for women's rights legislation."
    },
    {
      question: "How can I get involved if I'm not ready to become a member?",
      answer: "We welcome volunteers and guests at our events and service projects! You can attend a meeting as a guest, participate in our service activities, or support our fundraising events. Contact our membership chair to learn about upcoming opportunities."
    },
    {
      question: "What is the time commitment for members?",
      answer: "Members are encouraged to attend monthly meetings and participate in at least one committee or service project. The time commitment varies but typically ranges from 5-10 hours per month, depending on your level of involvement."
    },
    {
      question: "Does Zonta offer scholarships?",
      answer: "Yes! Zonta International and our local club offer several scholarship programs for women pursuing education in various fields. These include the Young Women in Public Affairs Award, Jane M. Klausman Women in Business Scholarship, and local scholarships for Naples-area students."
    },
    {
      question: "How does Zonta advocate for women's rights?",
      answer: "We advocate at local, national, and international levels through awareness campaigns, partnerships with policymakers, support for gender equality legislation, and participation in UN initiatives. Our advocacy focuses on ending gender-based violence, promoting education, and ensuring economic equality."
    },
    {
      question: "Can I make a donation without becoming a member?",
      answer: "Absolutely! We welcome donations from individuals and organizations who support our mission. Donations help fund our service projects, scholarship programs, and advocacy efforts. Visit our donation page to contribute."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-zonta-burgundy mb-4">
            Frequently Asked Questions
          </h1>
          <div className="w-24 h-1 bg-zonta-gold mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Find answers to common questions about Zonta Club of Naples and our work in the community.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full text-left p-6 hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center"
                >
                  <span className="text-lg font-semibold text-zonta-burgundy pr-4">{item.question}</span>
                  <svg
                    className={`w-6 h-6 text-zonta-gold flex-shrink-0 transform transition-transform duration-200 ${
                      openItems.includes(index) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openItems.includes(index) && (
                  <div className="p-6 bg-gray-50 border-t-2 border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Additional Help Section */}
          <div className="mt-12 p-8 bg-white border-2 border-zonta-gold rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-zonta-burgundy mb-3">Still have questions?</h3>
            <p className="text-gray-700 mb-6">
              We're here to help! Contact our membership team for more information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-block bg-zonta-burgundy hover:bg-zonta-burgundy-dark text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-center"
              >
                Contact Us
              </a>
              <a
                href="/join"
                className="inline-block bg-white hover:bg-gray-50 text-zonta-burgundy border-2 border-zonta-burgundy px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-center"
              >
                Join Our Club
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}