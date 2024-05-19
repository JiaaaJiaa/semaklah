const DisplayLexical= ({submission}) => {

    //Fetch the lexical analysis from the database

    return ( 
        <div>
            <p>Display Lexical Analysis</p>
            <p>{submission.sub_id}</p>
        </div>

     );
}
 
export default DisplayLexical;