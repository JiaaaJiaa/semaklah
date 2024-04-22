const InstruSubmisisonStatus = ({submissionData}) => {
    const existingSubmissionsCount = submissionData.filter(submission => submission.exists).length;
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
                        <td className="border px-4 py-2">-</td>
                    </tr>
                </tbody>
            </table>
        </div>
     );
}
export default InstruSubmisisonStatus;