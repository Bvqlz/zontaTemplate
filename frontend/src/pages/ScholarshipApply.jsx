import { useSearchParams } from 'react-router-dom';
import ScholarshipForm from '../components/ScholarshipForm';

function ScholarshipApply() {
    const [searchParams] = useSearchParams();
    const scholarshipId = searchParams.get('scholarship');

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-16">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-zonta-burgundy mb-4">
                        Apply for Scholarship
                    </h1>
                    <div className="w-24 h-1 bg-zonta-gold mx-auto mb-6"></div>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                        Complete the form below to submit your scholarship application.
                    </p>
                </div>
                <ScholarshipForm scholarshipId={scholarshipId} />
            </div>
        </div>
    );
}

export default ScholarshipApply;
