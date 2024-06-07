import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipboardCopyIcon } from '@heroicons/react/solid';
// import EnrolStud from '../components/enrolstud';
// import { useClassroomContext } from '../hooks/useClassroomContext';
// import CreateAssignment from '../components/assignment/createAssignment';
import InstAssignList from '../../components/assignment/instAssignList';
import Enrolledstudentlist from '../../components/enrolledstudent/enrolledstudlist';
import Loading from '../loading';


const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const navigate = useNavigate();

    const [token, setToken] = useState(null);
    // const [loading, setLoading] = useState(true);

    // console.log('Rendering CourseDetails component');

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        if (storedToken) {
            setToken(JSON.parse(storedToken));
        }

        // console.log("Updating Token state")
    }, []);

    useEffect(() => {
        // Replace this with the actual URL of your API
        fetch(`/api/classroom/${id}`)
            .then(response => response.json())
            .then(data => setCourse(data))
            .catch(error => console.error(error));

        // console.log("Updaating course state")
    }, [id]);

    if (!course) {
        return <div><Loading/></div>;
    }

    return (
        <div className="p-20">


            <div>
                <button 
                    onClick={() => navigate(token && token.user.user_metadata.role === 'instructor' ? `/InsHomepage/${token.user.user_metadata.id}` : `/StudHomepage/${token.user.user_metadata.id}`)}
                    className="mb-10 mt-5 bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-3xl"
                >
                    Back
                </button> 
                         
                <h2 className="text-4xl font-semibold text-gray-800">{course[0].course_code} - {course[0].course_name}</h2>
                
                <p className="pt-5" onClick={() => navigator.clipboard.writeText(course[0].classroom_id)}>
                    <strong>Class Token:</strong> {course[0].classroom_id}
                    <ClipboardCopyIcon className="h-5 w-5 inline-block ml-2" />
                </p>

                <p className="pt-5 pb-5 text-lg text-justify text-gray-600">{course[0].course_desc}</p>
             
            </div>

            {/* ASSIGNMENTS */}

            <div className="mb-5 bg-white shadow overflow-hidden sm:rounded-lg p-10">
                <div>
                    <InstAssignList classroomId={id}/>
                </div>                  
            </div>
                
                {/* STUDENTS */}
                
            {/* Add the list of enrolledStudents in the return statement */}
            <div className="pt-10 bg-white shadow overflow-hidden sm:rounded-lg p-10">
                <Enrolledstudentlist classroomId={id} course={course} />
            </div>

        </div>       
    );
};

export default CourseDetails;