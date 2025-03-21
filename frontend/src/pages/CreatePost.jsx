import { useQuery, useQueryClient,useMutation } from '@tanstack/react-query';
import React from 'react'
import { useState } from 'react';
import { useRef } from 'react';
import { CiImageOn } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
import {toast} from 'react-hot-toast';

export default function CreatePost() {

  const [text,setText] = useState("");

  const [img,setImg] = useState(null);

  const imgRef = useRef(null);

  const {data:authUser}=useQuery({queryKey:['authUser']})

  const queryClient=useQueryClient();

  const {mutate:createPost,isPending:isLoading,isError,error}=useMutation({
    mutationFn:async({text,img})=>
    {
      try
      {
        const res=await fetch('/api/post/create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,img})});  
        const data=await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create post');
        return data
      }
      catch(error)
      {
        throw new Error(error);
      }
    },
    onSuccess:()=>{
      setText('');
      setImg(null);
      toast.success('Post created successfully');
      queryClient.invalidateQueries({queryKey:['posts']}); //Refetch the data and update the ui   
    },
  })



  //Basically useRef is used to select input which is hidden and when other button is clicked it is shown using its reference
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if(isLoading) return; //Prevent multiple clicks(requests)
    createPost({text,img}); 
  }

  const handleImgChange = (e) => {
    const file=e.target.files[0]; // e.target.files Retrieves a FileList object containing all the files selected by the user,files[0]: Accesses the first file from the list

    //Target to convert into base 64 which can be embedded directly in html otherwise through css
    if (file)
    {
        const reader=new FileReader(); //JavaScript API that reads file content asynchronously,Converts files (like images) into formats such as base64 which can be displayed in the browser
        reader.onload=()=>//reader.onload: An event handler that triggers when the file is successfully read
        {
            setImg(reader.result); // reader.result: Contains the file data in base64 format after reading.
            //setImag:Updates the img state with the base64 string, enabling the image preview.
        }
        reader.readAsDataURL(file); //Reads the file content and converts it into a base64-encoded string
    }
  }

  const handleRemoveImg = () => 
    {
    setImg(null); // Reset the image state
    imgRef.current.value = null;  // Reset the image state
    }

  

  return (
<div className="p-6 bg-white rounded-lg shadow-md">

<div className="flex items-center space-x-4 mb-6">
  <img
    src={authUser.profileImg}
    alt="avatar"
    onError={(e) => { e.target.onerror = null; e.target.src = "/profileDefault.jpg"; }}
    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
  />
  <span className="font-semibold text-gray-800">@{authUser.username}</span>
</div>
 
<form onSubmit={handleSubmit} className="space-y-4">

  <textarea
    placeholder="What is on your mind?"
    value={text}
    onChange={(e) => setText(e.target.value)}
    rows={4}
    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
  />


  <div className="flex items-center justify-between">

    <div className="flex items-center space-x-4">
      <CiImageOn onClick={() => imgRef.current.click()} className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-500"/>

      <input
        hidden
        ref={imgRef}
        type="file"
        onChange={handleImgChange}
        accept="image/*" />

    </div>

    <button
      type="submit"
      disabled={isLoading}
      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
      {isLoading ? "Posting..." : "Post"}
    </button>

  </div>

  {img && (
    <div className="relative mt-4 w-32 h-32">
      <IoCloseSharp
        onClick={handleRemoveImg}
        className="absolute top-2 right-2 w-6 h-6 text-white bg-gray-800 rounded-full p-1 cursor-pointer hover:bg-gray-700"
      />
      <img
        src={img}
        alt="uploaded-img"
        className="w-full h-full rounded-lg object-cover"
      />
    </div>
  )}

  {isError && (
    <div className="text-red-500 text-sm mt-4">
      {error.message}
    </div>
  )}
</form>
</div>

  )
}
