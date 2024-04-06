import { PlusIcon } from '@heroicons/react/20/solid';
import React, { useState, useEffect } from 'react';
import CreateAssignment from './createAssignment';
// import supabase from '../../config/supabaseClient';
import { PencilAltIcon } from '@heroicons/react/solid';
import { useClassroomContext } from '../../hooks/useClassroomContext';

const InstAssignList = ({classroomId}) => {

    const {assignment, dispatch} = useClassroomContext();
    const [showModal, setShowModal] = useState(false);    

    //Get all assignment
    useEffect(() => {
        const fetchAssignments = async () => {
            const res = await fetch(`/api/assignment/${classroomId}`);
            const json = await res.json();

            // console.log("JSON",json);

            if (res.ok) {
                dispatch({ type: 'GET_ASSIGNMENT', payload: json });
            }
            // console.log("ASSIGN",assignment);
        }
        
        fetchAssignments();
    }, [dispatch, classroomId]);

    const handleEdit = (id) => {
        console.log('Edit assignment with id: ', id);
    };
    

    return ( 
        <div>
        <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Assignment List:</h3>
            <button 
                className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl flex items-center"
                onClick={() => setShowModal(true)}
            >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Assignment
            </button>
        </div>

        <div className="space-y-4">
            {assignment && assignment.map((assignment) => (
                <div key={assignment.assign_id} className="p-4 border rounded shadow-sm hover:shadow-md flex flex-col">
                    <div className="flex justify-between items-start">
                        <h2 className="text-xl font-bold">{assignment.title}</h2>
                        <button 
                            className="top-2 right-2 text-grey-800 font-bold py-1 px-2 rounded flex items-center"
                            onClick={() => handleEdit(assignment.assign_id)}
                        >
                            <PencilAltIcon className="h-5 w-5 mr-2" />
                        </button>
                    </div>
                    <p className="text-gray-600">Start date: {new Date(assignment.start_date).toLocaleDateString()}</p>
                    <p className="text-gray-600">End date: {new Date(assignment.end_date).toLocaleDateString()}</p>

                </div>
            ))}
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
                                    Create Assignment
                                </h3>
                                <CreateAssignment classroomId={classroomId} setShowModal={setShowModal}/>
                                {/* Link to create Assignment componenet */}
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
 
export default InstAssignList;