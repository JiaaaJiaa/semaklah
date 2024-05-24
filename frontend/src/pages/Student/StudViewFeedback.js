import { useState,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


import DisplaySubmissionInfo from '../../components/feedback/displaySubmissionInfo';
import DisplayLexical from '../../components/feedback/displayLexical';
import ShowStudGrade from '../../components/feedback/showstudgrade';


const StudViewFeedback = () => {

    const { enrol_id, assign_id } = useParams();
    const [submission, setSubmission] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    }      

    // Get submission info from enrol_id and assign_id
    useEffect(() => {
        // Get submission info from enrol_id and assign_id
        fetch(`/api/submission/${assign_id}/${enrol_id}`)
            .then(response => response.json())
            .then(data => 
                
                setSubmission(data)
                
                // use sub_id to get feedback  

            )
            .catch(error => console.error(error));
    }, [assign_id, enrol_id]);  
    

    // display all feedback

    console.log(submission.sub_id);

    return ( 
        <div className="flex p-20">
            <div className="pt-20 fixed top-0 left-0 h-full w-75 bg-cyan-50 drop-shadow-md p-4 overflow-y-auto">
                <div>
                    <button 
                        onClick={handleBack} 
                        className="w-full mb-10 bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-3xl ">
                        Back
                    </button>
                </div>

                <h2 className="font-bold text-xl mb-4 border-b border-gray-200 pb-2">Submission Info:</h2>
                <div className="mb-4">
                    <DisplaySubmissionInfo submission={submission} />
                </div>

                <h2 className="font-bold text-xl mb-4 border-b border-gray-200 pb-2">Lexical Performance:</h2>
                <div className="mb-4">
                    <DisplayLexical submission={submission}/>
                </div>

                <h2 className="font-bold text-xl mb-4 border-b border-gray-200 pb-2">Grading:</h2>
                <div className=" mb-4">
                    <ShowStudGrade submission={submission} assign_id={assign_id}/>
                </div>



                {/* <h2 className="font-bold mb-4 text-xl border-b border-gray-200 pb-2">Feedback Suggestion:</h2> */}
                {/* <div className="mb-4"> */}
                    {/* Add feedback suggestion content here */}
                {/* </div> */}
                
                
            </div>
        </div>
     );
}
 
export default StudViewFeedback;