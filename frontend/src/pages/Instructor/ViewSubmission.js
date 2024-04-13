import { useState,useEffect } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import Loading from '../../pages/loading';
// import { Document, Page } from 'react-pdf';
import supabase from '../../config/supabaseClient';


const ViewSubmission = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState([]);

    const handleBack = () => {
        navigate(-1);
    }

    // Fetch data from database
    useEffect(()=>{
        fetch(`/api/assignment/${id}`)
            .then(response => response.json())
            .then(data => setAssignment(data))
            .catch(error => console.error(error));
    
    },[id])


    if (!assignment) {
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
                <p> 
                <h2 className="text-3xl font-semibold text-gray-800">{assignment.title}</h2>
                </p>
            </div>

            <div className="mb-5 bg-white shadow overflow-hidden sm:rounded-lg p-10">
                <p className="text-xl font-semibold text-gray-800">
                    Submission Status
                </p>            
            </div>

            <div className="mb-5 bg-white shadow overflow-hidden sm:rounded-lg p-10">
                <p className="text-xl font-semibold text-gray-800">
                    Submission List
                </p>
            </div>
           
        </div>
    );
}
 
export default ViewSubmission;

// Basic info for the assignment

// Show assignment viewer

// Assignment Rubric