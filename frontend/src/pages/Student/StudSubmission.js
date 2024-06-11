import { useState,useEffect } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import Loading from '../../pages/loading';
// import { Document, Page } from 'react-pdf';
import supabase from '../../config/supabaseClient';
import StudSubmissionStatus from './StudSubmissionStatus';
import {toast} from 'react-toastify';


const StudSubmission = () => {
    
    // Get the enrol_id and assign_id from the URL
    const { enrol_id, assign_id } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState([]);
    const [submission, setSubmission] = useState([]);

    
    const [err,setError] = useState(null);
    const [file,setFile] = useState(null);
    const [submission_id, setSubmissionId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [upload, setUpload] = useState(false);
    const [fileURL,setFileURL] = useState(null);
    

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
                        setSubmission(data);
                        setSubmitted(true);

                        const fetchFile = async () => {
                            if (!data.file) {
                                console.error('Submission file is undefined');
                                return;
                            }
                    
                            const { data: dataFile, error } = await supabase.storage.from('assignment').download(data.file);
                    
                            if (error) {
                                console.error('Error downloading file:', error.message);
                                return;
                            }
                        
                            const url = URL.createObjectURL(dataFile);
                            // console.log('File URL:', url);
                            setFileURL(url);
                        }

                        if(file){
                            fetchFile();
                        }

                    } else {
                        setFile('');
                        setSubmitted(false);
                        setSubmission([]);
                        // console.log('No file found');
                    }


                } else{
                    setSubmission([]);
                }
                setLoading(true);
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
        }else{
            // Get the response data
            const data = await res.json();

            // Set the file and submission ID
            setFile(data.file);
            setSubmissionId(data.sub_id);
            setSubmission(data);
            setSubmitted(true);
            // alert('Assignment Submitted');
            toast.success('Assignment Submitted', {
                autoClose: 2000
            });

            // Call the Python API
            const resPython = await fetch(`/api/pythoncode/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sub_id: data.sub_id,
                    file: data.file,
                }),
            });
    
            if (!resPython.ok) {
                console.error('Error submitting assignment');
                setError('Error submitting assignment');
                return;
            }
        }        

        const fetchFile = async () => {
            if (!file) {
                console.error('Submission file is undefined');
                return;
            }
    
            const { data, error } = await supabase.storage.from('assignment').download(file);
    
            if (error) {
                console.error('Error downloading file:', error.message);
                return;
            }
            
            // console.log('Data:', data);
            const url = URL.createObjectURL(data);
            // console.log('File URL:', url);
            setFileURL(url);
        }

        if(file){
            fetchFile();
        }
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
                setSubmission([]);
                setSubmissionId(null);
                setSubmitted(false);

                // alert('Submission Deleted');
                toast.success('Submission Deleted', {
                    autoClose: 2000
                });
            })
        }
    };
    
    const handleFileChange = async (e) => {
        // Get the file from the event object
        setUpload(true);
        const file = e.target.files[0];
        // console.log(file.name);

        if(file.type !== 'application/pdf'){
            alert('Please upload a PDF file');
            setFile(null);
            return;
        }else{
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
            setUpload(false);
        }
    };


    if (!loading) {
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
                <p className="text-xl font-semibold text-gray-800">
                    Submission Status
                </p>            
                <StudSubmissionStatus assignment={assignment} submission={submission} />
            </div>

            <div className="mb-5 bg-white shadow overflow-hidden sm:rounded-lg p-10">
                <div>
                    <p className="pb-5 text-xl font-semibold text-gray-800">
                        File Submission
                    </p>
                    <div className="border ">

                        { submitted? (   
                            <a href={`https://aypezrkfwwhjkbtreitl.supabase.co/storage/v1/object/public/assignment/${file}`} download
                            className="px-2 pt-2 underline" target="_blank" rel="noopener noreferrer">
                                <div className="p-5">
                                <p>Uploaded file: {file}</p>
                                </div>
                            </a>

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
                    {canSubmit && !upload ? <SubmitButton /> : <DisabledSubmitButton />}
                </div>
               
            </div>

            <div>
                { submitted?
                    (
                    <div className="mb-5 bg-white shadow overflow-hidden sm:rounded-lg p-10">
                        {fileURL ? <embed src={fileURL} type="application/pdf" width="100%" height="1000px" /> : <p>No file to display</p>}
                    </div>
                    )
                :null}
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
//                     className="mb-10 mt-5 bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-3xl">
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
