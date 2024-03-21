import React, { useState } from 'react';
import supabase from '../config/superbaseClient';

const Signup = () => {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [role, setRole] = useState('');
    const [id, setId] = useState('');
  
    async function handleLogin(e) {
      e.preventDefault();
  
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
        console.log(user);
      } catch (error) {
        console.log('Error:', error);
      }
    }
  
    return (
      <form onSubmit={handleLogin}>
        <input 
          placeholder='id'
          name='id'
          required
          onChange={(e) => setId(e.target.value)}
         />
        <input 
          placeholder='fname'
          name='fname'
          required
          onChange={(e) => setFname(e.target.value)}
         />
         <input 
          placeholder='lname'
          name='lname'
          required
          onChange={(e) => setLname(e.target.value)}
         />
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
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="instructor">Instructor</option>
          <option value="student">Student</option>
        </select>
        <button type="submit">Sign Up</button>
      </form>
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