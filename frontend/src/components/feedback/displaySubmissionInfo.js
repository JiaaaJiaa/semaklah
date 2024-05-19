const DisplaySubmissionInfo = ({submission}) => {

    // Get student name and submission time from submission object

    return ( 
        <div>
            <p className="mb-2"><strong>Student Name:</strong></p>
            <p className="mb-4"><strong>Submission Time:</strong></p>   
        </div>

     );
}
 
export default DisplaySubmissionInfo;