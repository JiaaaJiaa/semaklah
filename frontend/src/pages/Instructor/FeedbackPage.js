import React, { useState,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../../config/supabaseClient';

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
                    // console.log('File URL:', url);
                    setFileURL(url);
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
            
            {/* <div className="mb-5 bg-white shadow overflow-hidden sm:rounded-lg p-10"> */}
                {fileURL && <embed src={fileURL} type="application/pdf" width="100%" height="1000px" />}
            {/* </div> */}
        </div>
     );
}


 
export default FeedbackPage;