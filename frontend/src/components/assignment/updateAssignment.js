import { useState, useEffect } from 'react';
import supabase from "../../config/supabaseClient";
import { toast } from 'react-toastify';

const UpdateAssignment = ({classroomId, setShowUpdate,assignment,setAssignment}) => {

    // Update Assignment
    const [err,setError] = useState(null);
    const [form, setForm] = useState({
        title: assignment.title,
        desc: assignment.desc,
        instruc: assignment.instruc,
        file: assignment.file,
        start_date: assignment.start_date,
        end_date: assignment.end_date,
        classroom_id: classroomId,
    });

    const [previousFileName, setPreviousFileName] = useState('');
    // Add a new state variable to track the upload status
    const [isUploadSuccessful, setIsUploadSuccessful] = useState(true);


    useEffect(() => {
        // Assuming assignment.file is the path to the file
        const filePath = assignment.file;
        const fileName = filePath.split('/').pop();
        setPreviousFileName(fileName);
    }, [assignment]);

    const handleChange = (e) => {
        let value = e.target.value;
        setForm(prevForm => ({
            ...prevForm,
            [e.target.name]: value,
            classroom_id: classroomId,
        }));
    };

    const handleFileChange = async (e) => {

        setIsUploadSuccessful(false);

        const file = e.target.files[0];
        // console.log(file.name);
        // Upload the file
        const filePath = `assignments/${Date.now()}-${file.name}`;
        let { data:uploadFile,error: uploadError } = await supabase.storage.from('assignment').upload(filePath, file);
        if (uploadError) {
            console.error('Error uploading file: ', uploadError);
            setError('Error uploading file');
            setIsUploadSuccessful(false); // Set upload status to false if there's an error
            return;
        }
        if (uploadFile){
            setForm(prevForm => ({
                ...prevForm,
                file: filePath,
                classroom_id: classroomId,
            }));
            setIsUploadSuccessful(true); // Set upload status to true if upload is successful
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title || !form.desc || !form.instruc || !form.file || !form.start_date || !form.end_date) {
            setError('Please fill in all fields');
            return;
        }

        if (!isUploadSuccessful) {
            alert('File upload not successful');
            return;
        }

        const response = await fetch(`/api/assignment/${assignment.assign_id}`, {
            method: 'PATCH',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            alert('Fail to update assignment. Please try again.')
        }else {
            // Fetch the updated data
            const updatedResponse = await fetch(`/api/assignment?classroomId=${classroomId}`);
            const updatedJson = await updatedResponse.json();
    
            // Update the state of your application
            // This depends on your application structure
            setAssignment(updatedJson);
        }
        toast.success('Assignment update successfully', {
            autoClose: 2000 // closes after 2000ms, i.e., 2 seconds
        });
        // alert('Assignment updated successfully');
        setShowUpdate(false);

    };

    // console.log('Assign ID:', assignment);
    return ( 
        <div>   
            <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 mb-4">
                {err && <div className="pb-2 font-bold text-red-500 text-sm">{err}</div>}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                        Title:
                    </label>
                    <input type="text" name="title" value={form.title} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="desc">
                        Description:
                    </label>
                    <textarea type="text" name="desc" value={form.desc} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="instruc">
                        Instructions:
                    </label>
                    <textarea type="text" name="instruc" value={form.instruc} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
                        File:
                    </label>
                    <input type="file" name="file" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:m-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 shadow appearance-none border rounded w-full" />
                    {previousFileName && <p>Previously uploaded file: {previousFileName}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start_date">
                        Start Date:
                    </label>
                    <input type="datetime-local" name="start_date" value={form.start_date} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="end_date">
                        End Date:
                    </label>
                    <input type="datetime-local" name="end_date" value={form.end_date} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="pt-2 flex items-center justify-between">
                    <button 
                        className="mt-4 w-full inline-flex justify-center rounded-3xl border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:w-auto sm:text-sm" 
                        type="submit">    
                        Update Assignment
                    </button>
                </div>            
            </form>
        </div>
     );
}
 
export default UpdateAssignment;