// import { useClassroomContext } from "../../hooks/useClassroomContext";
import supabase from "../../config/supabaseClient";
import { useState } from "react";
import { toast } from 'react-toastify';

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
        // console.log(file.name);

        // Check if the file type is PDF
        if (!file){
            setError('Please upload a file');
            return;
        }else if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file');
            return;
        }else{
            // Upload the file
            const filePath = `assignments/${Date.now()}-${file.name}`;
            // console.log('File Path:', filePath);
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
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // console.log("Check ID",form.classroom_id);

        // console.log(form.title, form.desc, form.instruc, form.file, form.start_date, form.end_date, form.classroom_id);
        if (!form.title || !form.desc || !form.instruc || !form.file || !form.start_date || !form.end_date || !form.classroom_id) {
            setError('Please fill in all fields');
            alert('Please fill in all fields');
            return;
        }else if(form.file === ' '){    
            setError('Please upload a valid file');
            alert('Please upload a valid file');
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
            toast.success('Assignment created', {
                autoClose: 2000 // closes after 2000ms, i.e., 2 seconds
            });
        }
    };

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
                    <input type="file" name="file" onChange={handleFileChange} accept=".pdf" className="block w-full text-sm text-slate-500 file:m-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 shadow appearance-none border rounded w-full" />                
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
                        Create Assignment
                    </button>
                </div>            
            </form>
        </div>
     );
}
 
export default CreateAssignment;