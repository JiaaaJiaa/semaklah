import React, { useEffect, useState } from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import InsHomepage from './pages/InsHomepage';
import StudHomepage from './pages/StudHompage';
import CourseDetails from './pages/CourseDetails';
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
        {token && token.user.user_metadata.role === 'instructor'?<Route path="/InsHomepage/:id"  element={<InsHomepage token={token} />} />:""}
        {token && token.user.user_metadata.role === 'student'?<Route path="/StudHomepage/:id"  element={<StudHomepage token={token} />} />:""}
        <Route path="/course/:id" element={<CourseDetails />}  />  
    </Routes>
     );
}
 
export default Home;