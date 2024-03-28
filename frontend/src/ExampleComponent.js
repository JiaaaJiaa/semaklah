import logo from '../assets/WhiteLogo.png'; // replace with the actual path to your logo file
import Link from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../context/useAuthContext';


import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Navbar() {

    const { logout } = useLogout();
    const { user } = useAuthContext();

    const handleClick = () => {
        logout();
    }

    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    // const session = supabase.auth.session();
    // isLoggedIn = session && session !== null;

    return (
    <Disclosure as="nav" className="bg-cyan-950">
        {({ open }) => (
        <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
                
                {user && (


                )}
                
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div className="flex flex-shrink-0 items-center">
                        <img
                        className="h-14 w-auto"
                        src={logo}
                        />
                    </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                {/* Profile dropdown */}
                
                <Menu as="div" className="relative ml-3">
                    <div>
                    <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <div className="relative w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                            <svg className="absolute w-10 h-10 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                        </div>
                    </Menu.Button>
                    </div>
                    <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                    >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                        {({ active }) => (
                            <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                            Logout
                            </a>
                        )}
                        </Menu.Item>
                    </Menu.Items>
                    </Transition>
                </Menu>
                </div>
            </div>
            </div>

            {/* <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                >
                    {item.name}
                </Disclosure.Button>
                ))}
            </div>
            </Disclosure.Panel> */}
        </>
        )}
    </Disclosure>
    )
}

export default Navbar;

<form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="academicYear">
            Academic Year
        </label>
        <select name="academicYear" value={form.academicYear} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Select Academic Year</option>
            <option value="23/24">23/24</option>
        </select>
    </div>

    <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="semester">
            Semester
        </label>
        <select name="semester" value={form.semester} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Select Semester</option>
            <option value="1">1</option>
            <option value="2">2</option>
        </select>
    </div>

    <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="semester">
            Course Code
        </label>
        <input name="courseCode" value={form.courseCode} onChange={handleChange} placeholder="Course Code" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
    </div>

    <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="semester">
            Course Name
        </label>
        <input name="courseName" value={form.courseName} onChange={handleChange} placeholder="Course Name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
    </div>

    <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="semester">
            Course Description
        </label>
        <textarea name="courseDescription" value={form.courseDescription} onChange={handleChange} placeholder="Course Description" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
    </div>

    <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="semester">
            Course Limit
        </label>
        <input type="number" name="classroomLimit" value={form.classroomLimit} onChange={handleChange} placeholder="Classroom Limit" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>            
    </div>

    <div className="flex items-center justify-between">
        <button 
            className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" 
            type="submit">    
            Create
        </button>
    </div>
</form>