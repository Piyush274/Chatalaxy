import React, { useState } from 'react';
import { FaWarehouse, FaUserTie, FaSnapchatGhost } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { RiMenuUnfoldFill, RiCloseFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function Sidebar() {
    const queryClient = useQueryClient();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { mutate: logout } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch('/api/auth/logout', { method: 'POST' });  
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to logout');
                console.log('Logout console', data);
                return data;
            } catch (error) {
                console.log('Logout console', error);
                throw error;
            }
        },
        onSuccess: () => {
            toast.success('Logout Successful');
            queryClient.invalidateQueries(['authUser']);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };

    const { data } = useQuery({ queryKey: ['authUser'] });

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Function to close the sidebar when a link is clicked
    const closeSidebar = () => {
        if (window.innerWidth < 768) { // Check if the screen is smaller than medium size
            setIsSidebarOpen(false);
        }
    };

    return (
        <>
            {/* Toggle Button for Small Screens */}
            {!isSidebarOpen && <button
                onClick={toggleSidebar}
                className="fixed top-3 left-4 p-2 bg-white rounded-lg md:hidden z-50"
            >
                 <RiMenuUnfoldFill className="text-xl" />
            </button>}

            {/* Sidebar */}
            <div
                className={`fixed md:relative w-64 h-screen flex flex-col p-4 border-r bg-white transform transition-transform duration-200 ease-in-out ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 z-40`}
            >
                {data && (
                    <Link to={`/profile/${data?.username}`} onClick={closeSidebar}>
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-200 transition duration-200 border-b shadow">
                            <div className="flex items-center gap-2">
                                <img
                                    className="w-8 h-8 rounded-full object-cover"
                                    src={data?.profileImg ||  "/profileDefault.jpg"}
                                    onError={(e) => { e.target.onerror = null; e.target.src = "/profileDefault.jpg"; }}
                                    alt="avatar"
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">{data?.fullName}</span>
                                    <span className="text-xs text-gray-500">@{data?.username}</span>
                                </div>
                            </div>
                            <BiLogOut
                                className="text-xl text-gray-700 cursor-pointer hover:text-red-500"
                                onClick={handleLogout}
                            />
                        </div>
                    </Link>
                )}

                <ul className="flex flex-col gap-3 ml-2 mt-5">
                    <Link to="/" onClick={closeSidebar}>
                        <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 transition duration-200">
                            <FaWarehouse className="text-xl text-gray-700" />
                            <span className="text-gray-700">Home</span>
                        </li>
                    </Link>
                    <Link to="/notifications" onClick={closeSidebar}>
                        <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 transition duration-200">
                            <FaSnapchatGhost className="text-xl text-gray-700" />
                            <span className="text-gray-700">Notifications</span>
                        </li>
                    </Link>
                    <Link to={`/profile/${data?.username}`} onClick={closeSidebar}>
                        <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 transition duration-200">
                            <FaUserTie className="text-xl text-gray-700" />
                            <span className="text-gray-700">Profile</span>
                        </li>
                    </Link>
                </ul>
            </div>
        </>
    );
}