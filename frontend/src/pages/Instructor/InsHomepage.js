import React, { useState, useEffect } from 'react';
import Classroomlist from '../../components/classroom/classroomlist';
import CreateClassroom from '../../components/classroom/createclassroom';
import { useClassroomContext } from '../../hooks/useClassroomContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { PlusIcon } from '@heroicons/react/solid';
import Loading from '../loading';

const InsHomepage = ({token}) => {

    // console.log("Rendering homepage")
    
    const {classroom, dispatch}=useClassroomContext();
    const [showModal, setShowModal] = useState(false);

    const {user} = useAuthContext();
    // console.log{user.user.user_metadata.id};

    useEffect(() => {
        const fetchClassroom = async () => {
            const res = await fetch(`/api/classroom?userId=${user.user.user_metadata.id}`,{
                headers: {
                    "Authorization": `Bearer ${user.session.access_token}`
                }
            });
            const json = await res.json();

            if (res.ok){
                dispatch({type: 'GET_CLASSROOM', payload: json});
            }
        }

        if(user){
            fetchClassroom();
            // console.log(user.session.access_token);
        }

    },[dispatch, user]);

    if(!classroom){
        return <div><Loading /></div>
    }

    return ( 
        <div className='pt-16 p-10'>
            <h1 className='p-5 text-2xl  text-center  font-bold '>
            Hello Instructor, {token.user.user_metadata.fname} {token.user.user_metadata.lname}</h1>
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <h1 className="flex-1 sm:item-stretch text-2xl font-bold px-20 py-5">Classroom</h1>
                    <button 
                        className="mx-20 mb-5 text-sm bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-3xl flex items-center"
                        onClick={() => setShowModal(true)}
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Create Classroom
                    </button>
                </div>

                {classroom && classroom.map((classroom) => (
                    <div key={classroom._id}>
                        <Classroomlist classroom={classroom}/> 
                    </div>
                ))}
            </div>
            
            {/* Create Classroom */}
            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-10 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Create Classroom
                                </h3>
                                <div className="mt-2">
                                    <CreateClassroom setShowModal={setShowModal} token={token} />
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

export default InsHomepage;