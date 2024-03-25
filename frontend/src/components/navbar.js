import logo from '../assets/WhiteLogo.png'; // replace with the actual path to your logo file
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';


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

    return (
        <Disclosure as="nav" className="fixed w-full bg-cyan-950">
        {({ open }) => (
        <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 ">
            <div className="relative flex h-16 items-center justify-between ">
                
                {!user? (
                <div className="flex flex-1 items-center justify-start sm:items-stretch">
                    <div className="flex flex-shrink-0 items-center">
                        <img
                        className="h-14 w-auto"
                        src={logo}
                        />
                    </div>
                </div>
                ):(
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div className="flex flex-shrink-0 items-center">
                        <img
                        className="h-14 w-auto"
                        src={logo}
                        />
                    </div>
                </div>
                )}
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                
                    {/* Profile dropdown */}

                    {user && (
                        <Menu as="div" className="relative ml-3">
                            <div>
                            <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                <span className="absolute -inset-1.5" />
                                <span className="sr-only">Open user menu</span>
                                <div class="relative w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                    <svg class="absolute w-10 h-10 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
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
                                    onClick={handleClick}
                                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                    >
                                    Logout
                                    </a>
                                )}
                                </Menu.Item>
                            </Menu.Items>
                            </Transition>
                        </Menu>
                    )}

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