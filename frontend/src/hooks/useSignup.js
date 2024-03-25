import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { useNavigate } from "react-router-dom";
import supabase from '../config/supabaseClient'

export const useSignup = () => {
    const [formErr, setFormErr] = useState('');
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    let navigate = useNavigate();

  const signup = async (fname,lname,email, password,gender,role,id) => {
    setIsLoading(true)

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
          setIsLoading(false)
          setFormErr(error.message);
        } else {
          // save the user to local storage
          localStorage.setItem('user', JSON.stringify(user))
  
          // update the auth context
          dispatch({type: 'LOGIN', payload: user})
  
          // update loading state
          setIsLoading(false)
          navigate('/');
        }
      } catch (error) {
        // This block will handle any other errors, like network issues
          setFormErr(error.message);
      }
  }

  return { signup, isLoading, formErr }
}