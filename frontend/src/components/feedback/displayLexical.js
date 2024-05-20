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
            <p className="font-semibold pt-2">Spelling: {Number(spelling).toFixed(2)}%</p>
            <p className="font-semibold pt-2">Grammar: {Number(grammar).toFixed(2)}%</p>
        </div>
    );
}
 
export default DisplayLexical;