import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { memberAPI } from '../../utils/apiService';

function MemberDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [status, setStatus] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        fetchMember();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchMember = async () => {
        try {
            const response = await memberAPI.getMember(id);
            setMember(response.data);
            setStatus(response.data.status);
            setNotes(response.data.notes || '');
        } catch (err) {
            console.error('Error fetching member:', err);
            alert('Failed to load member details');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            await memberAPI.updateMember(id, {
                status: status,
                notes: notes
            });
            alert('Member updated successfully!');
            fetchMember();
        } catch (err) {
            console.error('Error updating member:', err);
            alert('Failed to update member');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-3">
                    <svg className="animate-spin h-8 w-8 text-zonta-burgundy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-xl text-gray-700">Loading member details...</span>
                </div>
            </div>
        );
    }

    if (!member) {
        return (
            <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-xl text-gray-600 mb-4">Member not found</p>
                <button
                    onClick={() => navigate('/admin/members')}
                    className="inline-flex items-center gap-2 text-zonta-burgundy hover:text-zonta-burgundy-dark transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Members
                </button>
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={() => navigate('/admin/members')}
                className="mb-6 inline-flex items-center gap-2 text-zonta-burgundy hover:text-zonta-burgundy-dark transition-colors group"
            >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Members
            </button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zonta-burgundy mb-2">Member Details</h1>
                <p className="text-gray-600">Review and manage member information</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Member Information */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-zonta-burgundy">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-16 h-16 bg-zonta-burgundy/10 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-zonta-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-zonta-burgundy">Personal Information</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-zonta-gold flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <div className="flex-1">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
                                <p className="text-lg font-medium text-gray-800">{member.firstName} {member.lastName}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 pt-3 border-t">
                            <svg className="w-5 h-5 text-zonta-gold flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <div className="flex-1">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                                <p className="text-gray-800">{member.email}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 pt-3 border-t">
                            <svg className="w-5 h-5 text-zonta-gold flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <div className="flex-1">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Phone</label>
                                <p className="text-gray-800">{member.phone}</p>
                            </div>
                        </div>
                        {member.address && (
                            <div className="flex items-start gap-3 pt-3 border-t">
                                <svg className="w-5 h-5 text-zonta-gold flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div className="flex-1">
                                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Address</label>
                                    <p className="text-gray-800">{member.address}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-start gap-3 pt-3 border-t">
                            <svg className="w-5 h-5 text-zonta-gold flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div className="flex-1">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Date Joined</label>
                                <p className="text-gray-800">{new Date(member.dateJoined || member.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 pt-3 border-t">
                            <svg className="w-5 h-5 text-zonta-gold flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex-1">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Current Status</label>
                                <p className="capitalize font-bold text-zonta-burgundy">{member.status}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Update Form */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-zonta-gold">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-16 h-16 bg-zonta-gold/20 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-zonta-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-zonta-burgundy">Update Member</h2>
                    </div>
                    <form onSubmit={handleUpdate} className="space-y-5">
                        <div>
                            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                                Membership Status
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zonta-burgundy focus:border-transparent transition-all"
                            >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                                Admin Notes
                            </label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={6}
                                placeholder="Add any notes about this member..."
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zonta-burgundy focus:border-transparent transition-all resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={updating}
                            className="w-full bg-zonta-burgundy text-white py-3 rounded-lg font-semibold hover:bg-zonta-burgundy-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            {updating ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Update Member
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Additional Information */}
            {(member.occupation || member.interests || member.notes) && (
                <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border-t-4 border-zonta-burgundy">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-zonta-burgundy/10 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-zonta-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-zonta-burgundy">Additional Information</h2>
                    </div>
                    <div className="space-y-4">
                        {member.occupation && (
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-zonta-gold flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <div className="flex-1">
                                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Occupation</label>
                                    <p className="text-gray-800">{member.occupation}</p>
                                </div>
                            </div>
                        )}
                        {member.interests && (
                            <div className="flex items-start gap-3 pt-3 border-t">
                                <svg className="w-5 h-5 text-zonta-gold flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <div className="flex-1">
                                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Interests</label>
                                    <p className="text-gray-800">{member.interests}</p>
                                </div>
                            </div>
                        )}
                        {member.notes && (
                            <div className="flex items-start gap-3 pt-3 border-t">
                                <svg className="w-5 h-5 text-zonta-gold flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                <div className="flex-1">
                                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Notes</label>
                                    <p className="text-gray-800 whitespace-pre-wrap">{member.notes}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MemberDetail;
