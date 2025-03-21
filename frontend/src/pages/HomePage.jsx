import React from 'react'
import CreatePost from "../pages/CreatePost";
import Posts from "../components/Posts";
import { useState} from 'react';



export default function HomePage() {

   
   const[feedType,setFeedType]=useState('forYou')



  return (

<div className='w-2/3 p-4 min-h-screen'>

{/* Tabs for "For You" and "Following" */}
<div className='flex flex-row border-b pb-2 mb-6'>
  <div 
	onClick={() => setFeedType('forYou')}
	className={`cursor-pointer w-1/2 text-center px-4 py-2 ${
	  feedType === 'forYou' 
		? 'border-b-2 border-blue-500 text-blue-500 font-semibold' 
		: 'text-gray-500 hover:text-gray-700'
	}`}
  >
	<h2 className='text-lg'>For You</h2>
  </div>

  <div 
	onClick={() => setFeedType('following')}
	className={`cursor-pointer w-1/2 text-center px-4 py-2 ${
	  feedType === 'following' 
		? 'border-b-2 border-blue-500 text-blue-500 font-semibold' 
		: 'text-gray-500 hover:text-gray-700'
	}`}
  >
	<h2 className='text-lg'>Following</h2>
  </div>
</div>

<div>
  <CreatePost />
</div>

<div>
  <Posts feedType={feedType} />
</div>

</div>
  

  
  )
}
