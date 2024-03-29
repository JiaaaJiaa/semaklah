import { createContext, useReducer } from "react";

export const ClassroomContext = createContext();

export const classroomReducer = (state,action) => {
    switch(action.type){
        case 'GET_CLASSROOM':
            return {
                classroom: action.payload
            }
        case 'CREATE_CLASSROOM':
            console.log(action.payload); 
            // console.log(state.classroom);
            return {                
                classroom: [action.payload,...state.classroom]
            }
        case 'REMOVE_CLASSROOM':
            return {
                classroom: state.classroom.filter(classroom => classroom.id !== action.payload)
            }
        default:
            return state;
    }
}

export const ClassroomContextProvider = ({children}) => {

    const [state,dispatch] = useReducer(classroomReducer,{
        classroom:null
    });
    

    return ( 
        <ClassroomContext.Provider value = {{...state,dispatch}}>
            {children}
        </ClassroomContext.Provider>
     );
}