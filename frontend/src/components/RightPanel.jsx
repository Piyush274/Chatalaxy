import React from 'react'
import {Link} from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from '@tanstack/react-query';
import {useFollow} from './hooks/useFollow';

export default function RightPanel() 
{

    const {data:suggestedUsers,isLoading}=useQuery({
      queryKey:['suggestedUsers'],
      queryFn:async()=>
      {
        try
        {
        const res=await fetch('/api/user/suggested');
        const data=await res.json();
        if (!res.ok) throw new Error(data.message || 'Something went wrong');       
        return data;       
        }
        catch(error)
        {
          throw new Error(error);
        }       
      }
})
  const {follow}=useFollow();

  return ( 

<div className="w-1/6 h-screen p-4 text-center border-l border-gray-200">
    <div className="flex flex-col gap-4">

        <h2 className="text-lg font-semibold text-gray-800">Who to follow</h2>

        {isLoading && (
            <>
                <Skeleton className="w-full h-10 rounded-full" />
                <Skeleton className="w-full h-10 rounded-full" />
                <Skeleton className="w-full h-10 rounded-full" />
                <Skeleton className="w-full h-10 rounded-full" />
            </>
        )}

        {!isLoading &&
            suggestedUsers?.map((x) => (
                <Link to={`/profile/${x.username}`} key={x._id}>
                    <div className="flex-row md-lg:flex space-y-2  items-center justify-between  p-2 rounded-lg hover:bg-gray-100 transition duration-200">
                    
                        <div className="flex items-center gap-2">
                            <img
                                className="w-8 h-8 rounded-full object-cover"
                                src={x?.profileImg || "/profileDefault.jpg"}
                                alt="avatar"
                                onError={(e) => { e.target.onerror = null; e.target.src = "/profileDefault.jpg"; }}
                            />
                            <div className="text-left">
                                <span className="text-sm font-semibold">{x?.fullName}</span>
                                <span className="text-xs text-gray-500 block">@{x?.username}</span>
                            </div>
                        </div>

                     
                        <button
                            className="text-sm sm:mt-2 lg:mt-0  bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition duration-200"
                            onClick={(e) => {
                                e.preventDefault();
                                follow(x._id);
                            }}
                        >
                            Follow
                        </button>
                    </div>
                </Link>
            ))}
    </div>
</div>



  )
}
