


const StudSubmissionList = ({students}) => {


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
                <tr>
                    <th className="border px-4 py-2">First Name</th>
                    <th className="border px-4 py-2">Last Name</th>
                    <th className="border px-4 py-2">Email Address</th>
                    <th className="border px-4 py-2">Student ID</th>
                    <th className="border px-4 py-2">Grading</th>
                    <th className="border px-4 py-2">Grade</th>
                    <th className="border px-4 py-2">Download</th>
                </tr>

                {students.map((stud, index) => (
                    <tr key={index}>
                        <td className="border px-4 py-2">{stud.student.stud_fname}</td>
                        <td className="border px-4 py-2">{stud.student.stud_lname}</td>
                        <td className="border px-4 py-2">{stud.student.stud_email}</td>
                        <td className="border px-4 py-2">{stud.student.stud_id}</td>
                        <td className="border px-4 py-2"></td>
                        <td className="border px-4 py-2"></td>
                        <td className="border px-4 py-2"></td>
                        {/* Add other student properties here */}
                    </tr>
                ))}
            </table>
        </div>
    );
}
 
export default StudSubmissionList;