import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function MembershipPaymentSuccess() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPaymentInfo = async () => {
            if (!sessionId) {
                setError('No session ID found');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/membership-payments/session/${sessionId}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch payment details');
                }

                const data = await response.json();
                setPaymentInfo(data.data);
            } catch (err) {
                console.error('Error fetching payment:', err);
                setError('Unable to load payment details');
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentInfo();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-32 pb-16 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-zonta-burgundy border-t-transparent"></div>
                    <p className="mt-4 text-gray-600">Processing your payment...</p>
                </div>
            </div>
        );
    }

    if (error || !paymentInfo) {
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
                            Unable to Load Payment
                        </h1>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Link
                            to="/"
                            className="inline-block bg-zonta-burgundy text-white px-6 py-3 rounded-lg font-semibold hover:bg-zonta-burgundy-dark transition-colors"
                        >
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const isRenewal = paymentInfo.amountTotal === 148;

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
                            {isRenewal ? 'Membership Renewed!' : 'Welcome to Zonta Club of Naples!'}
                        </h1>
                        <p className="text-xl text-gray-600">
                            Your payment has been successfully processed
                        </p>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-gradient-to-br from-zonta-burgundy to-zonta-burgundy-dark rounded-lg p-6 text-white mb-6">
                        <h2 className="text-lg font-semibold mb-4 opacity-90">Payment Details</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center pb-3 border-b border-white/20">
                                <span className="text-white/80">Amount Paid</span>
                                <span className="text-3xl font-bold">${paymentInfo.amountTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/80">Payment Type</span>
                                <span className="font-semibold">
                                    {isRenewal ? 'Annual Renewal' : 'Initial Membership'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/80">Status</span>
                                <span className="font-semibold capitalize">{paymentInfo.status}</span>
                            </div>
                        </div>
                    </div>

                    {/* Welcome Message */}
                    <div className="bg-gradient-to-br from-zonta-gold/10 to-zonta-burgundy/10 rounded-lg p-6 mb-6 border-l-4 border-zonta-gold">
                        <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-zonta-burgundy flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <div>
                                <p className="font-semibold text-gray-800 mb-2">
                                    {isRenewal 
                                        ? 'Thank you for continuing your journey with us!' 
                                        : 'Your membership is now active!'}
                                </p>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {isRenewal 
                                        ? 'Your membership has been renewed for another year. We look forward to continuing to make a difference together in our community.'
                                        : 'We\'re thrilled to have you join our community of women leaders. Together, we\'ll work towards advancing gender equality and empowering women through service and advocacy.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* What's Next */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-zonta-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            What's Next?
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-zonta-burgundy text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                                    1
                                </div>
                                <p className="text-sm text-gray-700">
                                    <strong>Check your email</strong> - You'll receive a confirmation email with your membership details and next steps.
                                </p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-zonta-burgundy text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                                    2
                                </div>
                                <p className="text-sm text-gray-700">
                                    <strong>Stay connected</strong> - Follow our social media and check our website regularly for upcoming events and opportunities.
                                </p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-zonta-burgundy text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                                    3
                                </div>
                                <p className="text-sm text-gray-700">
                                    <strong>Get involved</strong> - We'll reach out soon with information about our next meeting and how you can start making an impact.
                                </p>
                            </li>
                        </ul>
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
                                A payment receipt has been sent to <strong>{paymentInfo.customerEmail}</strong>. Please keep this for your records.
                            </p>
                        </div>
                    </div>

                    {/* Renewal Notice */}
                    {!isRenewal && (
                        <div className="bg-amber-50 rounded-lg p-4 mb-6 flex items-start gap-3">
                            <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div>
                                <p className="text-sm font-semibold text-amber-900 mb-1">
                                    Renewal Reminder
                                </p>
                                <p className="text-sm text-amber-700">
                                    Your membership will automatically renew in one year. We'll send you a reminder email one week before your renewal date.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link
                            to="/"
                            className="flex-1 text-center bg-zonta-burgundy text-white px-6 py-3 rounded-lg font-semibold hover:bg-zonta-burgundy-dark transition-colors shadow-md hover:shadow-lg"
                        >
                            Return to Home
                        </Link>
                        <Link
                            to="/events"
                            className="flex-1 text-center bg-white text-zonta-burgundy px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-zonta-burgundy"
                        >
                            View Events
                        </Link>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="text-center text-gray-600 text-sm">
                    <p className="mb-2">Questions about your membership?</p>
                    <Link to="/contact" className="text-zonta-burgundy hover:underline font-semibold">
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default MembershipPaymentSuccess;
