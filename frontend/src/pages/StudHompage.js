import React, {useState,useEffect} from 'react';
import EnrolledList from '../components/student/enrolledlist';
import JoinClassroom from '../components/student/joinclassroom';
import { PlusIcon } from '@heroicons/react/solid';
import { useAuthContext } from '../hooks/useAuthContext';
import { useClassroomContext } from '../hooks/useClassroomContext';


const StudHomepage = ({token}) => {


    const {enrolledClassrooms, dispatch}=useClassroomContext();
    const [showModal, setShowModal] = useState(false);

    const {user} = useAuthContext();
    // console.log(user.user.user_metadata.id);

    useEffect(() => {
        const fetchEnrolledClassrooms = async () => {
            const res = await fetch(`/api/enrol?userId=${user.user.user_metadata.id}`,{
                headers: {
                    "Authorization": `Bearer ${user.session.access_token}`
                }
            });
            const json = await res.json();

            // console.log(json);

            if (res.ok){
                dispatch({type: 'GET_ENROLLED_CLASSROOMS', payload: json});
            }

        }

        if(user){
            fetchEnrolledClassrooms();
        }
    },[dispatch, user]);



    return ( 
       <div className='pt-16 p-10'>
            <h1 className='p-5 text-2xl  text-center  font-bold '>
            Hello Student, {token.user.user_metadata.fname} {token.user.user_metadata.lname}</h1>
            <div>
                <div className="flex justify-between">
                    <h1 className="flex-1 sm:item-stretch text-2xl font-bold px-20 py-5">Classroom</h1>
                    <button 
                        className="mx-20 mb-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center"
                        onClick={() => setShowModal(true)}
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Join a Classroom
                    </button>
                </div>

                {enrolledClassrooms && enrolledClassrooms.map((enrolledClassrooms) => (
                    <EnrolledList enrolledClassrooms={enrolledClassrooms} key={enrolledClassrooms.enrol_id} />
                ))}
            </div>
            
            {/* Join a Classroom */}
            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Join Classroom
                                </h3>
                                <div className="mt-2">
                                    <JoinClassroom  setShowModal={setShowModal}/>
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
export default StudHomepage;