import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import { ClassroomContext } from '../../context/ClassroomContext';
import UpdateClassroom from './updateclassroom';
import { useAuthContext } from '../../hooks/useAuthContext';



const Classroomlist = ({classroom}) => {

    const {dispatch} = useContext(ClassroomContext);
    const [showModal, setShowModal] = useState(false);

    const {user} = useAuthContext();
    
    const handleDelete = async () => {
        // console.log("Delete "+ classroom.classroom_id);

        if(!user){
            alert('Please login to delete classroom');
            return;
        }

        // Call your API to delete the classroom from the database
        try {
            const response = await fetch(`/api/classroom/${classroom.classroom_id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${user.session.access_token}`
                }
            });
            const json = await response.json();
            // console.log(json)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (response.ok){
                // If the API call was successful, dispatch the action to update your state
                dispatch({type: 'REMOVE_CLASSROOM', payload: json});
            }
        } catch (error) {
            console.error('There was a problem with the delete request.', error);
        }
    }


    return ( 
        <div>
            <div className="p-5 mx-20 mt-2 mb-2 bg-white shadow-sm rounded-lg flex justify-between" key={classroom.id}>
                <div>
                    <Link to={`/course/${classroom.classroom_id}`}>
                        <h2 className="text-2xl font-semibold text-gray-800">{classroom.course_code} - {classroom.course_name}</h2>
                        <p className="pt-2">Number of students: {classroom.current_enrolment}/{classroom.classroom_limit}</p>
                    </Link>
                    {/* <p className="mt-2 text-gray-600">{classroom.inst_id}</p> */}
                </div>
                <div>
                <button onClick={() => setShowModal(true)}>
                    <PencilAltIcon className="h-5 w-5 text-gray-500" />
                </button>
                <button onClick={() => {
                    if (window.confirm('Are you sure you want to delete this item?')) {
                        handleDelete();
                    }
                }}>
                    <TrashIcon className="h-5 w-5 text-gray-500" />
                </button>
                </div>
            </div> 

            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Edit Classroom
                                </h3>
                                <div className="mt-2">
                                    <UpdateClassroom setShowModal={setShowModal} classroom={classroom} />
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
}

export default Classroomlist;