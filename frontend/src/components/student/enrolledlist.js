// FOR STUDENTS

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import { useAuthContext } from '../hooks/useAuthContext';

const EnrolledList = ({enrolledClassrooms}) => {

    // const {user} = useAuthContext();
    const [instructor, setInstructor] = useState(null);

    // console.log(enrolledClassrooms.classroom.inst_id);

    // call instructor API
    useEffect(() => {
        fetch(`/api/instructor/${enrolledClassrooms.classroom.inst_id}`)
            .then(response => response.json())
            .then(data => setInstructor(data[0]))
            .catch(error => console.error('Error:', error));
    }, []);



    return ( 
        <div>
            {enrolledClassrooms && enrolledClassrooms.classroom && (
                <div className="p-5 mx-20 mt-2 mb-2 bg-white shadow-sm rounded-lg flex justify-between" >
                    <div>
                        <Link to={`/enrolledcourse/${enrolledClassrooms.classroom.classroom_id}`}>
                            <h2 className="text-2xl font-semibold text-gray-800">{enrolledClassrooms.classroom.course_code} - {enrolledClassrooms.classroom.course_name}</h2>
                        </Link>
                        {instructor && <p className="mt-2 text-gray-600 italic">Instructor: {instructor.inst_fname} {instructor.inst_lname}</p>}
                    </div>
                </div> 
            )}
        </div>    
    );
}
 
export default EnrolledList;