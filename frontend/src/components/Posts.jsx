import React, { useEffect } from 'react'
import PostCard from './PostCard.jsx';
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function Posts({feedType,username,id}) {

  const [posts, setPosts] = useState([]);
  
  
  const getPostEndpoint=()=>{
    
    if (feedType==='forYou') return `/api/post/all`;

    else if (feedType==='following') return `/api/post/followingPosts`;

    else if (feedType==='posts') return `/api/post//userPosts/${username}`;

    else if (feedType==='likes') return `/api/post/likedPost/${id}`;

    else return  `/api/post/all`;
 
  }

  const POST_ENDPOINT=getPostEndpoint();

  const {data, isLoading, refetch, isRefetching}=useQuery({
    queryKey:['posts'],
    queryFn:async()=>{
      try
      {
        const res=await fetch(POST_ENDPOINT); //By default fetch is get
        const data=await res.json();
        setPosts(data);
        console.log('Post data',data);

        if (!data.ok) throw new Error(data.error || 'Something went wrong');  //If res is not ok
        return data;
      }
      catch(error)
      {
        throw new Error(error);
      }
    }
  })
  
  useEffect(()=>{ refetch() },[feedType])  //use effect when feed type changes

  console.log('external posts from query',data)  
  console.log('external posts from useState',posts)  


  return (
    <div className='flex flex-col gap-4 mt-8'>
         
       {(isLoading || isRefetching ) && (
         <> 
           
           <Skeleton className="w-full h-16 rounded-full" />
           <Skeleton className="w-full h-16 rounded-full" />
           <Skeleton className="w-full h-16 rounded-full" />

         </>
       )}

			{!isLoading && !isRefetching && posts && (

				<div>

					{posts?.map((x) => ( <PostCard key={x._id} post={x}/>))}
				

				</div>

			)}

    </div>
  )
}
