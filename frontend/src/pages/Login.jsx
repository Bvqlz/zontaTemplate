import LoginForm from '../components/LoginForm';

function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-zonta-burgundy via-zonta-burgundy-dark to-zonta-burgundy flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="bg-white w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
                        <svg className="w-10 h-10 text-zonta-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
                    <p className="text-white/80">Zonta Club of Naples</p>
                </div>
                
                <LoginForm />
            </div>
        </div>
    );
}

export default LoginPage;
