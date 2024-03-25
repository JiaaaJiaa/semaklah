const StudHomepage = ({token}) => {

    return ( 
        <div className='pt-16'>
            <h1>Welcome student, {token.user.user_metadata.fname} {token.user.user_metadata.lname}</h1>

        </div>

     );
}
export default StudHomepage;