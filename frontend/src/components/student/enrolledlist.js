// FOR STUDENTS

import { Link } from 'react-router-dom';
import { useState } from 'react';
import JoinClassroom from './joinclassroom';
// import { useAuthContext } from '../hooks/useAuthContext';

const EnrolledList = ({enrolledClassrooms}) => {

    const [showModal, setShowModal] = useState(false);

    // const {user} = useAuthContext();

    return ( 
        <div>
             {enrolledClassrooms && enrolledClassrooms.classroom && (
            <div className="p-5 mx-20 mt-2 mb-2 bg-white shadow-sm rounded-lg flex justify-between" >
                <div>
                    <Link to={`/enrolledcourse/${enrolledClassrooms.classroom.classroom_id}`}>
                        <h2 className="text-2xl font-semibold text-gray-800">{enrolledClassrooms.classroom.course_code} - {enrolledClassrooms.classroom.course_name}</h2>
                    </Link>
                    {/* <p className="mt-2 text-gray-600">{enrolledClassrooms.inst_id}</p> */}
                </div>
            </div> 
             )}

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
                                    <JoinClassroom setShowModal={setShowModal} />
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
 
export default EnrolledList;