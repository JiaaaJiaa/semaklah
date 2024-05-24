import { useState,useEffect } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import Loading from '../../pages/loading';
// import { Document, Page } from 'react-pdf';
import supabase from '../../config/supabaseClient';
import {Link} from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import DisplayRubrics from '../../components/grading/displaygr';

const StudAssignmentDetails = () => {
    
    //id refers to assign_id
    const {id} = useParams();


    const navigate = useNavigate();
    const [assignment, setAssignment] = useState([]);
    const { user } = useAuthContext();

    const stud_id = user.user.user_metadata.id;
    const [enrol_id, setEnrolId] = useState(null);


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

    //Try fetching the PDF
    const [fileURL, setFileURL] = useState(null);

    useEffect(() => {
        const fetchFile = async () => {
          if (!assignment.file) {
            console.error('Assignment file is undefined');
            return;
          }
      
          const { data, error } = await supabase.storage.from('assignment').download(assignment.file);
      
          if (error) {
            console.error('Error downloading file:', error.message);
            return;
          }
      
          const url = URL.createObjectURL(data);
          setFileURL(url);
        };
      
        if (assignment && assignment.file) {
            fetchFile();
        }
      }, [assignment.file]);

   // Fetch enrol id
    useEffect(() => {
        const fetchEnrolId = async () => {
            const res = await fetch(`/api/enrol/id?stud_id=${stud_id}&classroom_id=${assignment.classroom_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(res.ok) {
                const data = await res.json();
                setEnrolId(data);
            }
        }
        if (stud_id && assignment.classroom_id){
            fetchEnrolId();
        }
    }, [stud_id, assignment.classroom_id]);

    // Stuck here, trying to get enrol_id for submission purposes

    if (!assignment) {
        return <div><Loading /></div>;
    }

    return (  
        <div className="p-20">
            <div className="pb-10">
                    <button 
                    onClick={handleBack} 
                    className="mb-10 mt-5 bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-3xl">
                    Back
                </button>
                
                <h2 className="text-3xl font-semibold text-gray-800">{assignment.title}</h2>
                
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
                        {/* <a href={`https://aypezrkfwwhjkbtreitl.supabase.co/storage/v1/object/public/assignment/${assignment.file}`} download
                            className="px-2 pt-2">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-3xl">
                                Download File
                            </button>
                        </a> */}
                    </div>

                    <p className="pt-2 text-md text-gray-800">
                        {assignment.instruc}
                    </p>                
                </div>
                    {/* Link to the submission page */}
                    <div className="pt-5">
                        <Link to={`/studsubmission/${enrol_id}/${id}`} className="bg-cyan-500 hover:bg-cyan-700 text-xs text-white font-bold py-2 px-4 rounded-3xl">
                            Add Submissions
                        </Link>
                    </div>
                    <div className="pt-5">
                        {assignment.is_released && (
                            <Link to={`/view-feedback/${enrol_id}/${id}`} className="bg-cyan-500 hover:bg-cyan-700 text-xs text-white font-bold py-2 px-4 rounded-3xl">
                                View Feedback
                            </Link>
                        )}
                    </div>
            </div>

            <div className="mb-5 bg-white shadow overflow-hidden sm:rounded-lg p-10">
                {fileURL && <embed src={fileURL} type="application/pdf" width="100%" height="1000px" />}
            </div>

            <div className="mb-5 bg-white shadow overflow-hidden sm:rounded-lg p-10">
                <p className="text-xl font-semibold text-gray-800">
                    Grading Rubrics
                </p>
                <DisplayRubrics assignment={assignment} />
                
            </div>
           
        </div>
    );
}
export default StudAssignmentDetails;