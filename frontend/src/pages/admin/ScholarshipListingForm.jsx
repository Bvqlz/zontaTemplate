import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../../utils/apiService';

const ScholarshipListingForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [attachmentFile, setAttachmentFile] = useState(null);
    const [attachmentName, setAttachmentName] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        shortDescription: '',
        amount: '',
        deadline: '',
        eligibility: '',
        learnMoreUrl: '',
        status: 'draft',
        isFeatured: false
    });

    const fetchScholarship = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiService.get(`/api/scholarship-listings/${id}`);
            if (response.data.success) {
                const scholarship = response.data.data;
                setFormData({
                    title: scholarship.title || '',
                    description: scholarship.description || '',
                    shortDescription: scholarship.shortDescription || '',
                    amount: scholarship.amount || '',
                    deadline: scholarship.deadline ? new Date(scholarship.deadline).toISOString().split('T')[0] : '',
                    eligibility: scholarship.eligibility || '',
                    learnMoreUrl: scholarship.learnMoreUrl || '',
                    status: scholarship.status || 'draft',
                    isFeatured: scholarship.isFeatured || false
                });
                
                // Set existing image preview
                if (scholarship.image) {
                    setImagePreview(scholarship.image.url);
                }

                // Set existing attachment name
                if (scholarship.attachmentFile) {
                    setAttachmentName(scholarship.attachmentFile.originalName);
                }
            }
        } catch (err) {
            setError('Failed to load scholarship');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (isEdit) {
            fetchScholarship();
        }
    }, [isEdit, fetchScholarship]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        
        if (!file) return;
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Invalid image type. Only JPG, PNG, and WEBP images are allowed.');
            return;
        }
        
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image file must be less than 5MB.');
            return;
        }
        
        setImageFile(file);
        setError('');
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleAttachmentChange = (e) => {
        const file = e.target.files[0];
        
        if (!file) return;
        
        // Validate file type
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
            setError('Invalid attachment type. Only PDF, DOC, and DOCX files are allowed.');
            return;
        }
        
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Attachment file must be less than 5MB.');
            return;
        }
        
        setAttachmentFile(file);
        setAttachmentName(file.name);
        setError('');
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview('');
        
        // Reset file input
        const fileInput = document.getElementById('scholarship-image');
        if (fileInput) fileInput.value = '';
    };

    const handleRemoveAttachment = () => {
        setAttachmentFile(null);
        setAttachmentName('');
        
        // Reset file input
        const fileInput = document.getElementById('scholarship-attachment');
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            // Validate required fields
            if (!formData.title || !formData.description || !formData.amount || !formData.deadline) {
                setError('Please fill in all required fields.');
                setSaving(false);
                return;
            }

            // For new scholarships, image is required
            if (!isEdit && !imageFile) {
                setError('Please upload an image.');
                setSaving(false);
                return;
            }

            // Prepare FormData for multipart/form-data submission
            const submitData = new FormData();
            
            // Append all form fields
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('shortDescription', formData.shortDescription);
            submitData.append('amount', parseFloat(formData.amount));
            submitData.append('deadline', formData.deadline);
            submitData.append('eligibility', formData.eligibility);
            submitData.append('learnMoreUrl', formData.learnMoreUrl);
            submitData.append('status', formData.status);
            submitData.append('isFeatured', formData.isFeatured);
            
            // Append image file if present
            if (imageFile) {
                submitData.append('image', imageFile);
            }

            // Append attachment file if present
            if (attachmentFile) {
                submitData.append('attachment', attachmentFile);
            }

            let response;
            if (isEdit) {
                response = await apiService.put(
                    `/api/scholarship-listings/admin/${id}`,
                    submitData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
            } else {
                response = await apiService.post(
                    '/api/scholarship-listings/admin',
                    submitData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
            }

            if (response.data.success) {
                navigate('/admin/scholarship-listings');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save scholarship');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-zonta-burgundy border-t-transparent"></div>
                        <p className="mt-4 text-gray-600">Loading scholarship...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    {isEdit ? 'Edit Scholarship' : 'Create New Scholarship'}
                </h1>
                <p className="text-gray-600 mt-1">
                    {isEdit ? 'Update scholarship listing details' : 'Add a new scholarship listing'}
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                maxLength={200}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-zonta-burgundy focus:border-zonta-burgundy"
                                placeholder="Women in STEM Scholarship"
                            />
                        </div>

                        {/* Short Description */}
                        <div>
                            <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                Short Description
                            </label>
                            <textarea
                                id="shortDescription"
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleChange}
                                maxLength={300}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-zonta-burgundy focus:border-zonta-burgundy"
                                placeholder="Brief overview shown on card..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.shortDescription.length}/300 characters
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                maxLength={2000}
                                rows={6}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-zonta-burgundy focus:border-zonta-burgundy"
                                placeholder="Detailed description of the scholarship..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.description.length}/2000 characters
                            </p>
                        </div>

                        {/* Eligibility */}
                        <div>
                            <label htmlFor="eligibility" className="block text-sm font-medium text-gray-700 mb-1">
                                Eligibility Criteria
                            </label>
                            <textarea
                                id="eligibility"
                                name="eligibility"
                                value={formData.eligibility}
                                onChange={handleChange}
                                maxLength={1000}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-zonta-burgundy focus:border-zonta-burgundy"
                                placeholder="Requirements to apply..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.eligibility.length}/1000 characters
                            </p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Amount */}
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                                Scholarship Amount <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-zonta-burgundy focus:border-zonta-burgundy"
                                    placeholder="5000.00"
                                />
                            </div>
                        </div>

                        {/* Deadline */}
                        <div>
                            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                                Application Deadline <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                id="deadline"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-zonta-burgundy focus:border-zonta-burgundy"
                            />
                        </div>

                        {/* Learn More URL */}
                        <div>
                            <label htmlFor="learnMoreUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                Learn More URL
                            </label>
                            <input
                                type="url"
                                id="learnMoreUrl"
                                name="learnMoreUrl"
                                value={formData.learnMoreUrl}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-zonta-burgundy focus:border-zonta-burgundy"
                                placeholder="https://example.com/scholarship-details"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                External link for more information
                            </p>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Scholarship Image {!isEdit && <span className="text-red-500">*</span>}
                            </label>
                            
                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mb-4 relative">
                                    <img
                                        src={imagePreview}
                                        alt="Scholarship preview"
                                        className="w-full max-w-md h-64 object-cover rounded-lg border-2 border-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                                        title="Remove image"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                            
                            {/* File Upload Input */}
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="scholarship-image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">JPG, PNG, or WEBP (Max 5MB)</p>
                                    </div>
                                    <input
                                        id="scholarship-image"
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                {imageFile ? `Selected: ${imageFile.name}` : 'Upload a scholarship image to display on the page'}
                            </p>
                        </div>

                        {/* Attachment Upload */}
                        <div>
                            <label htmlFor="scholarship-attachment" className="block text-sm font-medium text-gray-700 mb-1">
                                Application Details (PDF/DOC)
                            </label>
                            <input
                                type="file"
                                id="scholarship-attachment"
                                accept=".pdf,.doc,.docx"
                                onChange={handleAttachmentChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-zonta-burgundy focus:border-zonta-burgundy"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Optional PDF or DOC file for applicants to download. Max 5MB.
                            </p>
                            {attachmentName && (
                                <div className="mt-3 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="text-sm text-gray-700">{attachmentName}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveAttachment}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Status and Featured */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-zonta-burgundy focus:border-zonta-burgundy"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="active">Active</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>

                            <div className="flex items-end">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-zonta-burgundy border-gray-300 rounded focus:ring-zonta-burgundy"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Featured</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/scholarship-listings')}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-zonta-burgundy text-white rounded-lg hover:bg-zonta-burgundy-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : isEdit ? 'Update Scholarship' : 'Create Scholarship'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ScholarshipListingForm;
