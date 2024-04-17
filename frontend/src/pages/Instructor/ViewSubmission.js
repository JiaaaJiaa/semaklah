import { useState,useEffect } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import Loading from '../../pages/loading';
// import { Document, Page } from 'react-pdf';
// import supabase from '../../config/supabaseClient';
import InstrSubmissionStatus from '../../components/submission/InstrSubmissionStatus';
import StudSubmissionList from '../../components/submission/studSubmissionList';


const ViewSubmission = () => {

    // Assignment id
    const {id} = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleBack = () => {
        navigate(-1);
    }

    // Fetch data from database
    useEffect(()=>{
        fetch(`/api/assignment/${id}`)
            .then(response => response.json())
            .then(data => {
                setAssignment(data);

                // Get classroom id from assignment id
                // Get list of student with their enrol id
                fetch(`/api/studentEnrol/${data.classroom_id}`)
                    .then(response => response.json())
                    .then(studentData => {
                        // console.log("Data from db",studentData);
                        // const students = studentData.map(item => item.student); // Extract student objects
                        setStudents(studentData); // Store student objects in state
                        setLoading(false); // Set loading to false after students data has been set
                    })
                    .catch(error => console.error(error));
                
                
            })
            .catch(error => console.error(error));       
    },[id])

    
    // from Assignment id, get classroom id, get list of student with their enrol id
    // compare the enrol id with the submission table, if the enrol id is not in the submission table, means the student has not submitted
    // if the enrol id is in the submission table, get the submission id, get the submission file



    if (!loading && !assignment && !students) {
        return <div><Loading /></div>;
    }

    return (  
        <div className="p-20">
            <div className="pb-10">
                    <button 
                    onClick={handleBack} 
                    className="mb-10 mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Back
                </button>
                
                <h2 className="text-3xl font-semibold text-gray-800">{assignment.title}</h2>
                
            </div>

            <div className="mb-5 bg-white shadow overflow-hidden sm:rounded-lg p-10">
                <p className="text-xl font-semibold text-gray-800">
                    Submission Status
                </p>       
                <InstrSubmissionStatus />     
            </div>

            <div className="mb-5 bg-white shadow overflow-hidden sm:rounded-lg p-10">
                <p className="text-xl font-semibold text-gray-800">
                    Submission List
                </p>
            
                <StudSubmissionList students={students}/>
            </div>
           
        </div>
    );
}
 
export default ViewSubmission;

// Basic info for the assignment

// Show assignment viewer

// Assignment Rubric