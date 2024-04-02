import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipboardCopyIcon, TrashIcon, PlusIcon } from '@heroicons/react/solid';
import EnrolStud from '../components/enrolstud';
import { useClassroomContext } from '../hooks/useClassroomContext';


const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);

    // Add a new state variable for the enrolledStudents

    const [showModal, setShowModal] = useState(false);

    const {enrolledStudents, dispatch}=useClassroomContext();

    // console.log(id);

    const navigate = useNavigate();

    const [token, setToken] = useState(null);

    // Fetch the enrolledStudents in the useEffect hook
    useEffect(() => {
        const fetchStudents = async () => {
            const res = await fetch(`/api/studentEnrol/${id}`);
            const json = await res.json();

            if (res.ok){
                dispatch({type: 'GET_ENROL_STUDENT', payload: json});
            } 
        }

        fetchStudents();
    }, [dispatch]);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        if (storedToken) {
            setToken(JSON.parse(storedToken));
        }
    }, []);

    // CHANGE THIS TO USE THE CONTEXT
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

    const handleDelete = (student) => {

        // console.log(student.student.stud_id);
        // console.log(student);
        // console.log(enrolledStudents[0]);

        fetch(`/api/studentEnrol/`, {
            method: 'DELETE',
            body: JSON.stringify({stud_id: student.student.stud_id, classroom_id: id}),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // console.log('Success:', data[0]);
            dispatch({type: 'REMOVE_ENROL_STUDENT', payload: student});
        })
        .catch(error => console.error(error));
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

                <p className="pt-5 pb-5 text-lg text-justify text-gray-600">{course[0].course_desc}</p>

                <div className="mb-5 bg-white shadow overflow-hidden sm:rounded-lg p-10">
                    <h2>Assignment list</h2>
                </div>
                
                {/* Add the list of enrolledStudents in the return statement */}
                <div className="pt-10 bg-white shadow overflow-hidden sm:rounded-lg p-10">
                <div>
                <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Student List:</h3>
                    <button 
                        className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl flex items-center"
                        onClick={() => setShowModal(true)}>
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Enrol student
                    </button>
                </div>
                                    
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th className="bg-cyan-50 border px-4 py-2">First Name</th>
                                <th className="bg-cyan-50 border px-4 py-2">Last Name</th>
                                <th className="bg-cyan-50 border px-4 py-2">Email</th>
                                <th className="bg-cyan-50 border px-4 py-2">Student ID</th>
                                <th className="bg-cyan-50 border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrolledStudents && enrolledStudents.map((student, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">{student.student && student.student.stud_fname}</td>
                                    <td className="border px-4 py-2">{student.student && student.student.stud_lname}</td>
                                    <td className="border px-4 py-2">{student.student && student.student.stud_email}</td>
                                    <td className="border px-4 py-2">{student.student && student.student.stud_id}</td>
                                    <td className="border px-4 py-2">
                                        <button onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this student?')) {
                                                handleDelete(student);
                                            }
                                        }}>
                                            <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-700 ml-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

                {/* Create Classroom */}
                {showModal && (
                    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        Create Classroom
                                    </h3>
                                    <div className="mt-2">
                                        <EnrolStud setShowModal={setShowModal} classroom_id={course[0].classroom_id}/>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setShowModal(false)}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </div>

        
    );
};

export default CourseDetails;