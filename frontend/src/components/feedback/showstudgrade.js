import { useState,useEffect } from "react";


const ShowStudGrade = ({submission,assign_id}) => {

    // Assignment_id --> gr_id
    const [rubrics, setRubrics] = useState([]);

    useEffect(() => {
        //Run this only when the submission and assign_id is ready
        if (submission.sub_id && assign_id) {
            fetch(`/api/gradingrubric/${assign_id}`)
            .then(response => response.json())
            .then(data => {
                const sortedData = data.sort((a, b) => a.question.localeCompare(b.question));
                const extractedData = sortedData.map(item => ({
                    gr_id: item.gr_id,
                    mark_possible: item.mark_possible,
                    question: item.question
                }));

                // sub_id --> gr_id --> grade
                // gr_id --> question assign_id

                fetch(`/api/grading/${submission.sub_id}`)
                    .then(response => response.json())
                    .then(data => {
                        const updatedRubrics = extractedData.map(rubric => {
                            const matchingGrade = data.find(grade => grade.gr_id === rubric.gr_id);
                            return matchingGrade ? { ...rubric, mark_earned: matchingGrade.mark_earned } : rubric;
                        });
                        setRubrics(updatedRubrics);
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
        }

    }, [submission,assign_id]);
 

    return ( 
        <div>
            {rubrics.map((rubric, index) => (
                <div key={index} className="p-4 mb-2 border border-gray-300 divide-x divide-gray-300 rounded-lg flex justify-left">
                    <p className="text-lg flex-none w-14 font-semibold">
                        Q{rubric.question}:
                    </p>
                    <p className="text-lg font-semibold pl-4 text-left">
                        {rubric.mark_earned} / {rubric.mark_possible}
                    </p>
                </div>
            ))}
        </div>
     );
}
 
export default ShowStudGrade;
