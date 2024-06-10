import { TrashIcon, PlusIcon} from '@heroicons/react/solid';
import { useEffect, useState } from 'react';
import EnrolStud from './enrolstud';
import { toast } from 'react-toastify';


const Enrolledstudentlist = ({classroomId,course}) => {

    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    // const [course, setCourse] = useState(null);

    const handleDelete = (student) => {

        fetch(`/api/studentEnrol/`, {
            method: 'DELETE',
            body: JSON.stringify({stud_id: student.student.stud_id, classroom_id: classroomId}),
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
            // dispatch({type: 'REMOVE_ENROL_STUDENT', payload: student});
            // console.log("Student removed:", enrolledStudents);
            setEnrolledStudents(enrolledStudents.filter((stud) => stud.student.stud_id !== student.student.stud_id));
            toast.success('Student removed successfully', {
                autoClose: 2000 // closes after 2000ms, i.e., 2 seconds
              });
        })
        .catch(error => console.error(error));
    }

      // Fetch the enrolledStudents in the useEffect hook
      useEffect(() => {
        const fetchStudents = async () => {
            const res = await fetch(`/api/studentEnrol/${classroomId}`);
            const json = await res.json();

            if (res.ok){
                // dispatch({type: 'GET_ENROL_STUDENT', payload: json});
                setEnrolledStudents(json);
            } 
        }

        fetchStudents();
    }, [classroomId]);
    

    return ( 
        <div>
           <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Student List:</h3>
                <button 
                    className="text-sm bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-3xl flex items-center"
                    onClick={() => setShowModal(true)}>
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Enrol student
                </button>
            </div>

            <div>
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className="bg-cyan-50 border px-4 py-2">First Name</th>
                            <th className="bg-cyan-50 border px-4 py-2">Last Name</th>
                            <th className="bg-cyan-50 border px-4 py-2">Email</th>
                            <th className="bg-cyan-50 border px-4 py-2">Student ID</th>
                            <th className="bg-cyan-50 border px-4 py-2 w-28">Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrolledStudents && enrolledStudents.map((student, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{student.student && student.student.stud_fname}</td>
                                <td className="border px-4 py-2">{student.student && student.student.stud_lname}</td>
                                <td className="border px-4 py-2">{student.student && student.student.stud_email}</td>
                                <td className="border px-4 py-2 text-center">{student.student && student.student.stud_id}</td>
                                <td className="border px-4 py-2 text-center">
                                    <button onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this student?')) {
                                            handleDelete(student);
                                        }
                                    }}>
                                        <TrashIcon className="h-5 w-5 text-gray-500 hover:text-red-500" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
            </div>


            {/* ENROL STUDENT*/}
            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Enrol Student
                                </h3>
                                <div className="mt-2">
                                    <EnrolStud setShowModal={setShowModal} classroom_id={course[0].classroom_id} setEnrolledStudents={setEnrolledStudents}/>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button type="button" className="mt-3 w-full inline-flex justify-center rounded-3xl border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
     );
}
 
export default Enrolledstudentlist;