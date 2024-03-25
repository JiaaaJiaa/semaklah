import React, { useState } from 'react';
import { useSignup } from '../hooks/useSignup';

const Signup = () => {
    const [fname, setFname] = useState( );
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [role, setRole] = useState('');
    const [id, setId] = useState('');
    const { signup, isLoading, formErr} = useSignup();


  
    async function handleSignup(e) {
      e.preventDefault();

      await signup(fname,lname,email, password,gender,role,id);

    // This won't happen because the input fields are required
    //   if(!fname || !lname || !email || !password || !gender || !role || !id){
    //     setFormErr('Please fill in all fields');
    //     return;
    //   }
    }
  
    return (
      <div className="flex items-center justify-center pt-16 h-auto bg-cyan-50">
        <div  className="bg-white p-8 rounded shadow-md w-96 mt-5 mb-5">
            <h4 className="text-2xl font-bold mb-4">Sign Up</h4>
            {formErr && <div className="text-red-500 mb-2">{formErr}</div>}
            <form onSubmit={handleSignup}>
                <label>Instructor ID or Student ID:</label>
                <input 
                name='id'
                value={id}
                required
                onChange={(e) => setId(e.target.value)}
                className="w-full p-2 mb-5 border border-gray-300 rounded"
                />
                <label>First Name:</label>
                <input 
                name='fname'
                value={fname}
                required
                onChange={(e) => setFname(e.target.value)}
                className="w-full p-2 mb-5 border border-gray-300 rounded"
                />
                <label>Last Name:</label>         
                <input 
                name='lname'
                value={lname}
                required
                onChange={(e) => setLname(e.target.value)}
                className="w-full p-2 mb-5 border border-gray-300 rounded"
                />
                <label>Email:</label>
                <input 
                name='Email'
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-5 border border-gray-300 rounded"
                />
                <label>Password:</label>
                <input 
                name='Password'
                type='password'
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-5 border border-gray-300 rounded"
                />

              <div className="flex items-start mb-4 space-x-8">
                <div className="flex flex-col mb-5">
                  <span className="mb-2">Gender:</span>
                  <div className="flex">
                    <div
                      onClick={() => setGender('female')}
                      className={`p-2 border border-gray-300 rounded mr-2 cursor-pointer ${gender === 'female' ? 'bg-cyan-600 text-white' : ''}`}
                    >
                      Female
                    </div>
                    <div
                      onClick={() => setGender('male')}
                      className={`p-2 border border-gray-300 rounded cursor-pointer ${gender === 'male' ? 'bg-cyan-600 text-white' : ''}`}
                    >
                      Male
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="mb-2">Role:</span>
                  <div className="flex">
                    <div
                      onClick={() => setRole('instructor')}
                      className={`p-2 border border-gray-300 rounded mr-2 cursor-pointer ${role === 'instructor' ? 'bg-cyan-600 text-white' : ''}`}
                    >
                      Instructor
                    </div>
                    <div
                      onClick={() => setRole('student')}
                      className={`p-2 border border-gray-300 rounded cursor-pointer ${role === 'student' ? 'bg-cyan-600 text-white' : ''}`}
                    >
                      Student
                    </div>
                  </div>
                </div>
              </div>

                <button 
                type="submit" 
                disabled={isLoading}
                className="w-full p-2 mb-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded"
                >
                  Sign up
                </button>

                <p>Already have an account? 
                  <a href="/" className='underline'>Login</a>
                </p>
     

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