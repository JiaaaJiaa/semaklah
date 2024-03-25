import React from 'react';

const InsHomepage = ({token}) => {

    return ( 
        <div className='pt-16'>
            <h1>Hello, {token.user.user_metadata.fname} {token.user.user_metadata.lname}</h1>
            

            <div>
                <h2>Course 1</h2>
                <p>Course 1 description</p>
            </div>
        </div>

     );
}
 
export default InsHomepage;

