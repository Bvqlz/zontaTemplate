import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const ShopSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto"></div>
                    <p className="mt-4 text-gray-600">Processing your order...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Success Header */}
                    <div className="bg-gradient-to-r from-burgundy to-burgundy-dark p-8 text-white text-center">
                        <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Purchase Successful!</h1>
                        <p className="text-burgundy-light">Thank you for your purchase</p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <div className="space-y-6">
                            {/* Confirmation Message */}
                            <div className="text-center border-b pb-6">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                                    Order Confirmed
                                </h2>
                                <p className="text-gray-600">
                                    Your order has been successfully processed. You will receive a confirmation email shortly with your order details and receipt.
                                </p>
                                {sessionId && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        Order ID: {sessionId.substring(0, 20)}...
                                    </p>
                                )}
                            </div>

                            {/* Next Steps */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    What happens next?
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <div>
                                            <p className="font-medium text-gray-900">Email Confirmation</p>
                                            <p className="text-sm text-gray-600">You'll receive an email with your receipt and order details</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                        <div>
                                            <p className="font-medium text-gray-900">Order Processing</p>
                                            <p className="text-sm text-gray-600">We'll prepare your order for shipping within 1-2 business days</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                        </svg>
                                        <div>
                                            <p className="font-medium text-gray-900">Shipping Notification</p>
                                            <p className="text-sm text-gray-600">You'll receive tracking information once your order ships</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Support Your Mission */}
                            <div className="bg-gold-light border border-gold rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Thank You for Your Support! 💛
                                </h3>
                                <p className="text-gray-700 mb-4">
                                    Your purchase directly supports Zonta's mission to empower women and girls through service and advocacy.
                                </p>
                                <p className="text-sm text-gray-600">
                                    Every purchase helps fund scholarships, community programs, and initiatives that make a real difference in our community.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    to="/shop"
                                    className="flex-1 bg-burgundy text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-burgundy-dark transition-colors"
                                >
                                    Continue Shopping
                                </Link>
                                <Link
                                    to="/"
                                    className="flex-1 bg-white border-2 border-burgundy text-burgundy py-3 px-6 rounded-lg font-semibold text-center hover:bg-burgundy hover:text-white transition-colors"
                                >
                                    Return to Home
                                </Link>
                            </div>

                            {/* Contact Support */}
                            <div className="text-center pt-6 border-t">
                                <p className="text-sm text-gray-600">
                                    Need help with your order?{' '}
                                    <Link to="/contact" className="text-burgundy hover:underline font-medium">
                                        Contact Us
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopSuccess;
