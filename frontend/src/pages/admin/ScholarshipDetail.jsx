import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scholarshipAPI } from '../../utils/apiService';

function ScholarshipDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [scholarship, setScholarship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [formData, setFormData] = useState({
        status: '',
        notes: ''
    });

    useEffect(() => {
        fetchScholarship();
    }, [id]);

    const fetchScholarship = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await scholarshipAPI.getScholarship(id);
            setScholarship(result.data);
            setFormData({
                status: result.data.status,
                notes: result.data.notes || ''
            });
        } catch (err) {
            console.error('Error fetching scholarship:', err);
            setError('Failed to load scholarship details');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError(null);

        try {
            await scholarshipAPI.updateScholarship(id, formData);
            alert('Scholarship updated successfully!');
            fetchScholarship(); // Refresh data
        } catch (err) {
            console.error('Error updating scholarship:', err);
            setError(err.response?.data?.error || 'Failed to update scholarship');
        } finally {
            setUpdating(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDownload = async (doc) => {
        try {
            // Cloudinary URLs can be downloaded directly
            const response = await fetch(doc.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = doc.originalName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            console.log('Downloaded:', doc.originalName);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download file. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
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
                    <span className="text-xl text-gray-700">Loading scholarship details...</span>
                </div>
            </div>
        );
    }

    if (!scholarship) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Scholarship not found</span>
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={() => navigate('/admin/scholarships')}
                className="mb-6 inline-flex items-center gap-2 text-zonta-burgundy hover:text-zonta-burgundy-dark transition-colors group"
            >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Scholarships
            </button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zonta-burgundy mb-2">Scholarship Application Details</h1>
                <p className="text-gray-600">Review and manage scholarship application</p>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-start gap-3">
                    <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Applicant Information */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-zonta-burgundy">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-16 h-16 bg-zonta-burgundy/10 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-zonta-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-zonta-burgundy">Applicant Information</h2>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-zonta-gold flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <div className="flex-1">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
                                <p className="text-lg font-medium text-gray-800">
                                    {scholarship.fullName || `${scholarship.firstName} ${scholarship.lastName}`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 pt-3 border-t">
                            <svg className="w-5 h-5 text-zonta-gold flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <div className="flex-1">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                                <p className="text-gray-800">{scholarship.email}</p>
                            </div>
                        </div>

                        {scholarship.phone && (
                            <div className="flex items-start gap-3 pt-3 border-t">
                                <svg className="w-5 h-5 text-zonta-gold flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <div className="flex-1">
                                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Phone</label>
                                    <p className="text-gray-800">{scholarship.phone}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-start gap-3 pt-3 border-t">
                            <svg className="w-5 h-5 text-zonta-gold flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div className="flex-1">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Submitted At</label>
                                <p className="text-gray-800">{formatDate(scholarship.submittedAt)}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 pt-3 border-t">
                            <svg className="w-5 h-5 text-zonta-gold flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex-1">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Current Status</label>
                                <p className="capitalize font-bold text-zonta-burgundy">{scholarship.status.replace('_', ' ')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documents */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-zonta-gold">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-16 h-16 bg-zonta-gold/20 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-zonta-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-zonta-burgundy">Submitted Documents</h2>
                    </div>
                    
                    {scholarship.documents && scholarship.documents.length > 0 ? (
                        <div className="space-y-3">
                            {scholarship.documents.map((doc, index) => (
                                <div key={index} className="border-2 border-gray-200 rounded-lg p-4 hover:border-zonta-burgundy/30 hover:bg-zonta-burgundy/5 transition-all">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <svg className="w-5 h-5 text-zonta-gold flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-800 break-words" title={doc.originalName}>
                                                    {doc.originalName}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {(doc.size / 1024).toFixed(2)} KB • {doc.mimetype}
                                                </p>
                                                {doc.uploadedAt && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Uploaded: {formatDate(doc.uploadedAt)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDownload(doc)}
                                            className="flex-shrink-0 inline-flex items-center justify-center gap-2 bg-zonta-burgundy text-white px-4 py-2 rounded-lg hover:bg-zonta-burgundy-dark transition-all duration-300 shadow-md hover:shadow-lg group w-full sm:w-auto"
                                        >
                                            <svg className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            <span className="font-medium">Download</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-500">No documents uploaded</p>
                        </div>
                    )}
                </div>

                {/* Update Form */}
                <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2 border-t-4 border-zonta-burgundy">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-zonta-burgundy/10 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-zonta-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-zonta-burgundy">Update Application</h2>
                    </div>
                    
                    <form onSubmit={handleUpdate} className="space-y-5">
                        <div>
                            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zonta-burgundy focus:border-transparent transition-all"
                            >
                                <option value="pending">Pending</option>
                                <option value="under_review">Under Review</option>
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
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={5}
                                placeholder="Add notes about this application..."
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zonta-burgundy focus:border-transparent transition-all resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={updating}
                            className="bg-zonta-burgundy text-white px-8 py-3 rounded-lg hover:bg-zonta-burgundy-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg font-semibold flex items-center justify-center gap-2"
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
                                    Update Application
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ScholarshipDetail;
