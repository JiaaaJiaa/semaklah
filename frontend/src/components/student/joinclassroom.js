import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { useClassroomContext } from '../../hooks/useClassroomContext';


const JoinClassroom = ({setShowModal}) => {

    const [classroom_id, setClassroomId] = useState(null);
    const [classroom, setClassroom] = useState(null);
    const [error, setError] = useState(null)
    const {dispatch}=useClassroomContext();
    const navigate = useNavigate();

    const {user} = useAuthContext();
    // console.log(user.user.user_metadata.id);

    // Handle the form input change
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        setClassroom(null);
        setError(null);
    
        try {
            const response = await fetch(`/api/classroom/${classroom_id}`); // replace with your API endpoint
            const json = await response.json();
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
                setError('Classroom not found');
            }
    
            if (response.ok){
                // If the API call was successful, update the classroom state
                setClassroom(json[0]);
                console.log(json[0]);
            }
        } catch (error) {
            console.error('There was a problem with the classroom search request.', error);
            setError('Classroom not found');
        }
    };

    // When user clicks on join classroom, the classroom_id is passed to the create enrolment API
    const joinClassroom = async () => {
        // Call your API to create an enrolment
        try {
            const response = await fetch(`/api/enrol`, {
                method: 'POST',
                body: JSON.stringify({stud_id: user.user.user_metadata.id,classroom_id: classroom_id}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const json = await response.json();

            // console.log(json.error);

            if(json.error){
                setError(json.error);
                return;
            }else{
                setError(null);
            }

            if (response.ok){
                // If the API call was successful, dispatch the action to update your state
                // console.log("Check:", json[0]);
                dispatch({type: 'ENROL_CLASSROOM', payload: json[0]});
                setShowModal(false);
            }
        } catch (error) {
            console.error('There was a problem with the enrolment request.', error);
        }
    }
    // If the user is not logged in, redirect to login page
    if (!user) {
        navigate('/login');
    }
    const handleInputChange = (event) => {
        setClassroomId(event.target.value);
    };



    return ( 

        // Search for an available classroom based on the classroom id
        <div className="p-4">
            <div>
                <form onSubmit={handleSubmit} className="flex flex-col w-full">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Classroom ID:
                    </label>
                    <div className="flex items-center">
                        <input type="text" value={classroom_id || ""} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        <input type="submit" value="Search" className="px-4 py-2 m-2 cursor-pointer bg-cyan-500 hover:bg-cyan-700 text-white border-none rounded-3xl" />
                    </div>
                </form>
            </div>

            {/* Display the classroom details, including academic_year, classroom_id, course_name, inst_id (inst_fname, inst_lname), and classroom_limit */}

            {classroom && (
                <div className="mt-4">
                    <div className="border p-4 rounded">
                        <p className="mb-2"><strong>Academic Year:</strong> {classroom.academic_year}</p>
                        <p className="mb-2"><strong>Semester:</strong> {classroom.semester}</p>
                        <p className="mb-2"><strong>Course Code:</strong> {classroom.course_code}</p>
                        <p className="mb-2"><strong>Course Name:</strong> {classroom.course_name}</p>
                        <p className="mb-2"><strong>Instructor:</strong> {classroom.instructor.inst_fname} {classroom.instructor.inst_lname}</p>
                        {/* <p className="mb-2"><strong>Instructor ID:</strong> {classroom.inst_id}</p>
                        <p className="mb-2"><strong>Classroom Limit:</strong> {classroom.classroom_limit}</p> */}
                        <button onClick={joinClassroom} className="px-4 py-2 cursor-pointer bg-cyan-600 hover:bg-cyan-700 text-white border-none rounded-3xl">Join the classroom</button>
                    </div>
                </div>
            )}

            {error && <p className="text-red-500 font-bold">{error}</p>}
        </div>
     );
}
 
export default JoinClassroom;