import MembershipForm from '../components/MembershipForm';

function JoinPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-16">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-zonta-burgundy mb-4">
                        Join Zonta Club of Naples
                    </h1>
                    <div className="w-24 h-1 bg-zonta-gold mx-auto mb-6"></div>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                        Become part of our mission to empower women and advocate for gender equality.
                        Together, we can make a lasting impact in our community.
                    </p>
                </div>
                <MembershipForm />
            </div>
        </div>
    );
}

export default JoinPage;
