import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { scholarshipAPI, eventAPI, memberAPI } from '../../utils/apiService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function AdminDashboard() {
    const [stats, setStats] = useState({
        scholarships: { total: 0, pending: 0, underReview: 0 },
        events: { total: 0, upcoming: 0 },
        members: { total: 0, pending: 0 },
        donations: { total: 0, totalAmount: 0, completed: 0 },
        orders: { total: 0, totalRevenue: 0, completed: 0 }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                const [scholarshipsRes, eventsRes, membersRes, donationsRes, ordersRes] = await Promise.all([
                    scholarshipAPI.getAllScholarships(),
                    eventAPI.getAllEvents(),
                    memberAPI.getAllMembers(),
                    fetch(`${API_BASE_URL}/api/donations/stats`, { 
                        method: 'GET',
                        headers: headers 
                    }).then(res => {
                        if (!res.ok) {
                            console.error('Donations stats error:', res.status);
                            return { totalCount: 0, totalAmount: 0, statusBreakdown: { completed: 0 } };
                        }
                        return res.json();
                    }),
                    fetch(`${API_BASE_URL}/api/products/admin/orders/stats`, { 
                        method: 'GET',
                        headers: headers 
                    }).then(res => {
                        if (!res.ok) {
                            console.error('Orders stats error:', res.status);
                            return { totalCount: 0, totalRevenue: 0, statusBreakdown: { completed: 0 } };
                        }
                        return res.json();
                    })
                ]);

                const scholarships = scholarshipsRes.data;
                const events = eventsRes.data;
                const members = membersRes.data;

                console.log('Donations Response:', donationsRes);
                console.log('Orders Response:', ordersRes);

                const now = new Date();
                
                setStats({
                    scholarships: {
                        total: scholarships.length,
                        pending: scholarships.filter(s => s.status === 'pending').length,
                        underReview: scholarships.filter(s => s.status === 'under_review').length
                    },
                    events: {
                        total: events.length,
                        upcoming: events.filter(e => new Date(e.date) >= now).length
                    },
                    members: {
                        total: members.length,
                        pending: members.filter(m => m.status === 'pending').length
                    },
                    donations: {
                        total: donationsRes.totalCount || 0,
                        totalAmount: donationsRes.totalAmount || 0,
                        completed: donationsRes.statusBreakdown?.completed || 0
                    },
                    orders: {
                        total: ordersRes.totalCount || 0,
                        totalRevenue: ordersRes.totalRevenue || 0,
                        completed: ordersRes.statusBreakdown?.completed || 0
                    }
                });
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-xl text-zonta-burgundy">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-zonta-burgundy mb-2">Dashboard Overview</h1>
                <p className="text-gray-600">Monitor and manage your Zonta Club activities</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Scholarships Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-zonta-burgundy hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-zonta-burgundy">Scholarships</h2>
                        <div className="w-12 h-12 bg-zonta-burgundy/10 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-zonta-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Applications</span>
                            <span className="text-xl font-bold text-zonta-burgundy">{stats.scholarships.total}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t">
                            <span className="text-gray-600">Pending Review</span>
                            <span className="text-xl font-bold text-zonta-burgundy">{stats.scholarships.pending}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t">
                            <span className="text-gray-600">Under Review</span>
                            <span className="text-xl font-bold text-zonta-burgundy">{stats.scholarships.underReview}</span>
                        </div>
                    </div>
                    <Link
                        to="/admin/scholarships"
                        className="mt-6 block text-center bg-zonta-burgundy text-white py-3 rounded-lg font-semibold hover:bg-zonta-burgundy-dark transition-colors duration-300 shadow-md hover:shadow-lg"
                    >
                        Manage Scholarships
                    </Link>
                </div>

                {/* Events Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-zonta-gold hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-zonta-burgundy">Events</h2>
                        <div className="w-12 h-12 bg-zonta-gold/20 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-zonta-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Events</span>
                            <span className="text-xl font-bold text-zonta-burgundy">{stats.events.total}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t">
                            <span className="text-gray-600">Upcoming</span>
                            <span className="text-xl font-bold text-zonta-burgundy">{stats.events.upcoming}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t">
                            <span className="text-gray-600">Past Events</span>
                            <span className="text-xl font-bold text-zonta-burgundy">{stats.events.total - stats.events.upcoming}</span>
                        </div>
                    </div>
                    <Link
                        to="/admin/events"
                        className="mt-6 block text-center bg-zonta-gold text-zonta-burgundy py-3 rounded-lg font-semibold hover:bg-zonta-gold-dark transition-colors duration-300 shadow-md hover:shadow-lg"
                    >
                        Manage Events
                    </Link>
                </div>

                {/* Members Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-zonta-burgundy hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-zonta-burgundy">Members</h2>
                        <div className="w-12 h-12 bg-zonta-burgundy/10 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-zonta-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Members</span>
                            <span className="text-xl font-bold text-zonta-burgundy">{stats.members.total}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t">
                            <span className="text-gray-600">Pending</span>
                            <span className="text-xl font-bold text-zonta-burgundy">{stats.members.pending}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t">
                            <span className="text-gray-600">Active</span>
                            <span className="text-xl font-bold text-zonta-burgundy">{stats.members.total - stats.members.pending}</span>
                        </div>
                    </div>
                    <Link
                        to="/admin/members"
                        className="mt-6 block text-center bg-zonta-burgundy text-white py-3 rounded-lg font-semibold hover:bg-zonta-burgundy-dark transition-colors duration-300 shadow-md hover:shadow-lg"
                    >
                        Manage Members
                    </Link>
                </div>

                {/* Donations Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-zonta-gold hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-zonta-burgundy">Donations</h2>
                        <div className="w-12 h-12 bg-zonta-gold/20 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-zonta-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Donations</span>
                            <span className="text-xl font-bold text-zonta-burgundy">{stats.donations.total}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t">
                            <span className="text-gray-600">Total Amount</span>
                            <span className="text-xl font-bold text-zonta-burgundy">${stats.donations.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t">
                            <span className="text-gray-600">Completed</span>
                            <span className="text-xl font-bold text-zonta-burgundy">{stats.donations.completed}</span>
                        </div>
                    </div>
                    <Link
                        to="/admin/donations"
                        className="mt-6 block text-center bg-zonta-gold text-zonta-burgundy py-3 rounded-lg font-semibold hover:bg-zonta-gold-dark transition-colors duration-300 shadow-md hover:shadow-lg"
                    >
                        Manage Donations
                    </Link>
                </div>

                {/* Orders Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-zonta-burgundy hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-zonta-burgundy">Shop Orders</h2>
                        <div className="w-12 h-12 bg-zonta-burgundy/10 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-zonta-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Orders</span>
                            <span className="text-xl font-bold text-zonta-burgundy">{stats.orders.total}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t">
                            <span className="text-gray-600">Total Revenue</span>
                            <span className="text-xl font-bold text-zonta-burgundy">${stats.orders.totalRevenue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t">
                            <span className="text-gray-600">Completed</span>
                            <span className="text-xl font-bold text-zonta-burgundy">{stats.orders.completed}</span>
                        </div>
                    </div>
                    <Link
                        to="/admin/orders"
                        className="mt-6 block text-center bg-zonta-burgundy text-white py-3 rounded-lg font-semibold hover:bg-zonta-burgundy-dark transition-colors duration-300 shadow-md hover:shadow-lg"
                    >
                        Manage Orders
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-zonta-burgundy mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        to="/admin/scholarships"
                        className="border-2 border-zonta-burgundy/20 rounded-lg p-6 hover:bg-zonta-burgundy/5 hover:border-zonta-burgundy transition-all duration-300 text-center group"
                    >
                        <div className="w-12 h-12 mx-auto mb-3 bg-zonta-burgundy/10 rounded-full flex items-center justify-center group-hover:bg-zonta-burgundy group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="font-medium">Review Applications</div>
                    </Link>
                    <Link
                        to="/admin/events"
                        className="border-2 border-zonta-gold/20 rounded-lg p-6 hover:bg-zonta-gold/5 hover:border-zonta-gold transition-all duration-300 text-center group"
                    >
                        <div className="w-12 h-12 mx-auto mb-3 bg-zonta-gold/10 rounded-full flex items-center justify-center group-hover:bg-zonta-gold group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="font-medium">Manage Events</div>
                    </Link>
                    <Link
                        to="/admin/events/create"
                        className="border-2 border-zonta-burgundy/20 rounded-lg p-6 hover:bg-zonta-burgundy/5 hover:border-zonta-burgundy transition-all duration-300 text-center group"
                    >
                        <div className="w-12 h-12 mx-auto mb-3 bg-zonta-burgundy/10 rounded-full flex items-center justify-center group-hover:bg-zonta-burgundy group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div className="font-medium">Create Event</div>
                    </Link>
                    <Link
                        to="/admin/members"
                        className="border-2 border-zonta-gold/20 rounded-lg p-6 hover:bg-zonta-gold/5 hover:border-zonta-gold transition-all duration-300 text-center group"
                    >
                        <div className="w-12 h-12 mx-auto mb-3 bg-zonta-gold/10 rounded-full flex items-center justify-center group-hover:bg-zonta-gold group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div className="font-medium">View Members</div>
                    </Link>
                    <Link
                        to="/admin/donations"
                        className="border-2 border-zonta-burgundy/20 rounded-lg p-6 hover:bg-zonta-burgundy/5 hover:border-zonta-burgundy transition-all duration-300 text-center group"
                    >
                        <div className="w-12 h-12 mx-auto mb-3 bg-zonta-burgundy/10 rounded-full flex items-center justify-center group-hover:bg-zonta-burgundy group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="font-medium">View Donations</div>
                    </Link>
                    <Link
                        to="/admin/orders"
                        className="border-2 border-zonta-gold/20 rounded-lg p-6 hover:bg-zonta-gold/5 hover:border-zonta-gold transition-all duration-300 text-center group"
                    >
                        <div className="w-12 h-12 mx-auto mb-3 bg-zonta-gold/10 rounded-full flex items-center justify-center group-hover:bg-zonta-gold group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <div className="font-medium">View Orders</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
