import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const ShopSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            if (!sessionId) {
                setError('No session ID found');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/products/session/${sessionId}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch order details');
                }

                const data = await response.json();
                setOrder(data.data);
            } catch (err) {
                console.error('Error fetching order:', err);
                setError('Unable to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-32 pb-16 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-zonta-burgundy border-t-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 pt-32 pb-16">
                <div className="container-custom max-w-2xl">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                            Unable to Load Order
                        </h1>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Link
                            to="/shop"
                            className="inline-block bg-zonta-burgundy text-white px-6 py-3 rounded-lg font-semibold hover:bg-zonta-burgundy-dark transition-colors"
                        >
                            Return to Shop
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-16">
            <div className="container-custom max-w-2xl">
                {/* Success Message */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-zonta-burgundy mb-3">
                            Thank You for Your Purchase!
                        </h1>
                        <p className="text-xl text-gray-600">
                            Your order has been successfully processed
                        </p>
                    </div>

                    {/* Order Details */}
                    <div className="bg-gradient-to-br from-zonta-burgundy to-zonta-burgundy-dark rounded-lg p-6 text-white mb-6">
                        <h2 className="text-lg font-semibold mb-4 opacity-90">Order Details</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center pb-3 border-b border-white/20">
                                <span className="text-white/80">Total Amount</span>
                                <span className="text-3xl font-bold">${order.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/80">Product</span>
                                <span className="font-semibold">{order.productName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/80">Quantity</span>
                                <span className="font-semibold">{order.quantity}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/80">Customer</span>
                                <span className="font-semibold">{order.customerName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/80">Order Date</span>
                                <span className="font-semibold">
                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Receipt Info */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                            <p className="text-sm font-semibold text-blue-900 mb-1">
                                Receipt Sent
                            </p>
                            <p className="text-sm text-blue-700">
                                A receipt has been sent to <strong>{order.customerEmail}</strong>
                            </p>
                        </div>
                    </div>

                    {/* Impact Statement */}
                    <div className="text-center py-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Thank You for Your Support!</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Your purchase helps support Zonta's mission to empower women through service and advocacy. 
                            Every purchase contributes to scholarships, community programs, and initiatives that make a real difference.
                        </p>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">What's Next?</h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-zonta-burgundy/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-zonta-burgundy font-bold">1</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-1">Email Confirmation</h4>
                                <p className="text-gray-600 text-sm">
                                    You'll receive an email with your receipt and order details
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-zonta-burgundy/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-zonta-burgundy font-bold">2</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-1">Order Processing</h4>
                                <p className="text-gray-600 text-sm">
                                    We'll prepare your order for shipping within 1-2 business days
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-zonta-burgundy/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-zonta-burgundy font-bold">3</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-1">Shipping Notification</h4>
                                <p className="text-gray-600 text-sm">
                                    You'll receive tracking information once your order ships
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 grid md:grid-cols-3 gap-4">
                        <Link
                            to="/"
                            className="text-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Return Home
                        </Link>
                        <Link
                            to="/shop"
                            className="text-center bg-zonta-gold hover:bg-zonta-gold-dark text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Continue Shopping
                        </Link>
                        <Link
                            to="/events"
                            className="text-center bg-zonta-burgundy hover:bg-zonta-burgundy-dark text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                        >
                            View Events
                        </Link>
                    </div>
                </div>

                {/* Social Sharing */}
                <div className="text-center mt-8">
                    <p className="text-gray-600 mb-4">Share your support for our mission:</p>
                    <div className="flex justify-center gap-4">
                        <a
                            href="https://www.facebook.com/ZontaNaples/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopSuccess;
