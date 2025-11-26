import { useState, useEffect } from 'react';
import { scholarshipAPI, scholarshipListingAPI } from '../utils/apiService';

function ScholarshipForm({ scholarshipId }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        scholarshipListingId: scholarshipId || '' // Store the scholarship listing ID if provided
    });
    
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [scholarships, setScholarships] = useState([]);
    const [loadingScholarships, setLoadingScholarships] = useState(true);

    // Fetch active scholarships on component mount
    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                setLoadingScholarships(true);
                const response = await scholarshipListingAPI.getAllListings('active');
                setScholarships(response.data || []);
            } catch (err) {
                console.error('Error fetching scholarships:', err);
                setError('Failed to load scholarships. Please refresh the page.');
            } finally {
                setLoadingScholarships(false);
            }
        };

        fetchScholarships();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        
        // Validate file count (including existing files)
        if (files.length + selectedFiles.length > 3) {
            setError('Maximum 2 files allowed');
            return;
        }

        // Validate file types
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const invalidFiles = selectedFiles.filter(file => !validTypes.includes(file.type));
        
        if (invalidFiles.length > 0) {
            setError('Only PDF, DOC, and DOCX files are allowed');
            return;
        }

        // Validate file size (5MB each)
        const oversizedFiles = selectedFiles.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            setError('Each file must be less than 5MB');
            return;
        }

        // Add new files to existing files
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
        setError(null);
        
        // Reset file input so the same file can be selected again
        e.target.value = '';
    };

    const handleRemoveFile = (indexToRemove) => {
        setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        // Validate files
        if (files.length === 0) {
            setError('Please upload at least one document');
            setLoading(false);
            return;
        }

        try {
            // Create FormData
            const data = new FormData();
            data.append('firstName', formData.firstName);
            data.append('lastName', formData.lastName);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            
            // Add scholarship listing ID if selected
            if (formData.scholarshipListingId) {
                data.append('scholarshipListingId', formData.scholarshipListingId);
            }
            
            // Append files
            files.forEach(file => {
                data.append('documents', file);
            });

            const result = await scholarshipAPI.submitApplication(data);
            console.log('Success:', result);
            setSuccess(true);
            
            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: ''
            });
            setFiles([]);
            
            // Reset file input
            const fileInput = document.getElementById('documents');
            if (fileInput) fileInput.value = '';
            
        } catch (err) {
            console.error('Error:', err);
            setError(
                err.response?.data?.error || 
                err.response?.data?.errors?.join(', ') ||
                'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const _handleDownloadForm = async () => {
        try {
            const blob = await scholarshipAPI.downloadForm();
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'zonta-scholarship-form.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error downloading form:', err);
            setError('Failed to download form. Please try again.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
                <h2 className="text-3xl font-bold text-zonta-burgundy mb-6 text-center">Scholarship Application</h2>
                
                <div className="mb-8 p-6 bg-gradient-to-br from-zonta-burgundy/10 to-zonta-gold/10 border-l-4 border-zonta-burgundy rounded-lg">
                    <h3 className="font-bold text-lg text-zonta-burgundy mb-3 flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Application Instructions
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
                        <li>Download the application details and complete the respective scholarship application form</li>
                        <li>Upload the completed form along with supporting documents</li>
                        <li>Maximum 3 files (PDF, DOC, or DOCX)</li>
                        <li>Each file must be less than 5MB</li>
                    </ol>
                </div>

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                        <div className="flex items-center">
                            <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p>Thank you for your scholarship application! We have received your documents and will review them shortly.</p>
                        </div>
                    </div>
                )}
                
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                        <div className="flex items-center">
                            <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Scholarship Selector */}
                    <div>
                        <label htmlFor="scholarshipListingId" className="block text-sm font-semibold text-gray-700 mb-2">
                            Select Scholarship *
                        </label>
                        {loadingScholarships ? (
                            <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                                Loading scholarships...
                            </div>
                        ) : scholarships.length === 0 ? (
                            <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-yellow-50 text-yellow-700">
                                No active scholarships available at this time.
                            </div>
                        ) : (
                            <select
                                id="scholarshipListingId"
                                name="scholarshipListingId"
                                value={formData.scholarshipListingId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-zonta-burgundy transition-colors bg-white"
                            >
                                <option value="">-- Select a scholarship --</option>
                                {scholarships.map((scholarship) => (
                                    <option key={scholarship._id} value={scholarship._id}>
                                        {scholarship.title}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                                First Name *
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                minLength={2}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-zonta-burgundy transition-colors"
                            />
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                minLength={2}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-zonta-burgundy transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-zonta-burgundy transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-zonta-burgundy transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="documents" className="block text-sm font-semibold text-gray-700 mb-2">
                            Upload Documents * (Max 3 files, 5MB each)
                        </label>
                        <input
                            type="file"
                            id="documents"
                            name="documents"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx"
                            multiple
                            disabled={files.length >= 2}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-zonta-burgundy transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zonta-burgundy file:text-white hover:file:bg-zonta-burgundy-dark disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {files.length > 0 && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p className="font-semibold text-sm text-gray-700 mb-2 flex items-center justify-between">
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Selected files:
                                    </span>
                                    <span className="text-xs text-gray-500">{files.length}/2</span>
                                </p>
                                <ul className="space-y-2">
                                    {files.map((file, index) => (
                                        <li key={index} className="text-sm text-gray-600 flex items-center justify-between bg-white p-2 rounded">
                                            <div className="flex items-center flex-1 min-w-0">
                                                <svg className="w-4 h-4 mr-2 text-zonta-burgundy flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span className="truncate">{file.name}</span>
                                                <span className="ml-2 text-gray-500 flex-shrink-0">({(file.size / 1024).toFixed(2)} KB)</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFile(index)}
                                                className="ml-3 text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors flex-shrink-0"
                                                title="Remove file"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-zonta-burgundy text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-zonta-burgundy-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ScholarshipForm;
