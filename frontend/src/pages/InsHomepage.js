import React from 'react';
import { Link, useNavigate } from "react-router-dom";

const InsHomepage = ({token}) => {

    let navigate = useNavigate();

    async function handleLogout(e){
        e.preventDefault();
        console.log('logging out');
        sessionStorage.removeItem('token');
        navigate('/');
    }


    return ( 
        <div>
            <h1>Welcome back, {token.user.user_metadata.fname} {token.user.user_metadata.lname}</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>

     );
}
 
export default InsHomepage;