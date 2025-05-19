import React from 'react'
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from '@tanstack/react-query';
import { useFollow } from './hooks/useFollow';
import { FaUserPlus } from "react-icons/fa";

export default function RightPanel() {
    const { data: suggestedUsers, isLoading } = useQuery({
        queryKey: ['suggestedUsers'],
        queryFn: async () => {
            try {
                const res = await fetch('/api/user/suggested');
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Something went wrong');
                return data;
            } catch (error) {
                throw new Error(error);
            }
        }
    });

    const { follow } = useFollow();

    return (
        <div 
            className="hidden lg:block w-72 sticky top-0 right-0 p-4 border-l border-white/10 bg-white/5 backdrop-blur-sm overflow-y-auto"
            style={{
                height: '100vh' // Full viewport height
            }}
        >
            <div className="flex flex-col gap-4 h-full">
                <h2 className="text-lg font-semibold text-white/90 mb-2 flex items-center gap-2">
                    <FaUserPlus className="text-blue-400" />
                    <span>Who to follow</span>
                </h2>

                <div className="flex-1 overflow-y-auto">
                    {isLoading && (
                        <div className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center space-x-4 p-2">
                                    <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-3 w-3/4 rounded bg-white/10" />
                                        <Skeleton className="h-2 w-1/2 rounded bg-white/10" />
                                    </div>
                                    <Skeleton className="h-8 w-20 rounded-full bg-white/10" />
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && suggestedUsers?.map((user) => (
                        <Link to={`/profile/${user.username}`} key={user._id}>
                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 transition duration-200 group">
                                <div className="flex items-center gap-3">
                                    <img
                                        className="w-10 h-10 rounded-full object-cover border-2 border-white/20 group-hover:border-blue-400 transition-colors"
                                        src={user?.profileImg || "/profileDefault.jpg"}
                                        alt="avatar"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "/profileDefault.jpg"; }}
                                    />
                                    <div className="text-left">
                                        <span className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                                            {user?.fullName}
                                        </span>
                                        <span className="text-xs text-white/60 block">
                                            @{user?.username}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1.5 rounded-full hover:opacity-90 transition duration-200 flex items-center gap-1"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        follow(user._id);
                                    }}
                                    style={{
                                        boxShadow: '0 2px 10px rgba(59, 130, 246, 0.3)'
                                    }}
                                >
                                    <FaUserPlus className="text-xs" />
                                    Follow
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}