import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './useAuthContext'
import supabase from '../config/supabaseClient';


export const useLogin = (setToken) => {
    const [formErr, setFormErr] = useState('');
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()
    
    let navigate = useNavigate();
  
    const login = async (email, password) => {
      setIsLoading(true)
  
      try{
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        // console.log(data, error)  

        if (error) {
            setFormErr(error.message);
            setIsLoading(false);
        } else {
            // save the user to local storage
            localStorage.setItem('user', JSON.stringify(data))
          
            // update the auth context
            dispatch({type: 'LOGIN', payload: data})

            // update loading state
            setIsLoading(false)

            //setToken
            setToken(data);

            // console.log(data)
            // console.log(data.user.user_metadata.id)

            if (data.user.user_metadata.role === 'instructor') {
              navigate(`/InsHomepage/${data.user.user_metadata.id}`);
            } else if (data.user.user_metadata.role === 'student') {
              navigate(`/StudHomepage/${data.user.user_metadata.id}`);
            }

        }
      } catch (error) {
        console.log('Error:', error);
        setFormErr(error.message);
        setIsLoading(false)
      }
    }
  
    return { login, isLoading, formErr }
  }