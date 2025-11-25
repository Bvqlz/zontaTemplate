// src/components/Events.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventAPI } from '../../utils/apiService';

export default function Events() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        console.log('Fetching events...');
        const result = await eventAPI.getAllEvents();
        console.log('Events result:', result);
        
        // Filter out past events, sort by date, and get first 3
        const now = new Date();
        const upcoming = (result.data || [])
          .filter(event => new Date(event.date) >= now)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);
        
        console.log('Upcoming events:', upcoming);
        setUpcomingEvents(upcoming);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcomingEvents();
  }, []);

  const formatDate = (dateString) => {
    const options = { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <section id="events" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-zonta-burgundy mb-4">Upcoming Events</h2>
            <div className="w-24 h-1 bg-zonta-gold mx-auto mb-6"></div>
          </div>
          <p className="text-gray-600 text-center">Loading events...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="events" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-zonta-burgundy mb-4">Upcoming Events</h2>
            <div className="w-24 h-1 bg-zonta-gold mx-auto mb-6"></div>
          </div>
          <p className="text-red-600 text-center">Error loading events: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-zonta-burgundy mb-4">Upcoming Events</h2>
          <div className="w-24 h-1 bg-zonta-gold mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join us at our upcoming events and be part of our mission to empower women and girls.
          </p>
        </div>
        
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 text-lg">No upcoming events at this time. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border-t-4 border-zonta-burgundy group"
              >
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-zonta-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-zonta-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-zonta-gold font-semibold text-sm uppercase tracking-wide">
                      {formatDate(event.date)}
                    </p>
                  </div>
                  
                  <h4 className="text-2xl font-bold text-zonta-burgundy mb-4 group-hover:text-zonta-burgundy-dark transition-colors line-clamp-2">
                    {event.title}
                  </h4>
                  
                  {event.description && (
                    <p className="text-gray-600 mb-6 line-clamp-3">{event.description}</p>
                  )}
                  
                  <Link to="/events">
                    <button className="w-full bg-zonta-burgundy text-white px-6 py-3 rounded-lg hover:bg-zonta-burgundy-dark transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:gap-3">
                      <span>Learn More</span>
                      <svg className="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
