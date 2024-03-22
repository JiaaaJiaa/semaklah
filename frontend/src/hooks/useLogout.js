import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  let navigate = useNavigate();


  const logout = () => {
    sessionStorage.removeItem('token');

    // remove user from storage
    localStorage.removeItem('user')

    // dispatch logout action
    dispatch({ type: 'LOGOUT' })

    navigate('/');
  }

  return { logout }
}