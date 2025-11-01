import { useState, useEffect } from 'react';
import { eventAPI } from '../utils/apiService';

function EventsList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState(''); // 'fundraiser', 'meeting', 'social', 'service', 'other'

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const filters = filter ? { type: filter } : {};
            const result = await eventAPI.getAllEvents(filters);
            setEvents(result.data || []);
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('Failed to load events. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const formatDate = (dateString) => {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-xl text-zonta-burgundy">Loading events...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-custom p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom p-6">
            <div className="mb-12">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-zonta-burgundy mb-4">Upcoming Events</h2>
                    <div className="w-24 h-1 bg-zonta-gold mx-auto mb-6"></div>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                        Join us for meaningful events that make a difference in our community
                    </p>
                </div>
                
                {/* Filter buttons */}
                <div className="flex flex-wrap justify-center gap-3">
                    <button
                        onClick={() => setFilter('')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                            !filter 
                                ? 'bg-zonta-burgundy text-white shadow-lg' 
                                : 'bg-white text-zonta-burgundy border-2 border-zonta-burgundy hover:bg-zonta-burgundy hover:text-white'
                        }`}
                    >
                        All Events
                    </button>
                    <button
                        onClick={() => setFilter('fundraiser')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                            filter === 'fundraiser' 
                                ? 'bg-zonta-burgundy text-white shadow-lg' 
                                : 'bg-white text-zonta-burgundy border-2 border-zonta-burgundy hover:bg-zonta-burgundy hover:text-white'
                        }`}
                    >
                        Fundraisers
                    </button>
                    <button
                        onClick={() => setFilter('meeting')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                            filter === 'meeting' 
                                ? 'bg-zonta-burgundy text-white shadow-lg' 
                                : 'bg-white text-zonta-burgundy border-2 border-zonta-burgundy hover:bg-zonta-burgundy hover:text-white'
                        }`}
                    >
                        Meetings
                    </button>
                    <button
                        onClick={() => setFilter('social')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                            filter === 'social' 
                                ? 'bg-zonta-burgundy text-white shadow-lg' 
                                : 'bg-white text-zonta-burgundy border-2 border-zonta-burgundy hover:bg-zonta-burgundy hover:text-white'
                        }`}
                    >
                        Social
                    </button>
                    <button
                        onClick={() => setFilter('service')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                            filter === 'service' 
                                ? 'bg-zonta-burgundy text-white shadow-lg' 
                                : 'bg-white text-zonta-burgundy border-2 border-zonta-burgundy hover:bg-zonta-burgundy hover:text-white'
                        }`}
                    >
                        Service
                    </button>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-xl text-gray-600">No events found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map(event => (
                        <div 
                            key={event._id} 
                            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                        >
                            {event.imageUrl && (
                                <div className="relative h-48 overflow-hidden flex-shrink-0">
                                    <img 
                                        src={event.imageUrl} 
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                    />
                                </div>
                            )}
                            
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold px-3 py-1 bg-zonta-gold text-white rounded-full uppercase tracking-wide">
                                        {event.type}
                                    </span>
                                    {event.ticketPrice && (
                                        <span className="text-sm font-bold text-zonta-burgundy">
                                            ${event.ticketPrice}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-zonta-burgundy mb-2 line-clamp-2 min-h-[3.5rem]">{event.title}</h3>
                                
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                                    {event.description}
                                </p>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 mr-2 text-zonta-burgundy flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{formatDate(event.date)}</span>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 mr-2 text-zonta-burgundy flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{event.location}</span>
                                    </div>

                                    {event.maxAttendees && (
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 mr-2 text-zonta-burgundy flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span>Max {event.maxAttendees} attendees</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default EventsList;
