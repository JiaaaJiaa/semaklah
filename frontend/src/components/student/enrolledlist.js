// FOR STUDENTS

import { Link } from 'react-router-dom';
// import { useAuthContext } from '../hooks/useAuthContext';

const EnrolledList = ({enrolledClassrooms}) => {

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
        </div>    
     );
}
 
export default EnrolledList;