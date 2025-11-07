import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../../utils/apiService';

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        shortDescription: '',
        price: '',
        inventory: 0,
        trackInventory: true,
        allowBackorder: false,
        sku: '',
        category: 'Other',
        tags: '',
        status: 'draft',
        featured: false,
        weight: '',
        weightUnit: 'lb',
        requiresShipping: true
    });

    const fetchProduct = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiService.get(`/api/products/${id}`);
            if (response.data.success) {
                const product = response.data.data;
                setFormData({
                    name: product.name || '',
                    description: product.description || '',
                    shortDescription: product.shortDescription || '',
                    price: product.price || '',
                    inventory: product.inventory || 0,
                    trackInventory: product.trackInventory !== undefined ? product.trackInventory : true,
                    allowBackorder: product.allowBackorder || false,
                    sku: product.sku || '',
                    category: product.category || 'Other',
                    tags: product.tags ? product.tags.join(', ') : '',
                    status: product.status || 'draft',
                    featured: product.featured || false,
                    weight: product.weight || '',
                    weightUnit: product.weightUnit || 'lb',
                    requiresShipping: product.requiresShipping !== undefined ? product.requiresShipping : true
                });
                
                // Set existing image preview
                if (product.featuredImage) {
                    setImagePreview(product.featuredImage);
                } else if (product.images && product.images.length > 0) {
                    setImagePreview(product.images[0].url);
                }
            }
        } catch (err) {
            setError('Failed to load product');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (isEdit) {
            fetchProduct();
        }
    }, [isEdit, fetchProduct]);

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
            setError('Invalid file type. Only JPG, PNG, and WEBP images are allowed.');
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

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview('');
        
        // Reset file input
        const fileInput = document.getElementById('product-image');
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            // Prepare FormData for multipart/form-data submission
            const submitData = new FormData();
            
            // Append all form fields
            submitData.append('name', formData.name);
            submitData.append('description', formData.description);
            submitData.append('shortDescription', formData.shortDescription);
            submitData.append('price', parseFloat(formData.price));
            submitData.append('inventory', parseInt(formData.inventory) || 0);
            submitData.append('trackInventory', formData.trackInventory);
            submitData.append('allowBackorder', formData.allowBackorder);
            submitData.append('sku', formData.sku);
            submitData.append('category', formData.category);
            submitData.append('status', formData.status);
            submitData.append('featured', formData.featured);
            submitData.append('requiresShipping', formData.requiresShipping);
            submitData.append('weightUnit', formData.weightUnit);
            
            if (formData.weight) {
                submitData.append('weight', parseFloat(formData.weight));
            }
            
            // Handle tags
            if (formData.tags) {
                const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
                tagsArray.forEach(tag => submitData.append('tags[]', tag));
            }
            
            // Append image file if present
            if (imageFile) {
                submitData.append('image', imageFile);
            }

            let response;
            if (isEdit) {
                response = await apiService.put(`/api/products/admin/${id}`, submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                response = await apiService.post('/api/products/admin', submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            if (response.data.success) {
                alert(`Product ${isEdit ? 'updated' : 'created'} successfully!`);
                navigate('/admin/products');
            }
        } catch (err) {
            setError(err.response?.data?.error || `Failed to ${isEdit ? 'update' : 'create'} product`);
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zonta-burgundy mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading product...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    {isEdit ? 'Edit Product' : 'Create New Product'}
                </h1>
                <p className="text-gray-600 mt-1">
                    {isEdit ? 'Update product information' : 'Add a new product to your shop'}
                </p>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                placeholder="Enter product name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Short Description
                            </label>
                            <input
                                type="text"
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleChange}
                                maxLength={500}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                placeholder="Brief description (shown in product cards)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                placeholder="Detailed product description"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Image
                            </label>
                            
                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mb-4 relative">
                                    <img
                                        src={imagePreview}
                                        alt="Product preview"
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
                                <label htmlFor="product-image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
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
                                        id="product-image"
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                {imageFile ? `Selected: ${imageFile.name}` : 'Upload a product image to display in the shop'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price * ($)
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                {/* Inventory */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Inventory</h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="trackInventory"
                                checked={formData.trackInventory}
                                onChange={handleChange}
                                className="h-4 w-4 text-burgundy focus:ring-burgundy border-gray-300 rounded"
                            />
                            <label className="text-sm font-medium text-gray-700">
                                Track inventory quantity
                            </label>
                        </div>

                        {formData.trackInventory && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantity in Stock
                                    </label>
                                    <input
                                        type="number"
                                        name="inventory"
                                        value={formData.inventory}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="allowBackorder"
                                        checked={formData.allowBackorder}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-burgundy focus:ring-burgundy border-gray-300 rounded"
                                    />
                                    <label className="text-sm font-medium text-gray-700">
                                        Allow customers to purchase when out of stock
                                    </label>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                SKU (Stock Keeping Unit)
                            </label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                placeholder="PRODUCT-001"
                            />
                        </div>
                    </div>
                </div>

                {/* Organization */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Organization</h2>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                        >
                            <option value="Apparel">Apparel</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Books">Books</option>
                            <option value="Home & Garden">Home & Garden</option>
                            <option value="Jewelry">Jewelry</option>
                            <option value="Art">Art</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Shipping */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping</h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="requiresShipping"
                                checked={formData.requiresShipping}
                                onChange={handleChange}
                                className="h-4 w-4 text-burgundy focus:ring-burgundy border-gray-300 rounded"
                            />
                            <label className="text-sm font-medium text-gray-700">
                                This product requires shipping
                            </label>
                        </div>

                        {formData.requiresShipping && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Weight
                                    </label>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Unit
                                    </label>
                                    <select
                                        name="weightUnit"
                                        value={formData.weightUnit}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                    >
                                        <option value="lb">lb</option>
                                        <option value="oz">oz</option>
                                        <option value="kg">kg</option>
                                        <option value="g">g</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Status & Visibility */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Status & Visibility</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status *
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                            >
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-zonta-burgundy text-white py-3 px-6 rounded-lg font-semibold hover:bg-zonta-burgundy-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {saving ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                {isEdit ? 'Updating...' : 'Creating...'}
                            </span>
                        ) : (
                            isEdit ? 'Update Product' : 'Create Product'
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
