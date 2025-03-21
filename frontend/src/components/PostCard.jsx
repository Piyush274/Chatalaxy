import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaRegHeart, FaRegBookmark, FaRegComment } from 'react-icons/fa';
import { BiRepost } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { formatPostDate } from '../utils/date/index.js';

export default function PostCard({ post }) 
{
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({ queryKey: ['authUser'] });

  const postOwner = post.user;

  const isMyPost = authUser?._id === postOwner._id; //For enabling delete button

  const isLiked = post.likes.includes(authUser?._id); //For enabling like button

  const formattedDate = formatPostDate(post.createdAt); //For formatting date when the post was created using createdAt

  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [comment, setComment] = useState('');

  const [comments,setComments]=useState(post.comments);

  //Delete Post Mutation
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/post/delete/${post._id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to delete post');
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success('Post deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
  
   
  //Like Post Mutation
  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/post/like/${post._id}`, { method: 'POST' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to like post');
        return data.likes;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      //Caching data to only like/unlike without refetching
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      // queryClient.setQueryData(['posts'], (oldPosts) => {
      //   return oldPosts.map((x) => {
      //     if (x._id === post._id) {
      //       return { ...x, likes: updatedLikes };
      //     }
      //     return x;
      //   });
      // });
    },
  });


  //Comment Post Mutation
  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/post/comment/${post._id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: comment }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to comment post');
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (newComment) => {
      toast.success('Comment added successfully');
      setComment('');
      setComments((prevComments) => [...prevComments, newComment]);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.log("Error in comment post mutation",error.message);
    },
  });


  const handleDeletePost = () => {
    if (isDeleting) return;
    deletePost();
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    setDialogOpen(false);
    commentPost();
  };


  return (
    <div className='flex items-start gap-4 p-6 border border-gray-200 rounded-lg shadow-sm bg-white'>
      <div>
        <Link to={`/profile/${postOwner?.username}`}>
          <img
            className='w-12 h-12 rounded-full object-cover'
            src={postOwner?.profileImg}
            onError={(e) => { e.target.onerror = null; e.target.src = "/profileDefault.jpg"; }}
            alt='avatar'
          />
        </Link>
      </div>

      <div className='flex-1'>
        <div className='flex items-center gap-2'>
          <Link to={`/profile/${postOwner?.username}`}>
            <h2 className='font-semibold text-gray-800 hover:underline'>{postOwner?.fullName}</h2>
          </Link>
          <Link to={`/profile/${postOwner?.username}`}>
            <h2 className='text-sm text-gray-500 hover:underline'>@{postOwner?.username}</h2>
          </Link>
          <span className='text-sm text-gray-400'>{formattedDate}</span>
          {isMyPost && (
            <button
              onClick={handleDeletePost}
              disabled={isDeleting}
              className='ml-auto text-gray-500 hover:text-red-600'
            >
              <FaTrash />
            </button>
          )}
        </div>

        <div className='mt-2'>
          <p className='text-gray-700'>{post?.text}</p>
        </div>

        {post.img && (
          <div className='mt-4 flex justify-center'>
            <img
              className='w-full max-w-md rounded-lg object-cover'
              src={post?.img}
              alt='Post Image'
            />
          </div>
        )}

        <div className='flex items-center justify-between mt-4 text-gray-500'>
          <button
            onClick={handleLikePost}
            disabled={isLiking}
            className='flex items-center gap-1 hover:text-red-600' > <FaRegHeart className={isLiked ? 'text-red-600' : ''} />
            <span>{post.likes.length}</span>
          </button>

          <button
            onClick={() => setDialogOpen(true)}
            className='flex items-center gap-1 hover:text-blue-600'
          >
            <FaRegComment />
            <span>{post.comments.length}</span>
          </button>

          {dialogOpen && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
              <div className='bg-white p-6 rounded-lg w-full max-w-md'>
                <h2 className='text-lg font-semibold mb-4'>Add a comment...</h2>
                <div>
                  {comments.map((comment) => (
                    <div key={comment._id} className='flex items-center gap-2 mb-2'>
                      <img
                        className='w-8 h-8 rounded-full object-cover'
                        src={comment?.user.profileImg}
                        alt='avatar'
                        onError={(e) => { e.target.onerror = null; e.target.src = "/profileDefault.jpg"; }}
                      />
                      <div>
                        <h3 className='font-semibold'>{comment?.user.fullName}</h3>
                        <p>{comment?.text}</p>  
                      </div>
                    </div>
                  ))}
                </div>
                <Input
                  type='text'
                  placeholder='Post your comment'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className='mt-2'
                />
                <div className='mt-4 flex justify-end'>
                  <Button onClick={() => setDialogOpen(false)} className='mr-2'>
                    Cancel
                  </Button>
                  <Button onClick={handlePostComment} disabled={isCommenting}>
                    {isCommenting ? 'Commenting...' : 'Comment'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <button className='flex items-center gap-1 hover:text-green-600'>
            <BiRepost />
            <span>0</span>
          </button>

          <button className='hover:text-yellow-600'>
            <FaRegBookmark />
          </button>
        </div>
      </div>
    </div>
  );
}