import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipboardCopyIcon } from '@heroicons/react/solid';

const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);

    //console.log(id);

    const navigate = useNavigate();

    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        if (storedToken) {
            setToken(JSON.parse(storedToken));
        }
    }, []);

    useEffect(() => {
        // Replace this with the actual URL of your API
        fetch(`/api/classroom/${id}`)
            .then(response => response.json())
            .then(data => setCourse(data))
            .catch(error => console.error(error));
    }, [id]);

    if (!course) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-20">
            <button 
                onClick={() => navigate(token && token.user.user_metadata.role === 'instructor' ? `/InsHomepage/${token.user.user_metadata.id}` : `/StudHomepage/${token.user.user_metadata.id}`)}
                className="mb-10 mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Back
            </button>            
            <h2 className="text-4xl font-semibold text-gray-800">{course[0].course_code} - {course[0].course_name}</h2>
            
            <p className="pt-5" onClick={() => navigator.clipboard.writeText(course[0].classroom_id)}>
                <strong>Class Token:</strong> {course[0].classroom_id}
                <ClipboardCopyIcon className="h-5 w-5 inline-block ml-2" />
            </p>

            <p className="pt-5 text-lg text-justify text-gray-600">{course[0].course_desc}</p>
            {/* Display other course details here */}
        </div>
    );
};

export default CourseDetails;