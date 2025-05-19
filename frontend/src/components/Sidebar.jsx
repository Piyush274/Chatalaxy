import React, { useState } from 'react';
import { FaWarehouse, FaUserTie, FaBell } from "react-icons/fa";
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
                return data;
            } catch (error) {
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

    const closeSidebar = () => {
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            {!isSidebarOpen && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-lg md:hidden z-50 border border-white/30 hover:bg-white/30 transition-all"
                    style={{
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                >
                    <RiMenuUnfoldFill className="text-xl text-white" />
                </button>
            )}

            {/* Sidebar */}
            <div
                className={`fixed md:sticky top-0 left-0 w-64 min-h-screen flex flex-col p-4 bg-white/5 border-r border-white/10 backdrop-blur-sm transform transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 z-40`}
                style={{
                    boxShadow: '5px 0 15px rgba(0,0,0,0.1)',
                    height: '100vh', // Full viewport height
                    overflowY: 'auto' // Enable scrolling if content exceeds height
                }}
            >
                {/* Close Button (Mobile) */}
                {isSidebarOpen && (
                    <button
                        onClick={toggleSidebar}
                        className="absolute top-4 right-4 p-1 text-white hover:text-gray-300 md:hidden"
                    >
                        <RiCloseFill className="text-2xl" />
                    </button>
                )}

                {/* User Profile */}
                {data && (
                    <Link to={`/profile/${data?.username}`} onClick={closeSidebar}>
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/20 transition duration-200 mb-6">
                            <div className="flex items-center gap-3">
                                <img
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                                    src={data?.profileImg || "/profileDefault.jpg"}
                                    onError={(e) => { e.target.onerror = null; e.target.src = "/profileDefault.jpg"; }}
                                    alt="avatar"
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-white">{data?.fullName}</span>
                                    <span className="text-xs text-white/70">@{data?.username}</span>
                                </div>
                            </div>
                            <BiLogOut
                                className="text-xl text-white/70 hover:text-red-400 cursor-pointer transition-colors"
                                onClick={handleLogout}
                            />
                        </div>
                    </Link>
                )}

                {/* Navigation Links */}
                <ul className="flex flex-col gap-1 mt-2">
                    <Link to="/" onClick={closeSidebar}>
                        <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition duration-200 group">
                            <FaWarehouse className="text-xl text-white/80 group-hover:text-blue-300 transition-colors" />
                            <span className="text-white/80 group-hover:text-white font-medium">Home</span>
                        </li>
                    </Link>
                    <Link to="/notifications" onClick={closeSidebar}>
                        <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition duration-200 group">
                            <FaBell className="text-xl text-white/80 group-hover:text-purple-300 transition-colors" />
                            <span className="text-white/80 group-hover:text-white font-medium">Notifications</span>
                        </li>
                    </Link>
                    <Link to={`/profile/${data?.username}`} onClick={closeSidebar}>
                        <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition duration-200 group">
                            <FaUserTie className="text-xl text-white/80 group-hover:text-green-300 transition-colors" />
                            <span className="text-white/80 group-hover:text-white font-medium">Profile</span>
                        </li>
                    </Link>
                </ul>

                {/* Decorative Elements */}
                <div className="mt-auto">
                    <div className="h-px bg-white/20 my-4"></div>
                    <p className="text-xs text-white/50 text-center">
                        Chatalaxy © {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </>
    );
}