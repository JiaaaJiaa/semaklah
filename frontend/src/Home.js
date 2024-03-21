import React, { useEffect, useState } from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import InsHomepage from './pages/InsHomepage';
import { Routes, Route } from 'react-router-dom';

const Home = () => {
    
    const [token, setToken] = useState(false);

    if(token){
    sessionStorage.setItem('token', JSON.stringify(token));
    }

    useEffect(() => {
    if(sessionStorage.getItem('token')){
        let data = JSON.parse(sessionStorage.getItem('token'));
        setToken(data);
    }
    },[])

    
    return ( 
    <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login setToken={setToken}/>} />
        {token?<Route path="/inshomepage"  element={<InsHomepage token={token} />} />:""}
    </Routes>
     );
}
 
export default Home;