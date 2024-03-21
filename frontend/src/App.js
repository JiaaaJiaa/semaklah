import React, { useEffect, useState } from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import InsHomepage from './pages/InsHomepage';
import Navbar from './components/navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App(){

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

  return(
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login setToken={setToken}/>} />
          {token?<Route path="/inshomepage"  element={<InsHomepage token={token} />} />:""}
        </Routes>
      </div>
    </Router>
  );
}

export default App;