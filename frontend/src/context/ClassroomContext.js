import { createContext, useReducer } from "react";

export const ClassroomContext = createContext();

export const classroomReducer = (state,action) => {
    switch(action.type){
        case 'GET_CLASSROOM':
            return {
                classroom: action.payload
            }
        case 'CREATE_CLASSROOM':
            // console.log(action.payload); 
            // console.log(state.classroom);
            return {                
                classroom: [action.payload,...state.classroom]
            }
        case 'REMOVE_CLASSROOM':
            return {
                classroom: state.classroom.filter((w)=> w.classroom_id !== action.payload.classroom_id)
            }
        case 'UPDATE_CLASSROOM':
            return {
                classroom: state.classroom.map((w) => w.classroom_id === action.payload.classroom_id ? action.payload : w)
            }
        case 'ENROL_CLASSROOM':
            return {
                enrolledClassrooms: [action.payload, ...state.enrolledClassrooms]
            }
        case 'GET_ENROLLED_CLASSROOMS':

            return {
                ...state,
                enrolledClassrooms: action.payload
            }
        case 'LOGOUT':
            return {
                classroom: null,
                enrolledClassrooms: null
            }
        default:
            return state;
    }
}

export const ClassroomContextProvider = ({children}) => {

    const [state,dispatch] = useReducer(classroomReducer,{
        classroom:null,
        enrolledClassrooms: null
    });
    

    return ( 
        <ClassroomContext.Provider value = {{...state,dispatch}}>
            {children}
        </ClassroomContext.Provider>
     );
}