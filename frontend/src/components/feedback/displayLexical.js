import React, { useState,useEffect } from 'react';

const DisplayLexical= ({submission}) => {

    //Fetch the lexical analysis from the database
    const [spelling, setSpelling] = useState([]);
    const [grammar, setGrammar] = useState([]);

    useEffect(() => {
        if(submission.sub_id){
            fetch(`/api/submission/submission-feedback/${submission.sub_id}`)
                .then(response => response.json())
                .then(data => {
                    setSpelling(data.spelling);
                    setGrammar(data.grammar);
                })
                .catch(error => console.error(error));
        }
    }, [submission]);

    return ( 
        <div>
            <p className="font-semibold">Spelling Error: {Math.round(Number(spelling))}%</p>
            <p className="font-semibold pt-2 mb-6">Grammar Error: {Math.round(Number(grammar))}%</p>
        </div>
    );
}
 
export default DisplayLexical;