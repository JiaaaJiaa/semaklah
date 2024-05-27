import React, { useEffect, useState } from 'react';
import Loading from '../../pages/loading';

const StudSubmissionStatus = ({assignment, submission}) => {
    const [timeRemaining, setTimeRemaining] = useState(null);
    const deadline = new Date(assignment.end_date);
    const [loading, setLoading] = useState(false);

    // console.log('submission', submission);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const timeDifference = deadline - now;
            if (timeDifference > 0) {
                const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                setTimeRemaining(`${days} days, ${hours} hours, ${minutes} minutes`);
            } else {
                const overdueTime = -timeDifference;
                const days = Math.floor(overdueTime / (1000 * 60 * 60 * 24));
                const hours = Math.floor((overdueTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((overdueTime % (1000 * 60 * 60)) / (1000 * 60));
                setTimeRemaining(`Overdue by ${days} days, ${hours} hours, ${minutes} minutes`);
            }
            setLoading(true);
        }, 1000);
    
        return () => clearInterval(interval);
    }, [deadline, submission]);

    if (!loading) {
        return <div><Loading/></div>;
    }

    return ( 
        <div className="pt-5">
            <table className="table-auto w-full text-left">
                <tbody>
                    <tr>
                        <th className="border px-4 py-2">Submission Status</th>
                        <td className={`border px-4 py-2 ${submission.file ? 'text-bold text-green-500' : ' text-bold text-gray-500'}`}>{submission.file ? 'Submitted' : 'Not Submitted'}</td>
                    </tr>
                    <tr>
                        <th className="border px-4 py-2">Time Remaining</th>
                        <td className={`border px-4 py-2 ${String(timeRemaining).includes('Overdue') ? 'text-red-500' : ''}`}>{timeRemaining}</td>
                    </tr>
                    <tr>
                        <th className="border px-4 py-2">Last Modified</th>
                        <td className="border px-4 py-2">{submission.file ? new Date(submission.created_at).toLocaleDateString('en-GB', { hour: '2-digit', minute: '2-digit', second:'2-digit', hour12: true }) : '-'}</td>                    </tr>
                    <tr>
                        <th className="border px-4 py-2">Grading Status</th>
                        <td className="border px-4 py-2">{assignment.is_released && assignment.mark ? 'Graded' : 'Not Graded'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
 
export default StudSubmissionStatus;