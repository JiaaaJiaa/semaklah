import React, { useState,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../../config/supabaseClient';
import ShowPDF from '../../components/feedback/showPDF.tsx';
// import DisplayPDF from '../../components/feedback/displayPDF';

import DisplaySubmissionInfo from '../../components/feedback/displaySubmissionInfo';
import DisplayGrading from '../../components/feedback/displayGrading';
import DisplayLexical from '../../components/feedback/displayLexical';

const FeedbackPage = () => {

    // Submission id
    const {id} = useParams();
    const navigate = useNavigate();
    const [submission, setSubmission] = useState([]);
    const [fileURL, setFileURL] = useState(null);

    const handleBack = () => {
        navigate(-1);
    }      

    useEffect(()=>{
        fetch(`/api/submission/submission-feedback/${id}`)
            .then(response => response.json())
            .then(data => {
                setSubmission(data);
    
                const fetchFile = async () => { 
                    if (!data.file) {
                        console.error('Submission file is undefined');
                        return;
                    }

                    const { data: fileData, error: fileError } = await supabase.storage.from('assignment').download(data.file);
    
                    if (fileError) {
                        console.error('Error downloading file:', fileError.message);
                        return;
                    }
                    
                    const url = URL.createObjectURL(fileData);

                    setFileURL(url);

                    // console.log('fileData:', fileData); // Add this line
                    // console.log('fileURL:', url); // Add this line
                

                }
    
                if(data.file){
                    fetchFile();
                }
            })
            .catch(error => console.error(error));
    },[id])

    return ( 
        <div className="flex p-20">
            <div className="pt-20 fixed top-0 left-0 h-full w-75 bg-cyan-50 drop-shadow-md p-4 overflow-y-auto">
                
            <h2 className="font-bold text-xl mb-4 border-b border-gray-200 pb-2">Submission Info:</h2>
            <div className="mb-4">
                <DisplaySubmissionInfo submission={submission} />
            </div>

            <h2 className="font-bold text-xl mb-4 border-b border-gray-200 pb-2">Language Performance:</h2>
            <div className="mb-4">
                <DisplayLexical submission={submission}/>
            </div>

            <h2 className="font-bold text-xl mb-4 border-b border-gray-200 pb-2">Grading:</h2>
            <div className=" mb-4">
                <DisplayGrading submission={submission}/>
            </div>



            {/* <h2 className="font-bold mb-4 text-xl border-b border-gray-200 pb-2">Feedback Suggestion:</h2> */}
            {/* <div className="mb-4"> */}
                {/* Add feedback suggestion content here */}
            {/* </div> */}
            
            <div>
                <button 
                    onClick={handleBack} 
                    className="w-full mb-10 bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-3xl ">
                    Back
                </button>
            </div>
            </div>
            <div className="flex-1 ml-64 pt-5">
    
                <div>
                    <ShowPDF fileURL={fileURL} sub_id={id} />
                </div>
            </div>
        </div>
    );
}


 
export default FeedbackPage;