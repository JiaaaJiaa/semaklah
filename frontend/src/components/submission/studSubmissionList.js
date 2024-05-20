// import { useEffect, useState } from "react";
import { DownloadIcon } from '@heroicons/react/solid'
import { Link } from "react-router-dom";



const StudSubmissionList = ({ students, submissionData}) => {


    // Get student enrol id, check their submission status
    // If the student has submitted, display the submission status
    // If the student has not submitted, display the submission status as not submitted
    // If the student has submitted, display the grade
    // If the student has not submitted, display the grade as not graded
    // If the student has submitted, display the download button
    // If the student has not submitted, display the download button as disabled

    return (  
        <div className="pt-5">
            
            <table className="table w-full text-left">
                <tbody>
                    <tr>
                        <th className="border px-4 py-2">First Name</th>
                        <th className="border px-4 py-2">Last Name</th>
                        <th className="border px-4 py-2">Email Address</th>
                        <th className="border px-4 py-2">Student ID</th>
                        <th className="border px-4 py-2">Grading</th>
                        <th className="border px-4 py-2">Grade</th>
                        <th className="border px-4 py-2">Download</th>
                    </tr>

                    {students.map((stud, index) => {
                        const submission = submissionData.find(data => data.exists && data.data[0].enrol_id === stud.enrol_id);
                        // if (submission) {
                        //     console.log("Enrol ID:", submission.data[0].sub_id);
                        // }
                        return (
                            <tr key={index}>
                                <td className="border px-4 py-2">{stud.student.stud_fname}</td>
                                <td className="border px-4 py-2">{stud.student.stud_lname}</td>
                                <td className="border px-4 py-2">{stud.student.stud_email}</td>
                                <td className="border px-4 py-2">{stud.student.stud_id}</td>
                                <td className="border px-4 py-2">
                                    {submission && submission.data && submission.data[0] ? (
                                        <button className="bg-blue-500 w-32 text-xs hover:bg-blue-700 text-xs text-white font-bold py-2 px-4 rounded-3xl">
                                            <Link to={`/feedback/${submission.data[0].sub_id}`}>
                                                Grading
                                            </Link>
                                        </button>

                                    ) : (
                                        <button disabled className="bg-blue-500 w-32 text-xs text-white font-bold py-2 px-4 rounded-3xl opacity-50 cursor-not-allowed">
                                            Not Submitted
                                        </button>
                                    )}
                                </td>
                                <td className="border px-4 py-2">
                                    {/* Display marks here */}
                                    {submission && submission.data && submission.data[0] && submission.data[0].mark !== null ? (
                                        <p>{submission.data[0].mark} / 100</p>
                                    ) : (
                                        '-'
                                    )}
                                </td>
                                <td className="border px-4 py-2">
                                    {submission ? (
                                        submission.data && submission.data[0] && submission.data[0].file ? (
                                            <button onClick={() => {
                                                fetch(`https://aypezrkfwwhjkbtreitl.supabase.co/storage/v1/object/public/assignment/${submission.data[0].file}`)
                                                    .then(response => response.blob())
                                                    .then(blob => {
                                                        const url = window.URL.createObjectURL(blob);
                                                        const a = document.createElement('a');
                                                        a.href = url;
                                                        a.download = submission.data[0].file || 'filename';
                                                        a.click();
                                                    })
                                                    .catch(error => console.error(error));
                                            }}>
                                                <DownloadIcon className="h-5 w-5" />
                                            </button>
                                        ) : null
                                    ) : (
                                        <button disabled><DownloadIcon className="h-5 w-5 text-gray-300" /></button>
                                    )}
                                </td>
                                {/* Add other student properties here */}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
 
export default StudSubmissionList;