import React, { useState } from 'react';
import supabase from '../config/superbaseClient';
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [fname, setFname] = useState( );
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [role, setRole] = useState('');
    const [id, setId] = useState('');

    const [formErr, setFormErr] = useState('');
    let navigate = useNavigate();
  
    async function handleLogin(e) {
      e.preventDefault();

    // This won't happen because the input fields are required
    //   if(!fname || !lname || !email || !password || !gender || !role || !id){
    //     setFormErr('Please fill in all fields');
    //     return;
    //   }

    // HOW TO HANDLE FORM ERRORS

      try{
        const { user, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options:{
            data:{
              id: id,
              fname: fname,
              lname: lname,
              gender: gender,
              role: role
            }
          }
        });

        if (error) {
            // setFormErr is a function that updates the formErr state
            setFormErr(error.message);
          } else {
            navigate('/');
          }
        } catch (error) {
          // This block will handle any other errors, like network issues
            setFormErr(error.message);
        }
    }
  
    return (
      <div>
        <div>
            <h4>Sign Up</h4>
        </div>
        <div>
            <form onSubmit={handleLogin}>
                <label>Matric Number or Staff ID:</label>
                <input 
                name='id'
                value={id}
                required
                onChange={(e) => setId(e.target.value)}
                />
                <label>First Name:</label>
                <input 
                name='fname'
                value={fname}
                required
                onChange={(e) => setFname(e.target.value)}
                />
                <label>Last Name:</label>         
                <input 
                name='lname'
                value={lname}
                required
                onChange={(e) => setLname(e.target.value)}
                />
                <label>Email:</label>
                <input 
                name='Email'
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                />
                <label>Password:</label>
                <input 
                name='Password'
                type='password'
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                />
                <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                >
                    <option value="">Select Gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                </select>
                <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                >
                    <option value="">Select Role</option>
                    <option value="instructor">Instructor</option>
                    <option value="student">Student</option>
                </select>
                <button type="submit">Sign Up</button>

                {formErr && <div className='text-danger'>{formErr}</div>}
            </form>
        </div>
    </div>


    );
}
 
export default Signup;


{/* <form onSubmit={registration} ref={formRef}>
<div className="form-group mb-1">
  <label htmlFor="username">Username</label>
  <input type="text" name='username' className="form-control" id="username" required/>
  {usernameErr && <div className='text-danger'>{usernameErr}</div>}
</div>
<div className="form-group mb-1">
  <label htmlFor="first_name">First Name</label>
  <input type="text" name='first_name' className="form-control" id="first_name" required/>
</div>
<div className="form-group mb-1">
  <label htmlFor="last_name">Last Name</label>
  <input type="text" name='last_name' className="form-control" id="last_name" required/>
</div>
<div className="form-group mb-1">
  <label htmlFor="email">Email address</label>
  <input type="email" name='email' className="form-control" id="email" required/>
  {emailErr && <div className='text-danger'>{emailErr}</div>}
</div>
<div className="form-group mb-1">
  <label htmlFor="password">Password</label>
  <input type="password" name='password' className="form-control" id="password" required/>
  {passwordErr && <div className='text-danger'>{passwordErr}</div>}
</div>
<div className="form-group mb-3">
  <label htmlFor="password2">Confirm Password</label>
  <input type="password" name='password2' className="form-control" id="password2" required/>
  {passwordErr && <div className='text-danger'>{passwordErr}</div>}
</div>
<div className='d-flex flex-column justify-content-between align-items-center'>
  <button type="submit" className="btn btn-custom-green d-flex alight-items-center">
    <div className='text-white me-2 mt-1'>Confirm Register</div>
    {spinner && 
      <div className="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    }
    
  </button>
  <Link className='text-decoration-none mt-2' to='/login'>Already have an Account?</Link>
</div>
</form> */}