import { useState, useEffect } from 'react';

const Displaygr = ({assignment}) => {
    const [rows, setRows] = useState([]);

    // console.log('Assignment:', assignment.assign_id);

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

    return (
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
                {rows.map((row, index) => (
                    <tr key={index}>
                        <td className="border px-4 py-2">{row.question}</td>
                        <td className="border px-4 py-2">{row.mark_possible}</td>
                        <td className="border px-4 py-2">{row.description}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
 
export default Displaygr;