import React from 'react'
import { FaUser,FaTrash} from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import {Skeleton} from "@/components/ui/skeleton"
import { Link } from 'react-router-dom';
import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function NotificationPage()
 {

    const queryClient = useQueryClient();

    const {data:notifications,isPending}=useQuery({
        queryKey:['notifications'],
        queryFn:async ()=>{
          try
          {
             const res=await fetch('/api/notification');
             const data=await res.json();
             if (!res.ok) throw new Error(data.error || 'Something went wrong');           
             return data;           
          }
          catch(error)
          {
            throw new Error(error);
          }       
        }
      })    
   
    const {mutate}=useMutation({
        mutationFn: async () => {
            try {
              const res = await fetch('/api/notification', {method: 'DELETE'});
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || 'Failed to delete notification');
              return data;
            } 
            catch (error) {
              throw new Error(error);
            }
            },
        onSuccess: () => {
            toast.success('Notification deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
          },
    })


  return (
    <div className='w-2/3 p-4 min-h-screen'>

    <div className="flex items-center justify-between mb-6">
        <p className="text-xl font-semibold text-gray-800">Notifications</p>
        <button
            className="flex mr-6 items-center gap-2 text-md text-gray-600 hover:text-red-500 transition duration-200"
            onClick={mutate}
        >
            <FaTrash />
        </button>
    </div>

    {isPending && (
                <div className='flex flex-col gap-4'>
                    <Skeleton className="w-full h-10 rounded-full" />
                    <Skeleton className="w-full h-10 rounded-full" />
                    <Skeleton className="w-full h-10 rounded-full" />
                    <Skeleton className="w-full h-10 rounded-full" />
                </div>
            )}

    {notifications?.length === 0 && (
        <div className="text-center text-gray-500 text-lg">No notifications yet</div>
    )}

    {notifications?.map((x) => (
        <div key={x._id} className="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition duration-200">
            <div className="flex items-center gap-4">
                
                <div className="text-xl text-gray-700">
                    {x.type === "follow" && <FaUser className="text-blue-500" />}
                    {x.type === "like" && <FaHeart  className='text-red-500'/>}
                </div>

                
                <Link to={`/profile/${x.from.username}`} className="flex items-center gap-3 flex-1">
                    <img
                        className="w-8 h-8 rounded-full object-cover"
                        src={x.from.profileImg}
                        alt="avatar"
                        onError={(e) => { e.target.onerror = null; e.target.src = "/profileDefault.jpg" }}
                    />
                    <div className="text-sm text-gray-700">
                        <span className="font-semibold">@{x.from.username}</span>{" "}
                        {x.type === "follow" && "followed you"}
                        {x.type === "like" && "liked your post"}
                    </div>
                </Link>
            </div>
        </div>
    ))}
</div>
  )
}
