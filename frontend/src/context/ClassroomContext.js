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
        // case 'GET_ENROL_STUDENT':
        //     // alert("Get enrolled student");
        //     return {
        //         enrolledStudents:  action.payload
        //     }
        // case 'ENROL_STUDENT':
        //     return {
        //         enrolledStudents: [action.payload, ...state.enrolledStudents]
        //     }
        // case 'REMOVE_ENROL_STUDENT':
        //     return {
        //         enrolledStudents: state.enrolledStudents.filter((w) => w.student.stud_id !== action.payload.student.stud_id)
        //     }
        
        // case 'GET_ASSIGNMENT':
        //     return {
        //         assignment: action.payload
        //     }
        case 'LOGOUT':
            return {
                classroom: null,
                enrolledClassrooms: null,
                // enrolledStudents: null
            }
        default:
            return state;
    }
}

export const ClassroomContextProvider = ({children}) => {

    const [state,dispatch] = useReducer(classroomReducer,{
        classroom:null,
        enrolledClassrooms: null
        // enrolledStudents: null,
        // assignment: null
    });
    

    return ( 
        <ClassroomContext.Provider value = {{...state,dispatch}}>
            {children}
        </ClassroomContext.Provider>
     );
}