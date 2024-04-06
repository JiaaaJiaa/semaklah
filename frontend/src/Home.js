import React, { useEffect, useState } from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import InsHomepage from './pages/InsHomepage';
import StudHomepage from './pages/StudHompage';
import CourseDetails from './pages/CourseDetails';
import EnrolledCourseDetails from './pages/EnrolledCourseDetails';
import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuthContext } from './hooks/useAuthContext';

const Home = () => {
    
    const [token, setToken] = useState(false);
    // const { user } = useAuthContext();

    // console.log("User:" + user);
    // console.log("Token" + token);

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
        <Route 
            path="/course/:id" 
            element={token? <CourseDetails />: <Navigate to="/" /> }  
        />  
        <Route 
            path="/enrolledcourse/:id" 
            element={token? <EnrolledCourseDetails />: <Navigate to="/" /> }  
        />  
    </Routes>
     );
}
 
export default Home;