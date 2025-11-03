import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../utils/apiService';

function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const userEmail = localStorage.getItem('userEmail');

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            navigate('/admin/login');
        } catch (err) {
            console.error('Logout error:', err);
            // Clear local storage anyway
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userRole');
            navigate('/admin/login');
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-zonta-burgundy text-white fixed h-full shadow-xl">
                <div className="p-6 bg-zonta-burgundy-dark">
                    <h2 className="text-2xl font-bold mb-1">Admin Portal</h2>
                    <p className="text-sm text-white/80 truncate">{userEmail}</p>
                </div>

                <nav className="mt-6">
                    <Link
                        to="/admin"
                        className={`flex items-center px-6 py-3 hover:bg-zonta-burgundy-dark transition-colors duration-200 ${
                            isActive('/admin') ? 'bg-zonta-burgundy-dark border-l-4 border-zonta-gold' : ''
                        }`}
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Dashboard
                    </Link>
                    
                    <Link
                        to="/admin/scholarships"
                        className={`flex items-center px-6 py-3 hover:bg-zonta-burgundy-dark transition-colors duration-200 ${
                            location.pathname.includes('/admin/scholarships') ? 'bg-zonta-burgundy-dark border-l-4 border-zonta-gold' : ''
                        }`}
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Scholarships
                    </Link>
                    
                    <Link
                        to="/admin/events"
                        className={`flex items-center px-6 py-3 hover:bg-zonta-burgundy-dark transition-colors duration-200 ${
                            location.pathname.includes('/admin/events') ? 'bg-zonta-burgundy-dark border-l-4 border-zonta-gold' : ''
                        }`}
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Events
                    </Link>
                    
                    <Link
                        to="/admin/members"
                        className={`flex items-center px-6 py-3 hover:bg-zonta-burgundy-dark transition-colors duration-200 ${
                            location.pathname.includes('/admin/members') ? 'bg-zonta-burgundy-dark border-l-4 border-zonta-gold' : ''
                        }`}
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Members
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-6 py-3 mt-8 hover:bg-red-700 transition-colors duration-200 text-red-200 hover:text-white"
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
