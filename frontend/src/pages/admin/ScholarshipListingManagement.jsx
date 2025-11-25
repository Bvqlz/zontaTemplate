import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../utils/apiService';

const ScholarshipListingManagement = () => {
    const [scholarships, setScholarships] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filters
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchScholarships = useCallback(async () => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter !== 'all') params.status = statusFilter;

            const response = await apiService.get('/api/scholarship-listings', { params });
            if (response.data.success) {
                setScholarships(response.data.data);
            }
        } catch (err) {
            setError('Failed to fetch scholarship listings');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    const fetchStats = useCallback(async () => {
        try {
            const response = await apiService.get('/api/scholarship-listings/admin/stats');
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    }, []);

    useEffect(() => {
        fetchScholarships();
        fetchStats();
    }, [fetchScholarships, fetchStats]);

    const handleDelete = async (scholarshipId, scholarshipTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${scholarshipTitle}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await apiService.delete(`/api/scholarship-listings/admin/${scholarshipId}`);
            setScholarships(scholarships.filter(s => s._id !== scholarshipId));
            fetchStats();
            alert('Scholarship deleted successfully');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to delete scholarship');
            console.error(err);
        }
    };

    const handleStatusToggle = async (scholarship) => {
        const newStatus = scholarship.status === 'active' ? 'draft' : 'active';
        
        try {
            const formData = new FormData();
            formData.append('title', scholarship.title);
            formData.append('description', scholarship.description);
            if (scholarship.shortDescription) formData.append('shortDescription', scholarship.shortDescription);
            formData.append('amount', scholarship.amount);
            formData.append('deadline', scholarship.deadline);
            if (scholarship.eligibility) formData.append('eligibility', scholarship.eligibility);
            if (scholarship.learnMoreUrl) formData.append('learnMoreUrl', scholarship.learnMoreUrl);
            formData.append('status', newStatus);
            formData.append('isFeatured', scholarship.isFeatured);

            const response = await apiService.put(
                `/api/scholarship-listings/admin/${scholarship._id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                setScholarships(scholarships.map(s => 
                    s._id === scholarship._id ? response.data.data : s
                ));
                fetchStats();
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to update scholarship status');
            console.error(err);
        }
    };

    const filteredScholarships = scholarships.filter(scholarship => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            scholarship.title.toLowerCase().includes(query) ||
            scholarship.description.toLowerCase().includes(query) ||
            (scholarship.eligibility && scholarship.eligibility.toLowerCase().includes(query))
        );
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        // Parse date string and extract year, month, day to avoid timezone issues
        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();
        const day = date.getUTCDate();
        
        // Create a local date with the UTC values
        const localDate = new Date(year, month, day);
        return localDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isExpired = (deadline) => {
        return new Date(deadline) < new Date();
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Scholarship Listing Management</h1>
                    <p className="text-gray-600 mt-1">Manage scholarship listings and applications</p>
                </div>
                <Link
                    to="/admin/scholarship-listings/create"
                    className="bg-zonta-burgundy text-white px-6 py-3 rounded-lg font-semibold hover:bg-zonta-burgundy-dark transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Scholarship
                </Link>
            </div>

            {/* Statistics */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Scholarships</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalScholarships}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Scholarships</p>
                                <p className="text-2xl font-bold text-green-600">{stats.activeScholarships}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Expired Scholarships</p>
                                <p className="text-2xl font-bold text-orange-600">{stats.expiredScholarships}</p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Value</p>
                                <p className="text-2xl font-bold text-zonta-gold">{formatCurrency(stats.totalAmount)}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input
                            type="text"
                            placeholder="Search by title, description, or eligibility..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-zonta-burgundy focus:border-zonta-burgundy"
                        />
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-zonta-burgundy focus:border-zonta-burgundy"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                            <option value="expired">Expired</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Scholarship List */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-zonta-burgundy border-t-transparent"></div>
                        <p className="mt-4 text-gray-600">Loading scholarships...</p>
                    </div>
                </div>
            ) : filteredScholarships.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Scholarships Found</h3>
                    <p className="text-gray-600">Get started by creating your first scholarship listing.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scholarship</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredScholarships.map((scholarship) => (
                                <tr key={scholarship._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <img
                                                src={scholarship.image.url}
                                                alt={scholarship.image.alt || scholarship.title}
                                                className="w-16 h-16 object-cover rounded-lg mr-4"
                                            />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{scholarship.title}</div>
                                                <div className="text-sm text-gray-500">{scholarship.slug}</div>
                                                {scholarship.isFeatured && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-zonta-burgundy">{formatCurrency(scholarship.amount)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm ${isExpired(scholarship.deadline) ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                                            {formatDate(scholarship.deadline)}
                                        </div>
                                        {isExpired(scholarship.deadline) && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                                                Expired
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleStatusToggle(scholarship)}
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                scholarship.status === 'active'
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    : scholarship.status === 'draft'
                                                    ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                    : scholarship.status === 'archived'
                                                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                                    : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                                            } transition-colors cursor-pointer`}
                                        >
                                            {scholarship.status.charAt(0).toUpperCase() + scholarship.status.slice(1)}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                to={`/admin/scholarship-listings/edit/${scholarship._id}`}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(scholarship._id, scholarship.title)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ScholarshipListingManagement;
