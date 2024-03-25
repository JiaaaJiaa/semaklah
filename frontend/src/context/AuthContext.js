import { createContext, useReducer, useEffect } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload }
    case 'LOGOUT':
      return { user: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { 
    user: null
  })

  useEffect(() => {
    const userItem = localStorage.getItem('user');
    if (userItem !== null && userItem !== "undefined") {
        try {
          const user = JSON.parse(userItem);
    
          if (user) {
            dispatch({ type: 'LOGIN', payload: user }) 
          }
        } catch (error) {
          console.error('Error parsing user from local storage:', error);
        }
      }
  }, [])

  // console.log('AuthContext state:', state)
  
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  )

}