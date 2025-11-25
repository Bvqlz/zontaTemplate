import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ScholarshipPage() {
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchScholarships();
    }, []);

    const fetchScholarships = async () => {
        try {
            setLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await fetch(`${apiUrl}/api/scholarship-listings`);
            const data = await response.json();
            
            if (data.success) {
                setScholarships(data.data);
            } else {
                setError('Failed to load scholarships');
            }
        } catch (err) {
            setError('Failed to load scholarships');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadAttachment = async (doc) => {
        try {
            // Cloudinary URLs can be downloaded directly
            const response = await fetch(doc.cloudinaryUrl);
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
        // Parse date string and extract year, month, day to avoid timezone issues
        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();
        const day = date.getUTCDate();
        
        // Create a local date with the UTC values
        const localDate = new Date(year, month, day);
        return localDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-32 pb-16">
                <div className="container-custom">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-zonta-burgundy border-t-transparent"></div>
                            <p className="mt-4 text-gray-600">Loading scholarships...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-16">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-zonta-burgundy mb-4">
                        Scholarships
                    </h1>
                    <div className="w-24 h-1 bg-zonta-gold mx-auto mb-6"></div>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                        Invest in your future. Apply for a Zonta scholarship and take the next step 
                        toward achieving your educational and career goals.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-8 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Scholarships Grid */}
                {scholarships.length === 0 ? (
                    <div className="text-center py-16">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Scholarships</h3>
                        <p className="text-gray-600">Check back later for new scholarship opportunities!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {scholarships.map((scholarship) => (
                            <div
                                key={scholarship._id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                            >
                                {/* Image */}
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={scholarship.image.url}
                                        alt={scholarship.image.alt || scholarship.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-4 right-4 bg-zonta-burgundy text-white px-4 py-2 rounded-lg font-bold">
                                        {formatCurrency(scholarship.amount)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-zonta-burgundy mb-2">
                                        {scholarship.title}
                                    </h3>
                                    
                                    <p className="text-gray-600 mb-4 flex-grow">
                                        {scholarship.shortDescription || scholarship.description.substring(0, 150) + '...'}
                                    </p>

                                    {/* Deadline */}
                                    <div className="flex items-center text-sm text-gray-500 mb-4">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>Deadline: {formatDate(scholarship.deadline)}</span>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-3 mt-auto">
                                        {scholarship.learnMoreUrl && (
                                            <a
                                                href={scholarship.learnMoreUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 bg-gray-100 text-zonta-burgundy px-4 py-2 rounded-lg font-semibold text-center hover:bg-gray-200 transition-colors duration-300"
                                            >
                                                Learn More
                                            </a>
                                        )}
                                        <Link
                                            to={`/scholarship/apply?scholarship=${scholarship._id}`}
                                            className="flex-1 bg-zonta-burgundy text-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-zonta-burgundy-dark transition-colors duration-300"
                                        >
                                            Apply Now
                                        </Link>
                                    </div>

                                    {/* Download Attachment */}
                                    {scholarship.attachmentFile && (
                                        <button
                                            onClick={() => handleDownloadAttachment(scholarship.attachmentFile)}
                                            className="mt-3 flex items-center justify-center text-sm text-zonta-gold hover:text-zonta-gold-dark transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Download Application Details
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ScholarshipPage;
