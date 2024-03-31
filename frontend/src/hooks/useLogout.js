import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom';
import { useClassroomContext } from './useClassroomContext';

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  const { dispatch: dispatchClassroom } = useClassroomContext()

  let navigate = useNavigate();


  const logout = () => {
    sessionStorage.removeItem('token');

    // remove user from storage
    localStorage.removeItem('user')

    // dispatch logout action
    dispatch({ type: 'LOGOUT' })

    // dispatch logout action
    dispatchClassroom({ type: 'LOGOUT' })

    navigate('/');
  }

  return { logout }
}