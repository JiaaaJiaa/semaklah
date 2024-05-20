const InstruSubmisisonStatus = ({assig_id, students, submissionData}) => {
    const existingSubmissionsCount = submissionData.filter(submission => submission.exists).length;

    // Use assignment id and enrol id to find how many student has mark
    const countStudentsWithMark = (assign_id) => {
        const studentsWithMark = submissionData.filter(data => 
            data.exists && 
            data.data[0].assign_id === assign_id && 
            data.data[0].mark !== null
        ); 
        return studentsWithMark.length;
    };

    const countTotalSubmittedStudent = (assign_id) => {
        const totalnumberofgrading= submissionData.filter(data => 
            data.exists && 
            data.data[0].assign_id === assign_id
        );
        return totalnumberofgrading.length;
    };

    
    const numStudentsWithMark = countStudentsWithMark(assig_id);
    const totalgrading =countTotalSubmittedStudent(assig_id);

    return ( 
        <div className="pt-5">
            <table className="table w-full text-left">
                <tbody>
                    <tr>
                        <th className="border w-1/4 px-4 py-2">Submission</th>
                        <td className="border px-4 py-2">{`${existingSubmissionsCount}/${submissionData.length}`}</td>
                    </tr>
                    <tr>
                        <th className="border w-1/4 px-4 py-2">Grading Progress</th>
                        <td className="border px-4 py-2">{numStudentsWithMark}/{totalgrading}</td>
                    </tr>
                </tbody>
            </table>
        </div>
     );
}
export default InstruSubmisisonStatus;