import { PlusIcon } from '@heroicons/react/20/solid';
import React, { useState, useEffect } from 'react';
import supabase from '../../config/supabaseClient';
import { PencilAltIcon } from '@heroicons/react/solid';

const CreateAssignment = ({classroomId}) => {
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [file, setFile] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [assignments, setAssignments] = useState([]);
    const [edit, setEdit] = useState(false);

    // Save the selected file in a state variable
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // Upload the file and insert a new assignment in the handleSubmit function
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Upload the file
        const filePath = `assignments/${Date.now()}-${file.name}`;
        let { error: uploadError } = await supabase.storage.from('assignment').upload(filePath, file);
        if (uploadError) {
            console.error('Error uploading file: ', uploadError);
            return;
        }

        // Insert a new assignment
        const { data, error } = await supabase
            .from('assignment')
            .insert([
                { 
                    title: title, 
                    desc: description, 
                    instruc: instructions, 
                    file: filePath, 
                    start_date: startDate, 
                    end_date: endDate, 
                    classroom_id: classroomId 
                },
            
            ])
            .select('*');

        if (error) {
            console.error('Error: ', error);
        } else {
            console.log('Assignment created: ', data);
            setShowModal(false);
            setAssignments(prevAssignments => [...prevAssignments, data[0]]);
        }
    };

    useEffect(() => {
        const fetchAssignments = async () => {
            const { data, error } = await supabase
                .from('assignment')
                .select('*')
                .eq('classroom_id', classroomId)
    
            if (error) {
                console.error('Error fetching assignments: ', error);
            } else {
                setAssignments(data);
            }
        };
    
        fetchAssignments();
    }, []);
        
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
                {assignments.map((assignment) => (
                    <div key={assignment.assign_id} className="p-4 border rounded shadow-sm relative">
                        <h2 className="text-xl font-bold">{assignment.title}</h2>
                        <p className="text-gray-600">Start date: {new Date(assignment.start_date).toLocaleDateString()}</p>
                        <p className="text-gray-600">End date: {new Date(assignment.end_date).toLocaleDateString()}</p>
                        <button 
                            className="absolute top-2 right-2 text-grey-800 font-bold py-1 px-2 rounded flex items-center"
                            onClick={() => handleEdit(assignment.assign_id)}
                        >
                            <PencilAltIcon className="h-5 w-5 mr-2" />
                        </button>
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
                                    <div className="mt-2">
                                        {/* <EnrolStud setShowModal={setShowModal} classroom_id={course[0].classroom_id}/> */}
                                        <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md mx-auto space-y-4">
                                            <label className="flex flex-col space-y-1">
                                                <span>Title:</span>
                                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="px-3 py-2 border rounded" />
                                            </label>
                                            <label className="flex flex-col space-y-1">
                                                <span>Description:</span>
                                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="px-3 py-2 border rounded" />
                                            </label>
                                            <label className="flex flex-col space-y-1">
                                                <span>Instructions:</span>
                                                <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} className="px-3 py-2 border rounded" />
                                            </label>
                                            <label className="flex flex-col space-y-1">
                                                <span>File:</span>
                                                <input type="file" onChange={handleFileChange} accept=".pdf" className="px-3 py-2 border rounded" />
                                            </label>
                                            <label className="flex flex-col space-y-1">
                                                <span>Start Date:</span>
                                                <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-2 border rounded" />
                                            </label>
                                            <label className="flex flex-col space-y-1">
                                                <span>End Date:</span>
                                                <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-2 border rounded" />
                                            </label>
                                            {/* <label className="flex flex-col space-y-1">
                                                <span>Classroom ID:</span>
                                                <input type="text" value={classroomId} onChange={(e) => setClassroomId(e.target.value)} className="px-3 py-2 border rounded" />
                                            </label> */}
                                            <input type="submit" value="Create Assignment" className="px-3 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600" />
                                        </form>
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
 
export default CreateAssignment;