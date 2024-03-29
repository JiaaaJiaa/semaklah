import { ClassroomContext } from "../context/ClassroomContext";
import { useContext } from "react";

export const useClassroomContext = () => {
    const context = useContext(ClassroomContext);
    if(context === undefined){
        throw new Error('useClassroomContext must be used within a ClassroomContextProvider');
    }
    return context;
}