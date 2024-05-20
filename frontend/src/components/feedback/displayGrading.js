import { useEffect, useState } from "react";

const DisplayGrading = ({submission}) => {

    //Fetch the grading content from the database
    /*
        Use assign_id in Submission to get all the GRs and then get the grading from there
        Then pass the sub_id and the gr_id and the mark_earned to the grading component
    */
    const [grading, setGrading] = useState([]);
    const [scores, setScores] = useState({});
    const [overMax, setOverMax] = useState({});

    useEffect(() => {
        if (submission.assign_id && submission.sub_id) {
            fetch(`/api/gradingrubric/${submission.assign_id}`)
                .then(response => response.json())
                .then(data => {
                    setGrading(data);
                    return fetch(`/api/grading/${submission.sub_id}`);
                })
                .then(response => response.json())
                .then(data => {
                    const initialScores = {};
                    data.forEach(gr => {
                        initialScores[gr.gr_id] = gr.mark_earned;
                    });
                    setScores(initialScores);
                })
                .catch(error => console.error(error));
        }
    }, [submission]);


    const handleScoreChange = (event, gr) => {
        const score = event.target.value;
    
        // Check if the score is less than or equal to the maximum possible score
        if (score <= gr.mark_possible) {
            setScores({
                ...scores,
                [gr.gr_id]: score
            });
            setOverMax({
                ...overMax,
                [gr.gr_id]: false
            });
        } else {
            // If the score is greater than the maximum possible score, don't update the scores state
            // and set the overMax state for this gr_id to true
            setOverMax({
                ...overMax,
                [gr.gr_id]: true
            });
        }
    }

    const handleSaveScore = () => {
        // Check if any score is greater than the maximum possible score
        for (let gr_id in scores) {
            const score = scores[gr_id];
            const gr = grading.find(item => item.gr_id === gr_id);
    
            if (score > gr.mark_possible) {
                alert('One or more scores are greater than the maximum possible score. Please correct these before saving.');
                return;
            }
        }

        Promise.all(
            Object.entries(scores).map(([gr_id, mark_earned]) => {
                return fetch('/api/grading', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sub_id: submission.sub_id,
                        gr_id,
                        mark_earned
                    }),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => console.log(data))
                .catch(error => console.error('Error:', error));
            })
        ).then(() => {
            alert('All scores saved successfully');
        }).catch(() => {
            alert('An error occurred while saving scores');
        });


    
        // Save the scores here
        console.log(scores);
    }

    if (!submission.assign_id && !submission.sub_id) {
        return <p>Loading...</p>;
    }  

    return ( 
        <div>  
            {Array.isArray(grading) && grading.map((gr,index) => (
                <div key={index}>
                    <div className="flex items-center space-x-2">
                        <label htmlFor={`Q${gr.question}`} className="font-bold">Q{gr.question}:</label>
                        <input 
                            type="number" 
                            id={`score-${gr.gr_id}`} 
                            onChange={(event) => handleScoreChange(event, gr)}
                            className={`border rounded-md px-2 py-1 w-1/3 pt-2 mt-2 ${overMax[gr.gr_id] ? 'border-red-600 text-red-500' : ''}`}
                            max={gr.mark_possible}
                            min="1"
                            value={scores[gr.gr_id] || ''} // Display the score from the scores state
                        />
                        <p className="font-semibold">/{gr.mark_possible}</p>
                    </div>
                </div>
            ))}
            {/* Display the total score */}
            { Array.isArray(grading) && grading.length > 0 &&
                <p className="text-lg font-bold pt-2">
                    Total Score :   
                    {Object.values(scores).reduce((a, b) => Number(a) + Number(b), 0)} /  
                    {grading.reduce((a, b) => a + b.mark_possible, 0)}
                </p>
            }
         
            <button onClick={handleSaveScore} className="text-xs mt-4 bg-blue-500 text-white px-4 py-2 rounded-3xl">Save Score</button>
        </div>
     );
}
 
export default DisplayGrading;