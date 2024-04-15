import { useState,useEffect } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import Loading from '../../pages/loading';
// import { Document, Page } from 'react-pdf';
import supabase from '../../config/supabaseClient';
import StudSubmissionStatus from './StudSubmissionStatus';


const StudSubmission = () => {
    
    // Get the enrol_id and assign_id from the URL
    const { enrol_id, assign_id } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState([]);

    
    const [err,setError] = useState(null);
    const [file,setFile] = useState(null);
    const [submission_id, setSubmissionId] = useState(null);
    

    // console.log('Enrol ID:', enrol_id)
    // console.log('Assignment ID:', assign_id)

    const handleBack = () => {
        navigate(-1);
    }

    // Check the condition for submission
    const [canSubmit,setCanSubmit] = useState(false);
    // const [canUpdate,setCanUpdate] = useState(false);
    const [canDelete,setCanDelete] = useState(false);
    // const [isUpdating, setIsUpdating] = useState(false);
    const [submitted,setSubmitted] = useState(false);
    const assignmentEndDate = new Date(assignment.end_date);
    const assignmentStartDate = new Date(assignment.start_date);
    const currentDate = new Date();
    const [loading, setLoading] = useState(false);

    // Fetch data from database
    useEffect(()=>{
        fetch(`/api/assignment/${assign_id}`)
            .then(response => response.json())
            .then(data => setAssignment(data))
            .catch(error => console.error(error));

        // console.log('Calling submission API');

        fetch(`/api/submission/${assign_id}/${enrol_id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                if (data) {
                    data = JSON.parse(data);
                    if (data && data.file) {
                        setFile(data.file);
                        setSubmissionId(data.sub_id);
                        setSubmitted(true);
                    } else {
                        setFile('');
                        setSubmitted(false);
                        console.log('No file found');
                    }
                } 
            })
            .catch(error => {
                console.error(error);
                setFile('');
            });     
            },[enrol_id, assign_id, submitted])

    useEffect(() => {
        const canSubmitNow = !submitted && currentDate >= assignmentStartDate && currentDate <= assignmentEndDate;
        setCanSubmit(canSubmitNow);

        const canDeleteNow = currentDate >= assignmentStartDate && currentDate <= assignmentEndDate && submitted;    
        setCanDelete( canDeleteNow);
    }, [submitted, currentDate, assignmentStartDate, assignmentEndDate]);

    // Buttons
    
    const DeleteButton = () => (
        <button 
            className="mr-4 mt-5 text-sm bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-4 rounded-3xl"
            type="submit" onClick={handleDelete}
            >Delete</button>
    );

    const DisabledDeleteButton = () => (    
        <button
            className="mr-4 mt-5 text-sm bg-gray-700 text-white font-bold py-2 px-4 rounded-3xl"        
            disabled>Delete</button>
    );
    
    
    const SubmitButton = () => (
        <button 
            className=" mt-5 text-sm bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-3xl"
            type="submit" onClick={handleSubmit}>Submit</button>
    );
    
    const DisabledSubmitButton = () => (
        <button 
            className="mt-5 text-sm bg-gray-700 text-white font-bold py-2 px-4 rounded-3xl"
            disabled>Submit</button>
    );


    // Handle Actions 

    const handleSubmit = async (event) => {
        event.preventDefault();
        // console.log('Submitting Form');

        
        if(!file){
            setError('Please upload a file');
            alert('Please upload a file');
            return;
        }

        // Perform Assignment submission here
        const res= await fetch(`/api/submission/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                assign_id:assign_id,
                enrol_id:enrol_id,
                file: file,
            }),
        });

        if (!res.ok) {
            console.error('Error submitting assignment');
            setError('Error submitting assignment');
            return;
        }
        setSubmitted(true);
        alert('Assignment Submitted');
    };

    const handleDelete = async (event) => {
        event.preventDefault();

        const userConfrimation = window.confirm('Are you sure you want to delete the submission?'); 
        if (!userConfrimation) {
            return;
        }
        if(userConfrimation){
            // console.log('Deleting Form');
            fetch(`/api/submission/${submission_id}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                // console.log('Deleted:', data);
                setFile('');
                setSubmitted(false);

                alert('Submission Deleted');
            })
        }
    };
    
    const handleFileChange = async (e) => {
        // Get the file from the event object
        setLoading(true);
        const file = e.target.files[0];
        // console.log(file.name);
    
        // Upload the file
        const filePath = `submissions/${Date.now()}-${file.name}`;
        // console.log('File Path:', filePath);
        let { data: uploadFile, error: uploadError } = await supabase.storage.from('assignment').upload(filePath, file);
        if (uploadError) {
            console.error('Error uploading file: ', uploadError);
            setError('Error uploading file');
            return;
        }
        if (uploadFile) {
            setFile(filePath);  
        }
        setLoading(false);
    };


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
 
                <h2 className="text-3xl font-semibold text-gray-800">{assignment.title}</h2>

            </div>

            <div className="mb-5 bg-white shadow overflow-hidden sm:rounded-lg p-10">
                <p className="text-xl font-semibold text-gray-800">
                    Submission Status
                </p>            
                <StudSubmissionStatus enrol_id={enrol_id} assign_id={assign_id} />
            </div>

            <div className="mb-5 bg-white shadow overflow-hidden sm:rounded-lg p-10">
                <div>
                    <p className="pb-5 text-xl font-semibold text-gray-800">
                        File Submission
                    </p>
                    <div className="border ">

                        { submitted? (
                            <div className="p-5">
                                <p>Uploaded file: {file}</p>
                            </div>
                        ):(
                            <input type="file" 
                            className="center p-5 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-cyan-700 hover:file:bg-cyan-100" 
                            onChange={handleFileChange} 
                            disabled={submitted}/>
                        )}

                      
                    </div>
                    
                </div>  
                <div className="flex justify-center">
                    {canDelete ? <DeleteButton /> : <DisabledDeleteButton />}
                    
                    
                    {canSubmit && !loading ? <SubmitButton /> : <DisabledSubmitButton />}
                </div>
               
            </div>
           
        </div>
    );
}

export default StudSubmission;


// If wanna use update, can continue from here

// const StudSubmission = () => {
    
//     // Get the enrol_id and assign_id from the URL
//     const { enrol_id, assign_id } = useParams();
//     const navigate = useNavigate();
//     const [assignment, setAssignment] = useState([]);

    
//     const [err,setError] = useState(null);
//     const [file,setFile] = useState(null);

//     // console.log('Enrol ID:', enrol_id)
//     // console.log('Assignment ID:', assign_id)

//     const handleBack = () => {
//         navigate(-1);
//     }

//     // Check the condition for submission
//     const [canSubmit,setCanSubmit] = useState(false);
//     const [canUpdate,setCanUpdate] = useState(false);
//     // const [canDelete,setCanDelete] = useState(false);
//     const [isUpdating, setIsUpdating] = useState(false);
//     const [submitted,setSubmitted] = useState(false);
//     const assignmentEndDate = new Date(assignment.end_date);
//     const assignmentStartDate = new Date(assignment.start_date);
//     const currentDate = new Date();

//     // Fetch data from database
//     useEffect(()=>{
//         fetch(`/api/assignment/${assign_id}`)
//             .then(response => response.json())
//             .then(data => setAssignment(data))
//             .catch(error => console.error(error));

//         console.log('Calling submission API');

//         fetch(`/api/submission/${assign_id}/${enrol_id}`)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.text();
//             })
//             .then(data => {
//                 data = JSON.parse(data);

//                 console.log('Data:', data);
//                 if (data && data.file) {
//                     setFile(data.file);
//                     setSubmitted(true);
//                     console.log('File:', data.file);
//                 } else {
//                     setFile('');
//                     setSubmitted(false);
//                     console.log('No file found');

//                 }
//             })
//             .catch(error => {
//                 console.error(error);
//                 setFile('');
//             });      
//     },[enrol_id, assign_id, submitted])

//     useEffect(() => {
//         const canSubmitNow = !submitted && currentDate >= assignmentStartDate && currentDate <= assignmentEndDate;
//         setCanSubmit(canSubmitNow);

//         const canUpdateNow = currentDate >= assignmentStartDate && currentDate <= assignmentEndDate && submitted;    
//         setCanUpdate(canUpdateNow);
//     }, [submitted, currentDate, assignmentStartDate, assignmentEndDate]);

//     // Buttons

//     const UpdateButton = () => (
//         <button 
//             className="mr-4 mt-5 text-sm bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-3xl"
//             type="submit" onClick={handleUpdate}>Update
//         </button>
//     );
    
//     const DeleteButton = () => (
//         <button 
//             className="mr-4 mt-5 text-sm bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-4 rounded-3xl"
//             type="submit" onClick={handleCancel}
//             >Cancel</button>
//     );
    
//     const DisabledUpdateButton = () => (
//         <button 
//             className="mr-4 mt-5 text-sm bg-gray-700 text-white font-bold py-2 px-4 rounded-3xl"
//             type="submit" onClick={handleUpdate}
//             disabled>Update</button>
//     );
    
//     const SubmitButton = () => (
//         <button 
//             className=" mt-5 text-sm bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-3xl"
//             type="submit" onClick={handleSubmit}>Submit</button>
//     );
    
//     const DisabledSubmitButton = () => (
//         <button 
//             className="mt-5 text-sm bg-gray-700 text-white font-bold py-2 px-4 rounded-3xl"
//             disabled>Submit</button>
//     );


//     // Handle Actions 

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         console.log('Submitting Form');
        
//         if(!file){
//             setError('Please upload a file');
//             alert('Please upload a file');
//             return;
//         }

//         // Perform Assignment submission here
//         const res= await fetch(`/api/submission/`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 assign_id:assign_id,
//                 enrol_id:enrol_id,
//                 file: file,
//             }),
//         });

//         if (!res.ok) {
//             console.error('Error submitting assignment');
//             setError('Error submitting assignment');
//             return;
//         }
//         setSubmitted(true);
//         alert('Assignment Submitted');
//     };

//     const handleUpdate = async (event) => {
//         event.preventDefault();
//         console.log('Updating Form');
//         setIsUpdating(!isUpdating);


//     };

//     const handleCancel = async (event) => {
//         event.preventDefault();
//         console.log('Cancel Form');
//         setIsUpdating(false);

//     };
    
//     const handleFileChange = async (e) => {
//         // Get the file from the event object
//         const file = e.target.files[0];
//         console.log(file.name);
    
//         // Upload the file
//         const filePath = `submissions/${Date.now()}-${file.name}`;
//         console.log('File Path:', filePath);
//         let { data: uploadFile, error: uploadError } = await supabase.storage.from('assignment').upload(filePath, file);
//         if (uploadError) {
//             console.error('Error uploading file: ', uploadError);
//             setError('Error uploading file');
//             return;
//         }
//         if (uploadFile) {
//             setFile(filePath);  
//         }
//     };


//     if (!assignment) {
//         return <div><Loading /></div>;
//     }

//     return (  
//         <div className="p-20">
//             <div className="pb-10">
//                     <button 
//                     onClick={handleBack} 
//                     className="mb-10 mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//                     Back
//                 </button>
 
//                 <h2 className="text-3xl font-semibold text-gray-800">{assignment.title}</h2>

//             </div>

//             <div className="mb-5 bg-white shadow overflow-hidden sm:rounded-lg p-10">
//                 <p className="text-xl font-semibold text-gray-800">
//                     Submission Status
//                 </p>            
//                 <StudSubmissionStatus enrol_id={enrol_id} assign_id={assign_id} />
//             </div>

//             <div className="mb-5 bg-white shadow overflow-hidden sm:rounded-lg p-10">
//                 <div>
//                     <p className="pb-5 text-xl font-semibold text-gray-800">
//                         File Submission
//                     </p>
//                     <div className="border ">

//                         { submitted? (
//                             <div className="p-5">
//                                 <p>Uploaded file: {file}</p>
//                             </div>
//                         ):(
//                             <input type="file" 
//                             className="center p-5 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-cyan-700 hover:file:bg-cyan-100" 
//                             onChange={handleFileChange} 
//                             disabled={submitted}/>
//                         )}

                      
//                     </div>
                    
//                 </div>  
//                 <div className="flex justify-center">
//                     {isUpdating ? 
//                         <DeleteButton /> : 
//                         (canUpdate ? <UpdateButton /> : <DisabledUpdateButton />)
//                     }
//                     {canSubmit ? <SubmitButton /> : <DisabledSubmitButton />}
//                 </div>
               
//             </div>
           
//         </div>
//     );
// }
