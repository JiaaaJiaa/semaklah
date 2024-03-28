const classroomlist = ({classroom}) => {
    return ( 

    <div className="p-5 mx-20 mt-2 mb-2 bg-white shadow-sm rounded-lg" key={classroom.id}>
        <h2 className="text-2xl font-semibold text-gray-800">{classroom.course_code}</h2>
        <p className="mt-2 text-gray-600">{classroom.course_name}</p>
    </div>        
        
     );
}
 
export default classroomlist;