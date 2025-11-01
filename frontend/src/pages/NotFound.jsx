import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
            <div className="text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-zonta-burgundy">404</h1>
                    <div className="text-6xl mb-4">🔍</div>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Page Not Found
                </h2>
                
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Sorry, the page you're looking for doesn't exist or has been moved.
                </p>
                
                <div className="flex gap-4 justify-center">
                    <Link 
                        to="/" 
                        className="bg-zonta-burgundy text-white px-6 py-3 rounded-lg font-semibold hover:bg-zonta-burgundy-dark transition-colors"
                    >
                        Go Home
                    </Link>
                    <Link 
                        to="/contact" 
                        className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;