import React, { useState, useEffect } from 'react';
import { SaveIcon, TrashIcon } from '@heroicons/react/solid';


function GradingRubric({assignment}) {
    const [rows, setRows] = useState([]);
    const [totalMarks, setTotalMarks] = useState(0);
    useEffect(() => {
        if (assignment && assignment.assign_id) {
            console.log('Assignment:', assignment.assign_id);
            fetch(`/api/gradingrubric/${assignment.assign_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                setRows(data);
            })
            .catch(error => console.error('Error:', error));
        }
    }, [assignment]);

    useEffect(() => {
        const total = rows.reduce((total, row) => total + Number(row.mark_possible || 0), 0);
        setTotalMarks(total);
    }, [rows]);

    const addRow = () => {
        fetch('/api/gradingrubric', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ assign_id: assignment.assign_id }),
        })
        .then(response => response.json())
        .then(data => {
            setRows(rows.concat([{ gr_id: data.gr_id, question: '', mark_possible: '', description: '' }]));
        })
        .catch(error => console.error('Error:', error));
    };

    const saveRow = (row, index) => {
        if (!row.question || !row.mark_possible || !row.description) {
            alert('Please fill all fields');
            return;
        }
    
        fetch(`/api/gradingrubric/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(row),
        })
        .then(response => response.json())
        .then(data => {
            let newArr = [...rows];
            newArr[index] = data;
            setRows(newArr);
        })
        .catch(error => console.error('Error:', error));
    };

    const deleteRow = (row, index) => {
        fetch(`/api/gradingrubric/${row.gr_id}`, {
            method: 'DELETE',
        })
        .then(() => {
            let newArr = [...rows];
            newArr.splice(index, 1);
            setRows(newArr);
        })
        .catch(error => console.error('Error:', error));
    };

    return (
        <div className="p-6">
            <button className="bg-blue-500 hover:bg-blue-700 text-xs text-white font-bold py-2 px-4 rounded-3xl" onClick={addRow}>Add Row</button>
            <table className="table-auto w-full mt-4">
                <thead>
                    <tr>
                        <th className="bg-cyan-50 border px-4 py-2 w-1/6">Question Number</th>
                        <th className="bg-cyan-50 border px-4 py-2 w-1/6">Mark Possible</th>
                        <th className="bg-cyan-50 border px-4 py-2 w-3/4">Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => {
                        return (
                            <tr key={index}>
                                <td className="border px-4 py-2">
                                    <input 
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                        type="text" 
                                        value={row.question} 
                                        onChange={e => {
                                            let newArr = [...rows]; 
                                            if (newArr.some(item => item.question === e.target.value)) {
                                                alert('Question Number must be unique');
                                                return;
                                            }
                                            newArr[index].question = e.target.value; 
                                            setRows(newArr);
                                        }} 
                                    />
                                </td>
                                <td className="border px-4 py-2">
                                    <input 
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                        type="number" 
                                        min="1"
                                        value={row.mark_possible} 
                                        onChange={e => {
                                            let newArr = [...rows]; 
                                            newArr[index].mark_possible = e.target.value; 
                                            setRows(newArr);
                                        }} 
                                    />
                                </td>
                                <td className="border px-4 py-2">
                                    <input 
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                        type="text" 
                                        value={row.description} 
                                        onChange={e => {
                                            let newArr = [...rows]; 
                                            newArr[index].description = e.target.value; 
                                            setRows(newArr);
                                        }} 
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <div className="flex space-x-2">
                                        <button onClick={() => saveRow(row, index)}>
                                            <SaveIcon className="h-5 w-5 hover:text-green-500 text-gray-500" />
                                        </button>
                                        <button onClick={() => deleteRow(row, index)}>
                                            <TrashIcon className="h-5 w-5 hover:text-red-500 text-gray-500" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="mt-4 p-4 bg-cyan-100">
                <h2 className="font-bold text-lg">Total Mark: {totalMarks}</h2>
            </div>
        </div>
    );
}

export default GradingRubric;