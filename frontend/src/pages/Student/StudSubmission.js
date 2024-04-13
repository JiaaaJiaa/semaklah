import { useState,useEffect } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import Loading from '../../pages/loading';
// import { Document, Page } from 'react-pdf';
import supabase from '../../config/supabaseClient';


const StudSubmission = () => {
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
                <div>
                    <hr />
                        <p className="pt-2 text-md font-semibold text-gray-800">
                            Start Date : {new Date(assignment.start_date).toLocaleString('en-GB', { hour12: true })}
                        </p>
                        <p className="pt-2 pb-2 text-md font-semibold text-gray-800">
                            End Date : {new Date(assignment.end_date).toLocaleString('en-GB', { hour12: true })}
                        </p>
                    <hr />  
                </div>
                <div>   
                    <div className="flex">
                        <p className="pt-2 text-xl font-semibold text-gray-800">
                            Instruction
                        </p>
                        <a href={`https://aypezrkfwwhjkbtreitl.supabase.co/storage/v1/object/public/assignment/${assignment.file}`} download
                            className="px-2 pt-2">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-3xl">
                                Download File
                            </button>
                        </a>
                    </div>

                    <p className="pt-2 text-md text-gray-800">
                        {assignment.instruc}
                    </p>                
                </div>
            </div>

            <div className="mb-5 bg-white shadow overflow-hidden sm:rounded-lg p-10">
                <p className="text-xl font-semibold text-gray-800">
                    Submission Status
                </p>            
            </div>

            <div className="mb-5 bg-white shadow overflow-hidden sm:rounded-lg p-10">
                <p className="text-xl font-semibold text-gray-800">
                    File Submission
                </p>
            </div>
           
        </div>
    );
}

export default StudSubmission;
