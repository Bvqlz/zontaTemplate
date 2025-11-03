import ScholarshipForm from '../components/ScholarshipForm';

function ScholarshipPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-16">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-zonta-burgundy mb-4">
                        Apply for our Scholarship!
                    </h1>
                    <div className="w-24 h-1 bg-zonta-gold mx-auto mb-6"></div>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                        Invest in your future. Apply for a Zonta scholarship and take the next step 
                        toward achieving your educational and career goals.
                    </p>
                </div>
                <ScholarshipForm />
            </div>
        </div>
    );
}

export default ScholarshipPage;
