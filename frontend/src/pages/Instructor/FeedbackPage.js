import React, { useState,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../../config/supabaseClient';
import ShowPDF from '../../components/feedback/showPDF';


const FeedbackPage = () => {

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
        <div className="p-20">
            <div>
                    <button 
                    onClick={handleBack} 
                    className="mb-10 mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Back
                </button>
                
            </div>

            <div>
                <ShowPDF fileURL={fileURL}/>
            </div>

        </div>
     );
}


 
export default FeedbackPage;