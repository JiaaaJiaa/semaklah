import { useState, useEffect } from 'react';
import supabase from "../../config/supabaseClient";

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

        const file = e.target.files[0];
        // console.log(file.name);
        // Upload the file
        const filePath = `assignments/${Date.now()}-${file.name}`;
        let { data:uploadFile,error: uploadError } = await supabase.storage.from('assignment').upload(filePath, form.file);
        if (uploadError) {
            console.error('Error uploading file: ', uploadError);
            setError('Error uploading file');
            return;
        }
        if (uploadFile){
            setForm(prevForm => ({
                ...prevForm,
                file: filePath,
                classroom_id: classroomId,
            }));
        }
        console.log(filePath);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title || !form.desc || !form.instruc || !form.file || !form.start_date || !form.end_date) {
            setError('Please fill in all fields');
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
        setShowUpdate(false);

    };

    // console.log('Assign ID:', assignment);
    return ( 
        <div>   
            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md mx-auto space-y-4">
                {err && <div className="text-red-500 text-sm">{err}</div>}
                <label className="flex flex-col space-y-1">
                    <span>Title:</span>
                    <input type="text" name="title" value={form.title} onChange={handleChange} className="px-3 py-2 border rounded" />
                </label>
                <label className="flex flex-col space-y-1">
                    <span>Description:</span>
                    <textarea type="text" name="desc" value={form.desc} onChange={handleChange} className="px-3 py-2 border rounded" />
                </label>
                <label className="flex flex-col space-y-1">
                    <span>Instructions:</span>
                    <textarea type="text" name="instruc" value={form.instruc} onChange={handleChange} className="px-3 py-2 border rounded" />
                </label>
                <label className="flex flex-col space-y-1">
                    <span>File:</span>
                    <input type="file" name="file" onChange={handleFileChange} className="px-3 py-2 border rounded" />
                    {previousFileName && <p>Previously uploaded file: {previousFileName}</p>}
                </label>
                <label className="flex flex-col space-y-1">
                    <span>Start Date:</span>
                    <input type="datetime-local" name="start_date" value={form.start_date} onChange={handleChange} className="px-3 py-2 border rounded" />
                </label>
                <label className="flex flex-col space-y-1">
                    <span>End Date:</span>
                    <input type="datetime-local" name="end_date" value={form.end_date} onChange={handleChange} className="px-3 py-2 border rounded" />
                </label>
                <input type="submit" value="Update Assignment" className="px-3 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600" />
            </form>
        </div>
     );
}
 
export default UpdateAssignment;