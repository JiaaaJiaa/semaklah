import { Link, useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import supabase from '../config/superbaseClient';


const Login = ({setToken}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErr, setFormErr] = useState('');

    let navigate = useNavigate();

    async function handleLogin(e) {
      e.preventDefault();
  
      try{
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        // console.log(data, error)  

        if (error) {
            setFormErr(error.message);
        } else {
            setToken(data);
            navigate('/inshomepage');
        }
      } catch (error) {
        console.log('Error:', error);
        setFormErr(error.message);
      }
    }
  
    return (
      <form onSubmit={handleLogin}>
        <input 
          placeholder='Email'
          name='Email'
          required
          onChange={(e) => setEmail(e.target.value)}
         />
        <input 
          placeholder='Password'
          name='Password'
          type='password'
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>

        {formErr && <div className='text-danger'>{formErr}</div>}
        <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    );
}
 
export default Login;