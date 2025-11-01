import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { memberAPI } from '../../utils/apiService';

function MemberManagement() {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, active, inactive

    useEffect(() => {
        fetchMembers();
    }, []);

    useEffect(() => {
        filterMembers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, members]);

    const fetchMembers = async () => {
        try {
            const response = await memberAPI.getAllMembers();
            setMembers(response.data);
        } catch (err) {
            console.error('Error fetching members:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterMembers = () => {
        if (filter === 'all') {
            setFilteredMembers(members);
        } else {
            setFilteredMembers(members.filter(m => m.status === filter));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this member?')) {
            try {
                await memberAPI.deleteMember(id);
                alert('Member deleted successfully');
                fetchMembers();
            } catch (err) {
                console.error('Error deleting member:', err);
                alert('Failed to delete member');
            }
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
            approved: 'bg-green-50 text-green-700 border border-green-200',
            rejected: 'bg-red-50 text-red-700 border border-red-200'
        };
        return badges[status] || badges.pending;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-3">
                    <svg className="animate-spin h-8 w-8 text-zonta-burgundy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-xl text-gray-700">Loading members...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-zonta-burgundy">Member Management</h1>
                    <p className="text-gray-600 mt-1">Review and manage membership applications</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                        filter === 'all' 
                            ? 'bg-zonta-burgundy text-white shadow-lg' 
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-zonta-burgundy/30'
                    }`}
                >
                    All ({members.length})
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                        filter === 'pending' 
                            ? 'bg-zonta-gold text-white shadow-lg' 
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-zonta-gold/30'
                    }`}
                >
                    Pending ({members.filter(m => m.status === 'pending').length})
                </button>
                <button
                    onClick={() => setFilter('approved')}
                    className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                        filter === 'approved' 
                            ? 'bg-green-600 text-white shadow-lg' 
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-200'
                    }`}
                >
                    Approved ({members.filter(m => m.status === 'approved').length})
                </button>
                <button
                    onClick={() => setFilter('rejected')}
                    className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                        filter === 'rejected' 
                            ? 'bg-red-600 text-white shadow-lg' 
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-200'
                    }`}
                >
                    Rejected ({members.filter(m => m.status === 'rejected').length})
                </button>
            </div>

            {/* Members Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-zonta-burgundy to-zonta-burgundy-dark">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                Phone
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                Join Date
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredMembers.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <p className="text-gray-500">No members found</p>
                                </td>
                            </tr>
                        ) : (
                            filteredMembers.map((member) => (
                                <tr key={member._id} className="hover:bg-zonta-burgundy/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-zonta-burgundy/10 flex items-center justify-center">
                                                <span className="text-zonta-burgundy font-semibold">
                                                    {member.firstName?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {member.firstName} {member.lastName}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">{member.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">{member.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(member.status)}`}>
                                            {member.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {new Date(member.dateJoined || member.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                        <Link
                                            to={`/admin/members/${member._id}`}
                                            className="inline-flex items-center gap-1.5 text-zonta-burgundy hover:text-zonta-burgundy-dark transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(member._id)}
                                            className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-800 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MemberManagement;
