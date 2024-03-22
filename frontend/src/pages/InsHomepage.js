import React from 'react';

const InsHomepage = ({token}) => {

    return ( 
        <div>
            <h1>Welcome back, {token.user.user_metadata.fname} {token.user.user_metadata.lname}</h1>

        </div>

     );
}
 
export default InsHomepage;