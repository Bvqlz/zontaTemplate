import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PRESET_AMOUNTS = [25, 50, 100, 250, 500, 1000];


function Donate() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Form state
    const [selectedAmount, setSelectedAmount] = useState(100);
    const [customAmount, setCustomAmount] = useState('');
    const [useCustomAmount, setUseCustomAmount] = useState(false);
    
    const [formData, setFormData] = useState({
        donorName: '',
        donorEmail: '',
        donorPhone: '',
        message: '',
        isRecurring: false,
        frequency: 'one-time'
    });

    const handleAmountSelect = (amount) => {
        setSelectedAmount(amount);
        setUseCustomAmount(false);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (e) => {
        const value = e.target.value;
        setCustomAmount(value);
        setUseCustomAmount(true);
        if (value && !isNaN(value) && parseFloat(value) > 0) {
            setSelectedAmount(parseFloat(value));
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate
            if (!formData.donorName || !formData.donorEmail) {
                throw new Error('Please provide your name and email');
            }

            const amount = useCustomAmount ? parseFloat(customAmount) : selectedAmount;
            
            if (!amount || amount < 1) {
                throw new Error('Please enter a valid donation amount');
            }

            // Create checkout session
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/donations/create-checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount,
                    ...formData
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create checkout session');
            }

            const { url } = await response.json();
            
            // Redirect to Stripe Checkout
            window.location.href = url;

        } catch (err) {
            console.error('Donation error:', err);
            setError(err.message || 'Failed to process donation. Please try again.');
            setLoading(false);
        }
    };

    const currentAmount = useCustomAmount ? parseFloat(customAmount) || 0 : selectedAmount;

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-16">
            <div className="container-custom max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-zonta-burgundy mb-4">
                        Make a Donation
                    </h1>
                    <div className="w-24 h-1 bg-zonta-gold mx-auto mb-6"></div>
                    <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                        Your generous donation helps us empower women and create lasting change in our community.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                        <p className="font-semibold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
                    {/* Amount Selection */}
                    <div className="mb-8">
                        <label className="block text-lg font-semibold text-gray-800 mb-4">
                            Select Donation Amount
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                            {PRESET_AMOUNTS.map((amount) => (
                                <button
                                    key={amount}
                                    type="button"
                                    onClick={() => handleAmountSelect(amount)}
                                    className={`py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 ${
                                        selectedAmount === amount && !useCustomAmount
                                            ? 'bg-zonta-burgundy text-white shadow-lg scale-105'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
                                    }`}
                                >
                                    ${amount}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-semibold">
                                $
                            </span>
                            <input
                                type="number"
                                placeholder="Custom amount"
                                value={customAmount}
                                onChange={handleCustomAmountChange}
                                min="1"
                                step="0.01"
                                className={`w-full pl-8 pr-4 py-4 border-2 rounded-lg text-lg font-semibold transition-colors ${
                                    useCustomAmount
                                        ? 'border-zonta-burgundy ring-2 ring-zonta-burgundy/20'
                                        : 'border-gray-300 focus:border-zonta-burgundy'
                                }`}
                            />
                        </div>
                    </div>

                    
                    {/* Donor Information */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Your Information</h3>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="donorName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="donorName"
                                    name="donorName"
                                    value={formData.donorName}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-zonta-burgundy transition-colors disabled:bg-gray-100"
                                />
                            </div>
                            <div>
                                <label htmlFor="donorEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="donorEmail"
                                    name="donorEmail"
                                    value={formData.donorEmail}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-zonta-burgundy transition-colors"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="donorPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number (Optional)
                            </label>
                            <input
                                type="tel"
                                id="donorPhone"
                                name="donorPhone"
                                value={formData.donorPhone}
                                onChange={handleInputChange}
                                placeholder="(555) 123-4567"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-zonta-burgundy transition-colors"
                            />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="mb-6">
                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                            Message (Optional)
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows="3"
                            maxLength="500"
                            placeholder="Leave a message or dedication..."
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-zonta-burgundy transition-colors resize-none"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            {formData.message.length}/250 characters
                        </p>
                    </div>

                    {/* Summary */}
                    <div className="bg-zonta-burgundy/5 rounded-lg p-6 mb-6 border-l-4 border-zonta-burgundy">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">Donation Summary</h3>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700">Amount:</span>
                            <span className="text-2xl font-bold text-zonta-burgundy">
                                ${currentAmount.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || currentAmount < 1}
                        className="w-full bg-zonta-burgundy text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-zonta-burgundy-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            <>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Proceed to Secure Checkout
                            </>
                        )}
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                        Secure payment powered by Stripe.
                    </p>
                </form>

                {/* Additional Info */}
                <div className="mt-12">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-2xl mx-auto border-t-4 border-zonta-burgundy">
                        <div className="w-16 h-16 bg-zonta-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-zonta-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-3 text-xl">Direct Impact</h4>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            100% of your donation supports our mission to empower women and girls through service and advocacy
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Donate;
