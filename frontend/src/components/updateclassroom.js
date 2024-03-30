import React, { useState, useEffect } from 'react';
import { useClassroomContext } from '../hooks/useClassroomContext';

const UpdateClassroom = ({ setShowModal, classroom }) => {
    const { dispatch } = useClassroomContext();

    // const [token, setToken] = useState(false);

    // if(token){
    // sessionStorage.setItem('token', JSON.stringify(token));
    // }

    // useEffect(() => {
    // if(sessionStorage.getItem('token')){
    //     let data = JSON.parse(sessionStorage.getItem('token'));
    //     setToken(data);
    //     console.log(data);
    // }
    // },[])

    const [form, setForm] = useState({
        // inst_id: token.user.user_metadata.id,
        academic_year: classroom.academic_year,
        semester: classroom.semester,
        course_code: classroom.course_code,
        course_name: classroom.course_name,
        course_desc: classroom.course_desc,
        classroom_limit: classroom.classroom_limit,
    });
    const [err, setError] = useState(null);

    const handleChange = (e) => {
        let value = e.target.value;

        if (e.target.name === 'semester' || e.target.name === 'classroom_limit') {
            value = value ? parseInt(value, 10) : '';
        }

        setForm({
            ...form,
            [e.target.name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.academic_year || !form.semester || !form.course_code || !form.course_name || !form.course_desc || !form.classroom_limit) {
            setError('Please fill in all fields');
            return;
        }

        const response = await fetch(`/api/classroom/${classroom.classroom_id}`, {
            method: 'PATCH',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json',
            }        
        });
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            alert('Fail to update classroom. Please try again.')
        }
        if (response.ok) {
            setShowModal(false);
            dispatch({ type: 'UPDATE_CLASSROOM', payload: json }); 
            alert('Classroom updated');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 mb-4">
            {err && <div className="text-red-500">{err}</div>}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="academic_year">
                    Academic Year 
                </label>
                <select required name="academic_year" value={form.academic_year} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option value="">Select Academic Year</option>
                    <option value="23/24">23/24</option>
                    
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="semester">
                    Semester
                </label>
                <select name="semester" value={form.semester} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option value="">Select Semester</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="course_code">
                    Course Code
                </label>
                <input name="course_code" value={form.course_code} onChange={handleChange} placeholder="Course Code" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="course_name">
                    Course Name
                </label>
                <input name="course_name" value={form.course_name} onChange={handleChange} placeholder="Course Name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="course_desc">
                    Course Description
                </label>
                <textarea name="course_desc" value={form.course_desc} onChange={handleChange} placeholder="Course Description" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="classroom_limit">
                    Classroom Limit
                </label>
                <input type="number" name="classroom_limit" value={form.classroom_limit} onChange={handleChange} placeholder="Classroom Limit" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>            
            </div>

            <div className="flex items-center justify-between">
                <button 
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" 
                    type="submit">    
                    Update
                </button>
            </div>
        </form>        
    );
};

export default UpdateClassroom;