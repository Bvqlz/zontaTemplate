import { useState, useEffect } from 'react';
import { scholarshipAPI } from '../../utils/apiService';
import { Link } from 'react-router-dom';

function ScholarshipManagement() {
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchScholarships();
    }, [filter]);

    const fetchScholarships = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await scholarshipAPI.getAllScholarships(filter);
            setScholarships(result.data || []);
        } catch (err) {
            console.error('Error fetching scholarships:', err);
            setError('Failed to load scholarships');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
            under_review: 'bg-zonta-burgundy/10 text-zonta-burgundy border border-zonta-burgundy/20',
            approved: 'bg-green-50 text-green-700 border border-green-200',
            rejected: 'bg-red-50 text-red-700 border border-red-200'
        };
        return styles[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
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
                    <span className="text-xl text-gray-700">Loading scholarships...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-zonta-burgundy">Scholarship Applications</h1>
                    <p className="text-gray-600 mt-1">Review and manage scholarship applications</p>
                </div>
                <button
                    onClick={fetchScholarships}
                    className="bg-zonta-burgundy text-white px-6 py-3 rounded-lg hover:bg-zonta-burgundy-dark transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 group"
                >
                    <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-start gap-3">
                    <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
                <button
                    onClick={() => setFilter('')}
                    className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                        !filter 
                            ? 'bg-zonta-burgundy text-white shadow-lg' 
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-zonta-burgundy/30'
                    }`}
                >
                    All ({scholarships.length})
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                        filter === 'pending' 
                            ? 'bg-zonta-gold text-white shadow-lg' 
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-zonta-gold/30'
                    }`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setFilter('under_review')}
                    className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                        filter === 'under_review' 
                            ? 'bg-zonta-burgundy text-white shadow-lg' 
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-zonta-burgundy/30'
                    }`}
                >
                    Under Review
                </button>
                <button
                    onClick={() => setFilter('approved')}
                    className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                        filter === 'approved' 
                            ? 'bg-green-600 text-white shadow-lg' 
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-200'
                    }`}
                >
                    Approved
                </button>
                <button
                    onClick={() => setFilter('rejected')}
                    className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                        filter === 'rejected' 
                            ? 'bg-red-600 text-white shadow-lg' 
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-200'
                    }`}
                >
                    Rejected
                </button>
            </div>

            {scholarships.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-16 text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 text-lg">No scholarship applications found</p>
                    {filter && (
                        <button 
                            onClick={() => setFilter('')}
                            className="mt-4 text-zonta-burgundy hover:text-zonta-burgundy-dark font-medium"
                        >
                            View all applications
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-zonta-burgundy to-zonta-burgundy-dark">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                    Applicant
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                    Documents
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                    Submitted
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {scholarships.map((scholarship) => (
                                <tr key={scholarship._id} className="hover:bg-zonta-burgundy/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-zonta-burgundy/10 flex items-center justify-center">
                                                <span className="text-zonta-burgundy font-semibold">
                                                    {(scholarship.fullName || scholarship.firstName || 'U').charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="font-medium text-gray-900">
                                                {scholarship.fullName || `${scholarship.firstName} ${scholarship.lastName}`}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {scholarship.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(scholarship.status)}`}>
                                            {scholarship.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-zonta-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            {scholarship.documentCount || scholarship.documents?.length || 0} files
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {formatDate(scholarship.submittedAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link
                                            to={`/admin/scholarships/${scholarship._id}`}
                                            className="inline-flex items-center gap-2 text-zonta-burgundy hover:text-zonta-burgundy-dark transition-colors group"
                                        >
                                            <span>View Details</span>
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ScholarshipManagement;
