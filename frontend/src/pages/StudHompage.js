const StudHomepage = ({token}) => {

    return ( 
        <div className='pt-16 p-10'>
            <h1 className='text-gray-700 text-2xl text-center font-bold'>
            Welcome student, {token.user.user_metadata.fname} {token.user.user_metadata.lname}</h1>

            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3">
                <div className="md:flex">
                    <div className="p-8">
                        <h2 className="text-2xl font-bold">Course 1</h2>
                        <p className="mt-2 text-gray-500">Course 1 description</p>
                    </div>
                </div>
            </div>

        </div>

     );
}
export default StudHomepage;