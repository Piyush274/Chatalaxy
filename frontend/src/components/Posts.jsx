import React, { useEffect, useState } from 'react'
import PostCard from './PostCard.jsx';
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from '@tanstack/react-query';
import { FaCompass, FaUserFriends, FaHeart, FaUser } from "react-icons/fa";

export default function Posts({ feedType, username, id }) {
  const [posts, setPosts] = useState([]);
  const [openCommentId, setOpenCommentId] = useState(null); // State to track which post's comments are open
  
  const getPostEndpoint = () => {
    switch(feedType) {
      case 'forYou': 
        return `/api/post/all`;
      case 'following': 
        return `/api/post/followingPosts`;
      case 'posts': 
        return `/api/post/userPosts/${username}`;
      case 'likes': 
        return `/api/post/likedPost/${id}`;
      default: 
        return `/api/post/all`;
    }
  }

  const POST_ENDPOINT = getPostEndpoint();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['posts', feedType],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();
        setPosts(data);
        if (!res.ok) throw new Error(data.error || 'Something went wrong');
        return data;
      } catch(error) {
        throw new Error(error);
      }
    }
  });
  
  useEffect(() => { 
    refetch();
    // Close any open comment dialog when feed type changes
    setOpenCommentId(null);
  }, [feedType, refetch]);

  const getFeedTitle = () => {
    switch(feedType) {
      case 'forYou': 
        return { title: "For You", icon: <FaCompass className="text-blue-400" /> };
      case 'following': 
        return { title: "Following", icon: <FaUserFriends className="text-purple-400" /> };
      case 'posts': 
        return { title: "Your Posts", icon: <FaUser className="text-green-400" /> };
      case 'likes': 
        return { title: "Liked Posts", icon: <FaHeart className="text-red-400" /> };
      default: 
        return { title: "Posts", icon: <FaCompass className="text-blue-400" /> };
    }
  };

  const feedInfo = getFeedTitle();

  return (
    <div className='flex flex-col gap-6 mt-4'>
      <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
        {feedInfo.icon}
        <h2 className="text-lg font-semibold text-white/90">{feedInfo.title}</h2>
      </div>
      
      {(isLoading || isRefetching) && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center space-x-3 mb-3">
                <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-32 rounded bg-white/10" />
                  <Skeleton className="h-2 w-24 rounded bg-white/10" />
                </div>
              </div>
              <Skeleton className="h-4 w-full rounded bg-white/10 mb-2" />
              <Skeleton className="h-4 w-3/4 rounded bg-white/10" />
              <div className="flex gap-4 mt-4">
                <Skeleton className="h-8 w-20 rounded-full bg-white/10" />
                <Skeleton className="h-8 w-20 rounded-full bg-white/10" />
                <Skeleton className="h-8 w-20 rounded-full bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isRefetching && posts && (
        <div className="space-y-4 ">
          {posts?.map((post) => (
            <PostCard 
              key={post._id} 
              post={post} 
              openCommentId={openCommentId}
              setOpenCommentId={setOpenCommentId}
            />
          ))}
          
          {posts.length === 0 && (
            <div className="text-center py-8 text-white/60">
              <p>No posts found. Start connecting with others!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}