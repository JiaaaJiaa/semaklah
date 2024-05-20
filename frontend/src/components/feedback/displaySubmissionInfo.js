import React, {useState,useEffect} from 'react';


const DisplaySubmissionInfo = ({submission}) => {

    const [student, setStudent] = useState([])

    // Get student name and submission time from submission object
    useEffect(() => {
        if(submission.enrol_id){        
            fetch(`/api/studentEnrol/feedback/${submission.enrol_id}`)
            .then(response => response.json())
            .then(student => {
                setStudent(student.student);
            })
            .catch(error => console.error(error));
        }
    }, [submission]);

    return ( 
        <div>
            <p ><strong>Name:</strong></p>
            <p className="mb-4"> {student.stud_fname} {student.stud_lname}</p>
            <p ><strong>Matric Number:</strong></p>
            <p className="mb-4"> {student.stud_id}</p>
            <p ><strong>Submission Time:</strong></p>  
            <p className="mb-6"> {new Date(submission.created_at).toLocaleString()}</p>      
        </div>

     );
}
 
export default DisplaySubmissionInfo;