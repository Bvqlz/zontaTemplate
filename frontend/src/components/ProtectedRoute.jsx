import { Navigate } from 'react-router-dom';

// Protected Route Component - Only allow access if user has token
function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        // Redirect to admin login if no token
        return <Navigate to="/admin/login" replace />;
    }
    
    return children;
}

export default ProtectedRoute;
