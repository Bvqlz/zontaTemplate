import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../utils/apiService';

const ProductCheckout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        quantity: 1
    });

    const fetchProduct = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiService.get(`/api/products/${id}`);
            if (response.data.success) {
                const productData = response.data.data;
                
                // Check if product is available
                if (productData.status !== 'active') {
                    setError('This product is not available for purchase');
                    return;
                }
                
                if (productData.trackInventory && !productData.allowBackorder && productData.inventory === 0) {
                    setError('This product is out of stock');
                    return;
                }
                
                setProduct(productData);
            }
        } catch (err) {
            setError('Failed to load product');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const response = await apiService.post('/api/products/checkout', {
                productId: id,
                quantity: parseInt(formData.quantity),
                customerName: formData.customerName,
                customerEmail: formData.customerEmail
            });

            if (response.data.success && response.data.url) {
                // Redirect to Stripe Checkout
                window.location.href = response.data.url;
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create checkout session');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zonta-burgundy mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error && !product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Available</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="bg-zonta-burgundy text-white px-6 py-3 rounded-lg font-semibold hover:bg-zonta-burgundy-dark transition-colors"
                    >
                        Return to Shop
                    </button>
                </div>
            </div>
        );
    }

    const maxQuantity = product?.trackInventory && !product?.allowBackorder ? product.inventory : 10;
    const totalPrice = (product?.price || 0) * formData.quantity;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-zonta-burgundy to-zonta-burgundy-dark p-6 text-white">
                        <h1 className="text-3xl font-bold">Checkout</h1>
                        <p className="text-zonta-burgundy-light mt-1">Complete your purchase</p>
                    </div>

                    <div className="p-6">
                        {/* Product Summary */}
                        <div className="border-b pb-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h2>
                            <div className="flex items-start gap-4">
                                {product?.featuredImage ? (
                                    <img
                                        src={product.featuredImage}
                                        alt={product.name}
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                ) : (
                                    <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center text-4xl">
                                        📦
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">{product?.name}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{product?.shortDescription || product?.description}</p>
                                    <p className="text-2xl font-bold text-zonta-burgundy mt-2">
                                        ${product?.price.toFixed(2)}
                                    </p>
                                    {product?.trackInventory && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            {product.inventory} in stock
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Checkout Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zonta-burgundy focus:border-transparent"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="customerEmail"
                                    value={formData.customerEmail}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zonta-burgundy focus:border-transparent"
                                    placeholder="john@example.com"
                                />
                                <p className="text-xs text-gray-500 mt-1">Receipt will be sent to this email</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity *
                                </label>
                                <select
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zonta-burgundy focus:border-transparent"
                                >
                                    {[...Array(maxQuantity)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Price per item:</span>
                                        <span>${product?.price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Quantity:</span>
                                        <span>{formData.quantity}</span>
                                    </div>
                                    <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between text-lg font-bold text-gray-900">
                                            <span>Total:</span>
                                            <span className="text-zonta-burgundy">${totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-zonta-burgundy text-white py-4 px-6 rounded-lg font-semibold hover:bg-zonta-burgundy-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {submitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        <>Proceed to Payment</>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/shop')}
                                    disabled={submitting}
                                    className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>

                            <p className="text-xs text-gray-500 text-center">
                                You will be redirected to Stripe's secure checkout page to complete your payment.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCheckout;
