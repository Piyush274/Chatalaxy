import React, { useState } from 'react';
import CreatePost from "../pages/CreatePost";
import Posts from "../components/Posts";
import { FaCompass, FaUserFriends } from "react-icons/fa";

export default function HomePage() {
  const [feedType, setFeedType] = useState('forYou');

  return (
    <div className='w-full lg:w-2/3 p-4 min-h-screen'>
        
      <div className='flex flex-row border-b border-white/10 pb-2 mb-6'>
        <button
          onClick={() => setFeedType('forYou')}
          className={`flex items-center justify-center gap-2 cursor-pointer w-1/2 px-4 py-3 transition-colors ${
            feedType === 'forYou'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-white/60 hover:text-white/90'
          }`}
        >
          <FaCompass className="text-lg" />
          <h2 className='text-lg font-medium'>For You</h2>
        </button>

        <button
          onClick={() => setFeedType('following')}
          className={`flex items-center justify-center gap-2 cursor-pointer w-1/2 px-4 py-3 transition-colors ${
            feedType === 'following'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-white/60 hover:text-white/90'
          }`}
        >
          <FaUserFriends className="text-lg" />
          <h2 className='text-lg font-medium'>Following</h2>
        </button>
      </div>

      <div className='mb-6'>
        <CreatePost />
      </div>

      <div>
        <Posts feedType={feedType} />
      </div>
    </div>
  );
}