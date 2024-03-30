import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import { ClassroomContext } from '../context/ClassroomContext';

const Classroomlist = ({classroom}) => {

    const {dispatch} = useContext(ClassroomContext);

    const handleEdit = (classroom_id) => {
        console.log("Edit "+ classroom_id);
    }

    const handleDelete = async () => {
        // console.log("Delete "+ classroom.classroom_id);

        // Call your API to delete the classroom from the database
        try {
            const response = await fetch(`/api/classroom/${classroom.classroom_id}`, {
                method: 'DELETE',
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
        <div className="p-5 mx-20 mt-2 mb-2 bg-white shadow-sm rounded-lg flex justify-between" key={classroom.id}>
            <div>
                <h2 className="text-2xl font-semibold text-gray-800">{classroom.course_code} - {classroom.course_name}</h2>
                <p className="mt-2 text-gray-600">{classroom.classroom_id}</p>
            </div>
            <div>
            <button onClick={() => handleEdit(classroom.classroom_id)}>
                <PencilAltIcon className="h-5 w-5 text-gray-500" />
            </button>
            <button onClick={handleDelete}>
                <TrashIcon className="h-5 w-5 text-gray-500" />
            </button>
            </div>
        </div>     
           
    );
}

export default Classroomlist;