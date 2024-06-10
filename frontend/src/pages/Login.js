import { Link } from "react-router-dom";
import React, { useState } from 'react';
import { useLogin } from '../hooks/useLogin';


const Login = ({setToken}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, formErr} = useLogin(setToken);

    // const [loading, setLoading] = useState(false);


    async function handleLogin(e) {
      e.preventDefault();

      await login(email, password);   
    }
  
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-t from-cyan-100 to-cyan-50">
      <div  className="bg-white p-8 rounded shadow-md w-96 mt-3 mb-3">
          <h4 className="text-2xl font-bold mb-4">Login</h4>
          {formErr && <div className="text-red-500 mb-2">{formErr}</div>}     
          <form onSubmit={handleLogin}>
            <label>Email:</label>
            <input 
              placeholder='*@usm.my or any *.usm.my subdomains'
              name='Email'
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-2 mb-5 border border-gray-300 rounded"
            />
            <br/>
            <label>Password:</label>
            <input 
              placeholder='Password'
              name='Password'
              type='password'
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-2 mb-5 border border-gray-300 rounded " fdprocessedid="9o0dc8"
            />
            <br/>


            {isLoading && <p>Logging in...</p>}

            {!isLoading && (
              <>
              
                <button 
                type="submit" 
                disabled={isLoading}
                className="w-full p-2 mb-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded"
                >
                  Login
                </button>
                <p className="text-center mb-3">or</p>
                <Link to="/signup"><button className="w-full border-2 p-2 mb-3 bg-white hover:bg-gray-50 text-black rounded">Sign Up</button></Link>
                
              </>
            )}
          </form>
      </div>
    </div>
    );
}
 
export default Login;