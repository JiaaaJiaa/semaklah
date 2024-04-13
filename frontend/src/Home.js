import React, { useEffect, useState } from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import InsHomepage from './pages/Instructor/InsHomepage';
import StudHomepage from './pages/Student/StudHompage';
import CourseDetails from './pages/Instructor/CourseDetails';
import EnrolledCourseDetails from './pages/Student/EnrolledCourseDetails';
import AssignmentDetails from './pages/Instructor/AssignmentDetails';
import ViewSubmission from './pages/Instructor/ViewSubmission';
import { Routes, Route, Navigate } from 'react-router-dom';

//For Student page
import StudAssignmentDetails from './pages/Student/StudAssignmentDetails';
import StudSubmission from './pages/Student/StudSubmission';
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
        <Route 
            path="/assignment/:id" 
            element={token? <AssignmentDetails />: <Navigate to="/" /> }
        />
        <Route
            path="/viewsubmission/:id"
            element={token? <ViewSubmission />: <Navigate to="/" />}
        />
        <Route
            path="/studassignment/:id"
            element={token? <StudAssignmentDetails />: <Navigate to="/" />}
        />
        <Route
            path="/studsubmission/:id"
            element={token? <StudSubmission />: <Navigate to="/" />}
        />


    </Routes>
     );
}
 
export default Home;