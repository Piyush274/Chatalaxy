import React from 'react';
import { FaUser, FaTrash, FaHeart } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FaRegBell, FaBellSlash } from "react-icons/fa";
import { formatDistanceToNow } from 'date-fns';

export default function NotificationPage() {
    const queryClient = useQueryClient();

    const { data: notifications, isPending, error } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const res = await fetch('/api/notification');
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to fetch notifications');
            }
            return res.json();
        },
        retry: 2,
        staleTime: 1000 * 60 * 5 // 5 minutes
    });

    const { mutate: deleteAllNotifications, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/notification', { method: 'DELETE' });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to clear notifications');
            }
            return res.json();
        },
        onSuccess: () => {
            toast.success('Notifications cleared');
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    if (error) {
        return (
            <div className="w-full lg:w-2/3 p-4 min-h-screen flex items-center justify-center">
                <div className="text-center p-6 bg-red-900/20 rounded-xl border border-red-500/30">
                    <h3 className="text-lg text-red-400 mb-2">Error loading notifications</h3>
                    <p className="text-white/70">{error.message}</p>
                    <button 
                        onClick={() => queryClient.refetchQueries(['notifications'])}
                        className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full lg:w-2/3 p-4 min-h-screen space-y-4'>
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                    <FaRegBell className="text-xl text-blue-400" />
                    <h1 className="text-xl font-semibold text-white">Notifications</h1>
                </div>
                <button
                    className={`flex items-center gap-2 ${notifications?.length ? 'text-white/60 hover:text-red-400' : 'text-white/30 cursor-not-allowed'} transition-colors group`}
                    onClick={deleteAllNotifications}
                    disabled={!notifications?.length || isDeleting}
                >
                    {isDeleting ? (
                        <span className="flex items-center gap-2">
                            <span className="animate-spin">🌀</span>
                            <span className="text-sm hidden sm:inline">Clearing...</span>
                        </span>
                    ) : (
                        <>
                            <FaTrash className="group-hover:scale-110 transition-transform" />
                            <span className="text-sm hidden sm:inline">Clear All</span>
                        </>
                    )}
                </button>
            </div>

            {/* Loading State */}
            {isPending && (
                <div className='space-y-3'>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-3 w-3/4 rounded bg-white/10" />
                                    <Skeleton className="h-2 w-1/2 rounded bg-white/10" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isPending && !notifications?.length && (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <FaBellSlash className="text-4xl text-white/40 mb-4" />
                    <h3 className="text-lg text-white/70 mb-1">No notifications yet</h3>
                    <p className="text-sm text-white/50">Your notifications will appear here</p>
                </div>
            )}

            {/* Notifications List */}
            <div className="space-y-3">
                {notifications?.map((notification) => (
                    <div 
                        key={notification._id} 
                        className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-colors duration-200"
                    >
                        <div className="flex items-start gap-4">
                            {/* Notification Icon */}
                            <div className={`p-3 rounded-full flex-shrink-0 ${
                                notification.type === "follow" ? "bg-blue-900/30 text-blue-400" : 
                                notification.type === "like" ? "bg-red-900/30 text-red-400" : "bg-white/10"
                            }`}>
                                {notification.type === "follow" ? <FaUser /> : <FaHeart />}
                            </div>

                            {/* Notification Content */}
                            <div className="flex-1 min-w-0">
                                <Link 
                                    to={`/profile/${notification.from.username}`} 
                                    className="group flex items-center gap-3 mb-1"
                                >
                                    <img
                                        className="w-8 h-8 rounded-full object-cover border border-white/20 group-hover:border-blue-400 transition-colors"
                                        src={notification.from.profileImg}
                                        alt="avatar"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "/profileDefault.jpg" }}
                                    />
                                    <span className="font-medium text-white group-hover:text-blue-300 transition-colors truncate">
                                        @{notification.from.username}
                                    </span>
                                </Link>
                                <p className="text-white/70 mb-1">
                                    {notification.type === "follow" ? "started following you" : "liked your post"}
                                </p>
                                <p className="text-xs text-white/40">
                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}