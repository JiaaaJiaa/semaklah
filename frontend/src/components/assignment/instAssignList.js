import { PlusIcon } from '@heroicons/react/20/solid';
import React, { useState, useEffect } from 'react';
import { AcademicCapIcon, PencilAltIcon,TrashIcon } from '@heroicons/react/solid';
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';

import UpdateAssignment from './updateAssignment';
import CreateAssignment from './createAssignment';
import GradingRubrics from '../grading/gradingrubric';
import Loading from '../../pages/loading';


const InstAssignList = ({classroomId}) => {

    const [showCreate, setShowCreate] = useState(false);  
    const [assignment, setAssignment] = useState([]); 
    const [showUpdate, setShowUpdate] = useState(false);
    const [assignIdToUpdate, setAssignIdToUpdate] = useState(null);
    const [showGrading, setShowGrading] = useState(false);

    // const [loading, setLoading] = useState(false);

    function handleUpdateClick(assignment) {
        setAssignIdToUpdate(assignment);
        setShowUpdate(true);
    }

    function handleGradingClick(assignment){
        setAssignIdToUpdate(assignment);
        setShowGrading(true);
    }

    function handleDelete(assign_id) {
        fetch(`/api/assignment/${assign_id}`, {
            method: 'DELETE',
        })
        .then((res) => {
            if (res.ok) {
                // Filter out the deleted assignment
                // console.log("Second Check assignment:",assignment)
                const updatedAssignments = assignment.filter((assign) => assign.assign_id !== assign_id);
                // Update the state
                setAssignment(updatedAssignments);

                toast.success('Assignment deleted', {
                    autoClose: 2000 // closes after 2000ms, i.e., 2 seconds
                });
            }
        })
        .catch((error) => {
            console.error('There was a problem deleting the assignment: ', error);
        });
    }
    
    // Fetch all assignment
    useEffect(() => {
        // console.log('Running useEffect hook with id: ', classroomId);

        const fetchAssignments = async () => {
            const res = await fetch(`/api/assignment?classroomId=${classroomId}`);
            const json = await res.json();

            if (res.ok) {
                json.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
                setAssignment(json);         
            }     
        }
         
        fetchAssignments();
    }, [classroomId]);

    if (!assignment) {
        return <div><Loading /></div>;
    }

    return ( 
        <div>
            <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Assignment List:</h3>
                <button 
                    className="text-sm bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-3xl flex items-center"
                    onClick={() => setShowCreate(true)}
                >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Create Assignment
                </button>
            </div>

            <div className="space-y-4">
                {assignment && assignment.map((assignment) => (

                    <div key={assignment.assign_id} className={`p-4 border-2 rounded hover:shadow-sm flex flex-col ${
                        (new Date() > new Date(assignment.start_date) && new Date() < new Date(assignment.end_date)) ? 'border-blue-500' :
                        (assignment.is_released === true) ? 'border-green-500' :
                        'border-red-500'
                    }`}>                            
                       <div className="flex justify-between items-start">
                                <Link to={`/assignment/${assignment.assign_id}`}>
                                    <div>
                                        <h2 className="hover:text-cyan-950 text-gray-800 text-xl font-bold">
                                            {assignment.title}
                                            {
                                                new Date() > new Date(assignment.start_date) && new Date() < new Date(assignment.end_date) ?
                                                <span className="inline-block bg-blue-500 text-white text-sm px-2 rounded-full uppercase font-semibold tracking-wide ml-2">Ongoing</span>
                                                :
                                                assignment.is_released === true ?
                                                <span className="inline-block bg-green-500 text-white text-sm px-2 rounded-full uppercase font-semibold tracking-wide ml-2">Graded</span>
                                                :
                                                <span className="inline-block bg-red-500 text-white text-sm px-2 rounded-full uppercase font-semibold tracking-wide ml-2">Grading</span>
                                            }
                                        </h2>
                                    </div>
                                </Link>
                                <div className="flex flex-col">
                                    <div className="flex">
                                        <button 
                                            className="top-2 right-2 font-bold py-1 px-2 rounded flex items-center"
                                            onClick={() => handleGradingClick(assignment)}
                                        >
                                            <AcademicCapIcon className="h-6 w-6 hover:text-cyan-950 text-gray-500" />
                                        </button>
                                        <button 
                                            className="top-2 right-2 font-bold py-1 px-2 rounded flex items-center"
                                            onClick={() => handleUpdateClick(assignment)}
                                        >
                                            <PencilAltIcon className="h-6 w-6 hover:text-cyan-950 text-gray-500" />
                                        </button>
                                        <button onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this item?')) {
                                                handleDelete(assignment.assign_id);
                                            }
                                        }}>
                                            <TrashIcon className="h-6 w-6 hover:text-red-500 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-600">Start date: {new Date(assignment.start_date).toLocaleDateString()}</p>
                                    <p className="text-gray-600">End date: {new Date(assignment.end_date).toLocaleDateString()}</p>
                                </div>
                                <Link to={`/viewsubmission/${assignment.assign_id}`}>
                                    <button 
                                        className="top-2 right-2 text-xs text-cyan-700 font-bold py-1 px-2 border border-cyan-700 rounded-3xl flex items-center hover:shadow-sm hover:bg-cyan-500 hover:border-cyan-500 hover:text-white"
                                    >
                                        <p>View Submission</p>
                                    </button>                                     
                                </Link>
                            </div>

                        </div>

                ))}
            </div>

        {/* Create Classroom */}
        {showCreate && (
            <div className="fixed z-10 inset-0 overflow-y-auto mt-16" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                Create Assignment
                            </h3>
                            <div className="mt-2">
                                <CreateAssignment classroomId={classroomId} setShowCreate={setShowCreate} setAssignment={setAssignment}/>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="button" className="mt-3 w-full inline-flex justify-center rounded-3xl border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setShowCreate(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Update Classroom */}
        {showUpdate && (
            <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                Update Assignment
                            </h3>
                            <UpdateAssignment classroomId={classroomId} setShowUpdate={setShowUpdate} assignment={assignIdToUpdate} setAssignment={setAssignment}/>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="button" className="mt-3 w-full inline-flex justify-center rounded-3xl border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setShowUpdate(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        
        {/* Grading */}
        {showGrading && (
            <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                Grading Rubrics
                            </h3>
                            <GradingRubrics assignment={assignIdToUpdate}/>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="button" className="mt-3 w-full inline-flex justify-center rounded-3xl border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setShowGrading(false)}>
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