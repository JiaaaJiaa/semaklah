// import { useClassroomContext } from "../../hooks/useClassroomContext";
import supabase from "../../config/supabaseClient";
import { useState } from "react";

const CreateAssignment = ({classroomId,setShowCreate,setAssignment}) => {
 
    // const {dispatch} = useClassroomContext();
    const [err,setError] = useState(null);

    const [form, setForm] = useState({
        title: '',
        desc: '',
        instruc:'',
        file:' ',
        start_date: '',
        end_date: '',
        classroom_id: classroomId,
    });

    // console.log('classid:',form.classroom_id)

    const initialFormState = {
        title: '',
        desc: '',
        instruc:'',
        file:' ',
        start_date: '',
        end_date: '',
        classroom_id: classroomId,
    };

    // Perform Assignment creation here

    const handleChange = (e) => {
        let value = e.target.value;
        // console.log('Name:', e.target.name);
        // console.log('Value:', value);
        setForm(prevForm => ({
            ...prevForm,
            [e.target.name]: value,
            classroom_id: classroomId,
        }));
    };

    const handleFileChange = async (e) => {
        // Get the file from the event object
        const file = e.target.files[0];
        console.log(file.name);
    
        // Upload the file
        const filePath = `assignments/${Date.now()}-${file.name}`;
        console.log('File Path:', filePath);
        let { data: uploadFile, error: uploadError } = await supabase.storage.from('assignment').upload(filePath, file);
        if (uploadError) {
            console.error('Error uploading file: ', uploadError);
            setError('Error uploading file');
            return;
        }
        if (uploadFile) {
            setForm(prevForm => ({
                ...prevForm,
                file: filePath,
                classroom_id: classroomId,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // console.log("Check ID",form.classroom_id);

        // console.log(form.title, form.desc, form.instruc, form.file, form.start_date, form.end_date, form.classroom_id);
        if (!form.title || !form.desc || !form.instruc || !form.file || !form.start_date || !form.end_date || !form.classroom_id) {
            setError('Please fill in all fields');
            return;
        }

        const res = await fetch('/api/assignment', {
            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const json = await res.json();

        if (res.ok) {
            // dispatch({ type: 'CREATE_ASSIGNMENT', payload: json[0] });
            setAssignment(prevAssignments => [...prevAssignments, json[0]]);
            setForm(initialFormState);
            setShowCreate(false);
        }
    };

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
                    <input type="file" name="file" onChange={handleFileChange} accept=".pdf" className="px-3 py-2 border rounded" />
                </label>
                <label className="flex flex-col space-y-1">
                    <span>Start Date:</span>
                    <input type="datetime-local" name="start_date" value={form.start_date} onChange={handleChange} className="px-3 py-2 border rounded" />
                </label>
                <label className="flex flex-col space-y-1">
                    <span>End Date:</span>
                    <input type="datetime-local" name="end_date" value={form.end_date} onChange={handleChange} className="px-3 py-2 border rounded" />
                </label>
                <input type="submit" value="Create Assignment" className="px-3 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600" />
            </form>
        </div>
     );
}
 
export default CreateAssignment;