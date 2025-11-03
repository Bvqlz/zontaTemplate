import { useState, useEffect } from 'react';
import { eventAPI } from '../../utils/apiService';
import { Link } from 'react-router-dom';

function EventManagement() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await eventAPI.getAllEvents();
            setEvents(result.data || []);
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
            return;
        }

        try {
            await eventAPI.deleteEvent(id);
            alert('Event deleted successfully!');
            fetchEvents(); // Refresh list
        } catch (err) {
            console.error('Error deleting event:', err);
            alert('Failed to delete event');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="flex items-center gap-3">
                    <svg className="animate-spin h-8 w-8 text-zonta-burgundy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-xl text-gray-700">Loading events...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-zonta-burgundy">Event Management</h1>
                    <p className="text-gray-600 mt-1">Create and manage events for your organization</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchEvents}
                        className="bg-white border-2 border-zonta-burgundy text-zonta-burgundy px-6 py-3 rounded-lg hover:bg-zonta-burgundy hover:text-white transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 group"
                    >
                        <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                    <Link
                        to="/admin/events/create"
                        className="bg-zonta-gold text-white px-6 py-3 rounded-lg hover:bg-yellow-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Event
                    </Link>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-start gap-3">
                    <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            {events.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-16 text-center">
                    <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-lg mb-6">No events found</p>
                    <Link
                        to="/admin/events/create"
                        className="bg-zonta-burgundy text-white px-8 py-3 rounded-lg hover:bg-zonta-burgundy-dark transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Your First Event
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-t-4 border-zonta-burgundy">
                            {event.imageUrl && (
                                <img
                                    src={event.imageUrl}
                                    alt={event.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-xs font-semibold px-3 py-1.5 bg-zonta-burgundy/10 text-zonta-burgundy rounded-full uppercase border border-zonta-burgundy/20">
                                        {event.type}
                                    </span>
                                    {event.ticketPrice && (
                                        <span className="text-sm font-bold text-zonta-gold bg-zonta-gold/10 px-3 py-1.5 rounded-full">
                                            ${event.ticketPrice}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                                
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {event.description}
                                </p>

                                <div className="space-y-2.5 text-sm text-gray-600 mb-6">
                                    <div className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-zonta-burgundy flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{formatDate(event.date)}</span>
                                    </div>
                                    
                                    <div className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-zonta-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{event.location}</span>
                                    </div>

                                    {event.maxAttendees && (
                                        <div className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-zonta-burgundy flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            <span>Max {event.maxAttendees} attendees</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        to={`/admin/events/edit/${event._id}`}
                                        className="flex-1 bg-zonta-gold text-white py-2.5 rounded-lg hover:bg-yellow-500 transition-all duration-300 text-center font-medium flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(event._id, event.title)}
                                        className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-all duration-300 font-medium flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default EventManagement;
