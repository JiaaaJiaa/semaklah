import React, { useState} from 'react';
// import { useAuthContext } from '../hooks/useAuthContext';
// import { useNavigate } from 'react-router-dom';
import { useClassroomContext } from '../hooks/useClassroomContext';


const EnrolStud = ({setShowModal, classroom_id}) => {

    // Key in student ID
    // Grab to classroom ID, probably pass it from the previous page
    // Send post request
    // If successful, dispatch the action to update the state
    // If not, display an error message

    const [student_id, setStudentId] = useState(null);
    const [error, setError] = useState(null);

    const { dispatch}=useClassroomContext();

    const handleInputChange = (event) => {
        setStudentId(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const response = await fetch(`/api/studentEnrol`, {
                method: 'POST',
                body: JSON.stringify({stud_id: student_id, classroom_id: classroom_id}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const json = await response.json();

            // console.log("FRONT:", json);

            if(json.error){
                setError(json.error);
                throw new Error(json.error);
            }

            if (response.ok){
                // If the API call was successful, dispatch the action to update your state
                //dispatch({type: 'ADD_CLASSROOM', payload: json});
                dispatch({type: 'ENROL_STUDENT', payload: json})
                alert("Student enrolled successfully");
                setShowModal(false);
            }
        } catch (error) {
            console.error('There was a problem with the enrolment request.', error);
            setError(error.message);
        }
    }


    return ( 

        <div className="p-4">
            <div>
                <form onSubmit={handleSubmit} className="flex flex-col w-64">
                    <label className="mb-2">
                        Enter Student ID:
                    </label>
                    <div className="flex justify-between">
                        <input type="text" value={student_id || ""} onChange={handleInputChange} className="w-full p-2  mt-1 border rounded" />
                        <input type="submit" value="Enrol" className="p-2 mx-3 mt-2 cursor-pointer bg-green-500 text-white border-none rounded " />
                    </div>
                    
                </form>
            </div>

            {error && <p className="text-red-500 font-bold">{error}</p>}
        </div>
    
     );
}
 
export default EnrolStud;