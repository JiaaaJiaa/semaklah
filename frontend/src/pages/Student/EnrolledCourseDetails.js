import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import supabase from '../../config/supabaseClient';


const EnrolledCourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [assignments, setAssignments] = useState([]);

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
        const fetchCourse = async () => {
            let { data, error } = await supabase
                .from('assignment')
                .select('*')
                .eq('classroom_id', id);
    
            if (error) console.error(error);
            else setAssignments(data);
        };
    
        fetchCourse();
    }, [id]);

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
                className="mb-10 mt-5 bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-3xl"
            >
                Back
            </button>            
            <h2 className="text-4xl font-semibold text-gray-800">{course[0].course_code} - {course[0].course_name}</h2>
            <p className="pt-5 text-lg text-justify text-gray-600">{course[0].course_desc}</p>
        
            {/* Display other course details here */}
            <div className="mt-5 p-5 bg-white rounded shadow-sm">
                <h3 className="text-2xl font-semibold text-gray-800">Assignments</h3>
                {assignments.map((assignment, index) => (
                    <div key={index} className="mt-3 p-4 border rounded shadow-sm relative bg-white overflow-hidden hover:shadow-md rounded-lg">
                        <Link to={`/studassignment/${assignment.assign_id}`}>
                            <div>
                                <h2 className="hover:text-cyan-950 text-gray-800 text-xl font-bold">{assignment.title}</h2>
                            </div>
                        </Link>
                        <p className="text-gray-600">Start date: {new Date(assignment.start_date).toLocaleDateString()}</p>
                        <p className="text-gray-600">End date: {new Date(assignment.end_date).toLocaleDateString()}</p>
                        {/* Display other assignment details here */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EnrolledCourseDetails;